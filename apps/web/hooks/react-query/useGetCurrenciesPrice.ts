import { useQuery } from "@tanstack/react-query";
import { productKeys } from "./query-keys";
import { productApi } from "@workspace/api";

export const useGetCurrenciesPrice = () => {
  return useQuery({
    queryKey: productKeys.getCurrenciesPrice,
    queryFn: () => productApi.getCurrenciesPrice(),
  });
};
