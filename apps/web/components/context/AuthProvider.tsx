import { useQueryClient } from "@tanstack/react-query";
import { setCookie, getCookie, deleteCookie } from "cookies-next";
import { createContext, useEffect, useState, useCallback } from "react";
import { useUserProfile } from "@/hooks/react-query/useUser";
import { decodeJwt } from "@workspace/utils";
import { useRouter } from "next/navigation";

import {
  ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRY,
} from "@/constants";

import { IUserProfile } from "@workspace/api";
import { handleLogout } from "@/utils/auth";

export interface IAuthToken {
  user_id: number;
  role: string;
  service: string;
  exp: number;
  token_type: string;
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

// --- 유틸 함수 분리 ---
function parseAuthToken(token: string): number | null {
  const decoded = decodeJwt<IAuthToken>(token);
  if (decoded?.exp && decoded.exp < Date.now() / 1000) {
    return null;
  }
  return decoded?.user_id ?? null;
}

function setAuthCookies(accessToken: string, refreshToken: string) {
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
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);

  const {
    data: userInfo,
    isLoading: userInfoLoading,
    refetch,
  } = useUserProfile(userId ?? 0, {
    enabled: typeof userId === "number" && userId !== null,
    retry: false,
  });

  // userInfo가 바뀔 때마다 context의 user를 동기화
  useEffect(() => {
    setUser(userInfo ?? null);
  }, [userInfo]);

  // 인증 초기화
  const initAuth = useCallback(async () => {
    setIsLoading(true);
    const token = getCookie(AUTH_TOKEN_KEY);
    const uid = token ? parseAuthToken(token as string) : null;
    if (uid) {
      setUserId(uid);
      setIsAuthenticated(true);
      const result = await refetch();
      if (result.data) {
        setUser(result.data);
      } else {
        _handleLogout();
      }
    } else {
      _handleLogout();
    }
    setIsLoading(false);
  }, [refetch]);

  useEffect(() => {
    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 로그인 api 요청후 context 업데이트
  const handleLogin = useCallback(
    async (accessToken: string, refreshToken: string) => {
      setAuthCookies(accessToken, refreshToken);
      const uid = parseAuthToken(accessToken);
      if (uid) {
        setUserId(uid);
        setIsAuthenticated(true);
        setIsLoading(true);
        const result = await refetch();
        if (result.data) {
          setUser(result.data);
          router.push("/");
        } else {
          _handleLogout();
        }
        setIsLoading(false);
      } else {
        _handleLogout();
      }
    },
    [refetch, router]
  );

  // 로그아웃
  const _handleLogout = useCallback(() => {
    setUserId(null);
    setIsAuthenticated(false);
    setUser(null);
    setIsLoading(false);
    queryClient.clear();
    handleLogout();
  }, [queryClient]);

  // 유저 정보 새로고침
  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await refetch();
      if (result.data) {
        setUser(result.data);
      } else {
        _handleLogout();
      }
    } catch {
      _handleLogout();
    }
    setIsLoading(false);
  }, [refetch, _handleLogout]);

  const contextValue: IAuthContextValue = {
    state: { isAuthenticated, user, isLoading },
    login: handleLogin,
    logout: _handleLogout,
    refreshUser,
    isLoading: isLoading || userInfoLoading,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
