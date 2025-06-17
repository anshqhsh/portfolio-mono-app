import { useQueryClient } from "@tanstack/react-query";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { createContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserProfile } from "@/hooks/react-query/useUser";
import { decodeJwt } from "@workspace/utils";
import {
  ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRY,
} from "@/constants";

import { IUserProfile } from "@workspace/api";

export interface IAuthToken {
  user_id: number;
  role: string; // user | admin
  service: string; // vegax | investor
  exp: number;
  token_type: string; // access
}

interface IAuthState {
  isAuthenticated: boolean;
  user: IUserProfile | null;
  isLoading: boolean;
}
interface IAuthContextValue {
  state: IAuthState;
  login: (accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

const defaultAuthContext: IAuthContextValue = {
  state: {
    isAuthenticated: false,
    user: null,
    isLoading: true,
  },
  login: async () => {
    throw new Error("AuthContext not initialized");
  },
  logout: () => {
    throw new Error("AuthContext not initialized");
  },
  refreshUser: async () => {
    throw new Error("AuthContext not initialized");
  },
  isLoading: false,
};
export const AuthContext = createContext<IAuthContextValue>(defaultAuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [state, setState] = useState<IAuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });
  const [userId, setUserId] = useState<number | null>(null);

  const userIdNumber = typeof userId === "number" ? userId : 0;
  const {
    data: userInfo,
    isLoading,
    refetch,
  } = useUserProfile(userIdNumber, {
    enabled: typeof userId === "number",
    retry: false,
  });

  useEffect(() => {
    const token = getCookie(AUTH_TOKEN_KEY);
    if (token) {
      const decoded = decodeJwt<IAuthToken>(token as string);
      if (decoded?.user_id) setUserId(decoded.user_id);
    }
  }, []);

  const refreshUser = async () => {
    try {
      const result = await refetch();
      if (result.data) {
        setState((prev) => ({
          ...prev,
          user: result.data,
          isAuthenticated: true,
          isLoading: false,
        }));
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      logout();
    }
  };

  useEffect(() => {
    if (userInfo) {
      setState((prev) => ({
        ...prev,
        user: userInfo,
        isAuthenticated: true,
        isLoading: false,
      }));
    }
  }, [userInfo]);

  const login = async (accessToken: string, refreshToken: string) => {
    setCookie(AUTH_TOKEN_KEY, accessToken, {
      maxAge: parseInt(ACCESS_TOKEN_EXPIRY),
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    setCookie(AUTH_REFRESH_TOKEN_KEY, refreshToken, {
      maxAge: parseInt(REFRESH_TOKEN_EXPIRY),
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    const decoded = decodeJwt<IAuthToken>(accessToken);
    if (decoded?.user_id) {
      setUserId(decoded.user_id);
      const result = await refetch();
      if (result.data) {
        router.push("/");
      }
    }
  };

  const logout = () => {
    deleteCookie(AUTH_TOKEN_KEY);
    deleteCookie(AUTH_REFRESH_TOKEN_KEY);
    setUserId(null);
    queryClient.clear();
    setState({
      isAuthenticated: false,
      user: null,
      isLoading: false,
    });
    router.push("/login");
  };

  const contextValue: IAuthContextValue = {
    state,
    login,
    logout,
    refreshUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

/**
 * 클라이언트 사이드(React 컴포넌트)에서 인증이 필요한 페이지를 감싸는 HOC(Higher-Order Component)입니다.
 * 현재는 인증 로직이 없지만, 추후 인증 체크/리다이렉트 등 클라이언트 보호 로직을 추가할 수 있습니다.
 *
 * 사용 예시:
 *   export default withAuth(MyProtectedPage);
 */
export function withAuth<P extends object>(
  PageComponent: React.ComponentType<P>
): React.ComponentType<P> {
  return (props: P) => <PageComponent {...props} />;
}

/**
 * 서버 사이드 렌더링(SSR)에서 인증이 필요한 페이지의 getServerSideProps를 감싸는 함수입니다.
 * 인증 토큰이 없고, 현재 페이지가 로그인/문의 페이지가 아니면 로그인 페이지로 리다이렉트합니다.
 *
 * 사용 예시:
 *   export const getServerSideProps = requireAuth(async (context) => { ... });
 */
export function requireAuth<G extends GetServerSideProps>(gssp: G): G {
  return (async (context: GetServerSidePropsContext) => {
    const { req, resolvedUrl } = context;
    const isAuthPage = resolvedUrl === "/login" || resolvedUrl === "/contact";
    const cookies = req.cookies;
    const token = cookies[AUTH_TOKEN_KEY];
    if (!token && !isAuthPage) {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
    // @ts-ignore
    return await gssp(context);
  }) as G;
}
