"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  setLogoutHandler,
  setRefreshTokenHandler,
  initializeApi,
} from "@workspace/api";
import {
  ACCESS_TOKEN_EXPIRY,
  AUTH_REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_EXPIRY,
  API_URL,
  AUTH_TOKEN_KEY,
} from "@/constants";

import { useEffect, useState } from "react";
import { handleLogout } from "@/utils/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        retry: 1,
      },
    },
  }));

  useEffect(() => {
    initializeApi({
      apiUrl: API_URL!,
      authTokenKey: AUTH_TOKEN_KEY!,
      authRefreshTokenKey: AUTH_REFRESH_TOKEN_KEY!,
      accessTokenExpiry: ACCESS_TOKEN_EXPIRY!,
      refreshTokenExpiry: REFRESH_TOKEN_EXPIRY!,
    });

    setLogoutHandler(handleLogout);

    setRefreshTokenHandler(async (refreshToken: string) => {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      const data = await res.json();
      return {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      };
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </QueryClientProvider>
  );
}
