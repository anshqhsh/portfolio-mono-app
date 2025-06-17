import { useQueryClient } from "@tanstack/react-query";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { createContext, useEffect, useState } from "react";
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
