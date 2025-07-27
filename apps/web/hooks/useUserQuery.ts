import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import { useUserProfile } from "@/hooks/react-query/useUser";
import { decodeJwt } from "@workspace/utils";
import { AUTH_TOKEN_KEY } from "@/constants";

export interface IAuthToken {
  user_id: number;
  role: string;
  service: string;
  exp: number;
  token_type: string;
}

function parseAuthToken(token: string): number | null {
  try {
    const decoded = decodeJwt<IAuthToken>(token);
    if (decoded?.exp && decoded.exp < Date.now() / 1000) {
      return null;
    }
    return decoded?.user_id ?? null;
  } catch {
    return null;
  }
}

export function useUserQuery() {
  const token = getCookie(AUTH_TOKEN_KEY);
  const userId = token ? parseAuthToken(token as string) : null;

  const {
    data: user,
    isLoading,
    refetch,
  } = useUserProfile(userId ?? 0, {
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5분
    retry: false,
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    refetch,
  };
}

export function useAuth() {
  return useUserQuery();
}
