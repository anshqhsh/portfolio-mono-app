import { jwtDecode } from "jwt-decode";

export const decodeJwt = <T>(jwt: string | null): T | null => {
  if (!jwt) return null;

  try {
    const decoded = jwtDecode<T>(jwt);
    return decoded;
  } catch (error) {
    return null;
  }
};
