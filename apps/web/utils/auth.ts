import { setCookie, deleteCookie } from "cookies-next";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_KEY,
  AUTH_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRY,
} from "@/constants";

export function setAuthCookies(accessToken: string, refreshToken: string) {
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

export function clearAuthCookies() {
  deleteCookie(AUTH_TOKEN_KEY);
  deleteCookie(AUTH_REFRESH_TOKEN_KEY);
}

export function useAuthActions() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const login = async (accessToken: string, refreshToken: string) => {
    setAuthCookies(accessToken, refreshToken);
    // 유저 쿼리를 무효화해서 새로운 토큰으로 다시 fetch
    await queryClient.invalidateQueries({ queryKey: ["user"] });
    router.push("/");
  };

  const logout = () => {
    clearAuthCookies();
    queryClient.removeQueries({ queryKey: ["user"] });
    router.push("/login");
  };

  return { login, logout };
}

// 글로벌 로그아웃 핸들러용
export function handleLogout() {
  clearAuthCookies();
  window.location.href = "/login";
}
