import { useQuery } from "@tanstack/react-query";
import { orderKeys } from "./query-keys.js";
import { orderApi } from "@workspace/api";

export const useGetOrderList = () => {
  return useQuery({
    queryKey: orderKeys.getOrderList,
    queryFn: () => orderApi.getOrderList(),
  });
};
