import { api } from "../api";
import type {
  IPortfolioProduct,
  IOrderResponse,
  IOrderFee,
} from "../types/portfolio";

const isVusdcOrVdarc = (symbol: string) => {
  return symbol === "VUSDC" || symbol === "VDARC";
};

export const portfolioApi = {
  // portfoilo summary
  getOrderList: async () => {
    const data = await api.get<IPortfolioProduct[]>("/api/v2/orders/list");
    return data;
  },

  createBuyOrder: async (data: {
    user_id: number;
    product_name: string;
    currency_amount: number;
    currency: string;
  }) => {
    return api.post<{ data: IOrderResponse }>("/orders/buy", data);
  },

  estimateSellOrder: async (data: {
    user_id: number;
    product_name: string;
    currency: string;
    quantity: number;
  }) => {
    return api.post<{ data: IOrderFee }>("/order/estimate-sell", data);
  },

  createSellOrder: async (data: {
    user_id: number;
    product_name: string;
    currency: string;
    quantity: number;
  }) => {
    return api.post<{ data: IOrderResponse }>("/orders/sell", data);
  },
};
