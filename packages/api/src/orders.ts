import { api } from "../api";
import { IPaginatedResponse } from "../types/common";
import { IProduct } from "./product";

export type OrderStatusType = "complete" | "pending" | "canceled";

export interface IOrder {
  id: number;
  user_id: number;
  email: string;
  type: "buy" | "sell";
  currency: string;
  created_at: number;
  status: OrderStatusType;
  amount: number;
  initial_value: number;
  quantity: number;
  product: IProduct;
}

// 주문 관련 메타데이터 타입
export interface IOrderListResponse extends IPaginatedResponse<IOrder> {
  pending_orders_count: number;
}

export interface IOrderListParams {
  page?: number;
  limit?: number;
  email?: string;
  status?: string;
  type?: string;
  date?: string;
  product?: string;
}

// only use edit
export interface IOrderUpdateParams {
  type: string;
  user_id: number;
  product_ticker: string;
  currency: string;
  quantity: number;
  currency_amount: number;
}
// only use sell order
export interface IOrderSellParams {
  user_id: number;
  product_name: string;
  currency: string;
  quantity: number;
}
export interface IOrderBuyParams {
  user_id: number;
  product_name: string;
  currency_amount: number;
  currency: string;
}

// crypto strategy 타입
export interface StrategyOrderListItem {
  symbol: string;
  amount: number;
  quantity: number;
  initial_value: number;
  starting_balance: number;
  type: null;
  created: number;
  product: IProduct;
  fee: number | null;
  initial_value_currency: number;
  amount_with_profit: number | null;
}

// Fixed Income, Preferred Return 등 (product가 string)
export interface FixedIncomeOrderListItem {
  id: number;
  user_id: number;
  product: string;
  product_id: number;
  symbol: string;
  type_name: string; // 'PREFERRED_RETURN' | 'FIXED_INCOME'
  currency: string;
  principal: number;
  principal_before_fee: number;
  upfront_fee_percent: number;
  interest_rate: number;
  accrued_interest_without_reduction: number;
  accrued_interest: number;
  lockup_period: number;
  lockup_status: string;
  days_until_unlock: number;
  days_until_maturity: number;
  status: string;
  start_datetime: string;
  maturity_datetime: string;
}

// SMA 타입
export interface SmaOrderListItem {
  investment_id: number;
  product_id: number;
  user_id: number;
  type_name: string; // 'SMA'
  symbol: string;
  current_balance: number;
  net_deposit: number;
  start_datetime: string;
  total_pnl_amount: number;
  cummulative_pnl_percent: number;
  yearly_pnl_percent: number;
  principal: number;
  currency: string;
}

export type OrderListItem =
  | StrategyOrderListItem
  | FixedIncomeOrderListItem
  | SmaOrderListItem;

export interface IPortfolio {
  dataset: number[];
  labels: number[];
}

export const orderApi = {
  getOrders: async (data: IOrderListParams) => {
    const searchParams = new URLSearchParams();

    // Set default values
    searchParams.set("page", (data.page || 1).toString());
    searchParams.set("limit", (data.limit || 10).toString());

    // Add optional parameters if they exist
    if (data.email) searchParams.set("email", data.email);
    if (data.status) searchParams.set("status", data.status);
    if (data.type) searchParams.set("type", data.type);
    if (data.date) searchParams.set("date", data.date);

    if (data.product) searchParams.set("product", data.product);
    const queryString = searchParams.toString();
    const url = queryString
      ? `/api/v2/orders/?${queryString}`
      : "/api/v2/orders";
    return api.get<IOrderListResponse>(url);
  },
  getOrderList: async () => {
    return api.get<OrderListItem[]>("/api/v2/orders/list");
  },
  createBuyOrder: async (data: IOrderBuyParams) => {
    return api.post("/api/v2/orders/buy", data);
  },
  createSellOrder: async (data: IOrderSellParams) => {
    return api.post("/api/v2/orders/sell", data);
  },
  putOrder: async (orderId: string, data: IOrderUpdateParams) => {
    return api.put(`/api/v2/orders/${orderId}`, data);
  },
  putConfirmOrder: async (id: number) => {
    return api.put(`/api/v2/orders/${id}/confirm`);
  },
  deleteOrder: async (id: number) => {
    return api.delete(`/api/v2/orders/${id}`);
  },
  getPortfolio: async (userId: number) => {
    return api.get<IPortfolio>(`/api/v2/orders/${userId}/portfolio`);
  },
};
