import { getCookie, deleteCookie, setCookie } from "cookies-next";

interface ApiConfig {
  apiUrl: string;
  authTokenKey: string;
  authRefreshTokenKey: string;
  accessTokenExpiry: string;
  refreshTokenExpiry: string;
}

let config: ApiConfig = {
  apiUrl: "",
  authTokenKey: "",
  authRefreshTokenKey: "",
  accessTokenExpiry: "",
  refreshTokenExpiry: "",
};

export function initializeApi(apiConfig: ApiConfig) {
  config = apiConfig;
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
}

export interface ApiErrorResponse {
  detail: string;
  status_code?: number;
  original_error?: unknown;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public data: ApiErrorResponse,
    public name: string = "ApiError"
  ) {
    super(data.detail);
    this.name = name;
  }
}

// Token refresh state management
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 로그아웃 핸들러 콜백 기본값 (아무 동작 없음) - 커스텀 핸들러 설정 가능
let logoutHandler: () => void = () => {};

export function setLogoutHandler(handler: () => void) {
  logoutHandler = handler;
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

// 토큰 갱신 핸들러 콜백 기본값 (미구현 에러) - 커스텀 핸들러 설정 가능
let refreshTokenHandler: (
  refreshToken: string
) => Promise<{ accessToken: string; refreshToken?: string }> = async () => {
  throw new Error("refreshTokenHandler not implemented");
};

export function setRefreshTokenHandler(
  handler: (
    refreshToken: string
  ) => Promise<{ accessToken: string; refreshToken?: string }>
) {
  refreshTokenHandler = handler;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      // JSON 파싱 실패시 기본 에러 메시지
      errorData = {
        detail:
          response.status === 401
            ? "로그인이 필요합니다."
            : response.status === 403
              ? "권한이 없습니다."
              : response.status === 404
                ? "요청한 리소스를 찾을 수 없습니다."
                : response.status >= 500
                  ? "서버 오류가 발생했습니다."
                  : "알 수 없는 오류가 발생했습니다.",
        status_code: response.status,
      };
    }

    // 비즈니스 로직 에러는 ApiError로 처리
    if (response.status >= 400 && response.status < 500) {
      throw new ApiError(response.status, errorData);
    }

    // 서버 에러는 별도로 처리
    if (response.status >= 500) {
      console.error("Server Error:", errorData);
      throw new ApiError(response.status, {
        detail:
          "서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
        original_error: errorData,
      });
    }
  }

  const contentType = response.headers.get("content-type");
  if (contentType?.includes("text/csv")) {
    return response.text() as Promise<T>;
  }

  try {
    return await response.json();
  } catch (e) {
    console.error("Response parsing error:", e);
    return null as T;
  }
}

async function request<T>(
  endpoint: string,
  requestConfig: RequestConfig = {}
): Promise<T> {
  if (!config.apiUrl) {
    throw new Error("API has not been initialized. Call initializeApi first.");
  }

  const { params, body, headers: customHeaders, ...restConfig } = requestConfig;
  const token = getCookie(config.authTokenKey);

  const headers = new Headers({
    ...(token && { Authorization: `Bearer ${token}` }),
    ...customHeaders,
  });

  // FormData인 경우 Content-Type 헤더를 설정하지 않음
  if (!(body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const url = new URL(endpoint, config.apiUrl);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const handleLogout = () => {
    logoutHandler();
  };

  try {
    let requestBody: BodyInit | null | undefined = undefined;

    if (body) {
      if (body instanceof FormData) {
        requestBody = body;
      } else if (
        headers.get("Content-Type") === "application/x-www-form-urlencoded"
      ) {
        requestBody = body as string;
      } else {
        requestBody = JSON.stringify(body);
      }
    }

    const response = await fetch(url.toString(), {
      ...restConfig,
      headers,
      body: requestBody,
    });

    // 401 에러는 인증 실패이므로 로그인 페이지로 리다이렉트
    if (response.status === 401 && !endpoint.includes("/auth/login")) {
      handleLogout();
      throw new ApiError(401, { detail: "Authentication failed" });
    }

    // 403일 때 토큰 갱신 시도 (로그인 요청 제외)
    if (response.status === 403 && !endpoint.includes("/auth/login")) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const refreshToken = getCookie(config.authRefreshTokenKey);
          if (!refreshToken) {
            handleLogout();
            throw new ApiError(403, { detail: "No refresh token available" });
          }

          const newAccessToken = "";

          setCookie(config.authTokenKey, newAccessToken, {
            maxAge: parseInt(config.accessTokenExpiry),
            path: "/",
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
          });

          isRefreshing = false;
          onRefreshed(newAccessToken);

          // 원래 요청 재시도
          headers.set("Authorization", `Bearer ${newAccessToken}`);
          const retryResponse = await fetch(url.toString(), {
            ...restConfig,
            headers,
            body: requestBody,
          });

          return handleResponse<T>(retryResponse);
        } catch (refreshError) {
          isRefreshing = false;
          handleLogout();
          if (refreshError instanceof ApiError) {
            throw refreshError;
          }
          throw new ApiError(403, { detail: "Token refresh failed" });
        }
      }
      // 다른 요청이 토큰을 갱신하는 동안 대기
      return new Promise((resolve) => {
        addRefreshSubscriber((token: string) => {
          headers.set("Authorization", `Bearer ${token}`);
          resolve(
            fetch(url.toString(), {
              ...restConfig,
              headers,
              body: requestBody,
            }).then((response) => handleResponse<T>(response))
          );
        });
      });
    }

    return handleResponse<T>(response);
  } catch (error) {
    if (error instanceof ApiError) {
      console.error("API Error:", error);
      throw error;
    }
    // 네트워크 에러
    console.error("Network Error:", error);
    throw new ApiError(0, { detail: "Network error occurred" });
  }
}

export const api = {
  get: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "GET" }),

  post: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "POST",
      body: data as BodyInit,
    }),

  patch: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "PATCH",
      body: data as BodyInit,
    }),

  put: <T>(endpoint: string, data?: unknown, config?: RequestConfig) =>
    request<T>(endpoint, {
      ...config,
      method: "PUT",
      body: data as BodyInit,
    }),

  delete: <T>(endpoint: string, config?: RequestConfig) =>
    request<T>(endpoint, { ...config, method: "DELETE" }),
};
