import { useQuery } from "@tanstack/react-query";
import { userKeys } from "./query-keys";
import { usersApi } from "@workspace/api";

/**
 * api/v2/users/me
 * 투자자 유저 정보 조회
 * @returns
 */
export function useUserProfile(
  id: number,
  params?: { enabled: boolean; retry: boolean }
) {
  return useQuery({
    queryKey: userKeys.getUserProfile,
    queryFn: () => usersApi.getUserProfile(id),
    enabled: params?.enabled, // 옵션 전달
    retry: params?.retry, // 옵션 전달
  });
}
