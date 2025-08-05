import { AUTH_REFRESH_TOKEN_KEY } from "@/constants";

import { AUTH_TOKEN_KEY } from "@/constants";
import { deleteCookie } from "cookies-next";

export function handleLogout() {
  deleteCookie(AUTH_TOKEN_KEY);
  deleteCookie(AUTH_REFRESH_TOKEN_KEY);
  window.location.href = "/login";
}
