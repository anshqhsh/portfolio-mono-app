import { api } from "../../api";

// 토큰 타입 정의(decoded token)
export interface IAuthToken {
  user_id: number;
  role: string; // user | admin
  service: string; // vegax | investor
  exp: number;
  token_type: string; // access
}

interface IAuthLoginRequest {
  username: string;
  password: string;
  grant_type?: string;
  scope?: string;
  client_id?: string;
  client_secret?: string;
}

interface IAuthLoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
export const authApi = {
  postAuthLogin: async ({ username, password, ...rest }: IAuthLoginRequest) => {
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // URL 인코딩된 폼 데이터로 변환
    const formData = new URLSearchParams({
      username,
      password,
      ...rest, // 추가 옵션이 있다면 덮어쓰기
    }).toString();
    return api.post<IAuthLoginResponse>(
      "api/v2/auth/login",
      {
        username,
        password,
        ...rest,
      },
      {
        headers: {
          accept: "application/json",
        },
      }
    );
  },
};

export default authApi;
