import { NextRequest, NextResponse } from "next/server";

import { AUTH_TOKEN_KEY } from "@/constants";

// 인증이 필요 없는 경로
const PUBLIC_PATHS = ["/login", "/contact", "/_next", "/api", "/favicon.ico"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
