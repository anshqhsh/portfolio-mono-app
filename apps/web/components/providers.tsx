"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { setLogoutHandler, setRefreshTokenHandler } from "@workspace/api";

export function Providers({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    setLogoutHandler(() => {
      window.location.href = "/login";
    });

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
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      {children}
    </NextThemesProvider>
  );
}
