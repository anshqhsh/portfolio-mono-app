import { useQuery } from "@tanstack/react-query";
import { productKeys } from "./query-keys.js";
import { productApi } from "@workspace/api";

export const useGetProducts = () => {
  return useQuery({
    queryKey: productKeys.getProducts,
    queryFn: () => productApi.getProducts(),
  });
};
