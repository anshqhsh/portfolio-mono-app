export type BaseCurrency = "BTC" | "ETH" | "USD";
export type AssetType = "from_cinnamon" | "one_asset";

export interface IUnderlineAsset {
  type: AssetType;
  name: string;
  symbol: string | null;
  link: string;
  cinnamon_asset_info: string[];
}

export interface ITradingPeriod {
  start_date: number;
  end_date: number;
  is_suitable: boolean;
}

export interface IExplanationPeriod {
  buy_period: ITradingPeriod;
  sell_period: ITradingPeriod;
}

// IProduct 타입과 비교가 필요함
export interface ICryptoStrategyProduct {
  index: string;
  value_in_currency: number;
  prev_value: number;
  prev_value_in_currency: number;
  aum: number;
  tcs: number;
  apy: number;
  percent?: number;
  underline_asset: IUnderlineAsset;
  explanation_period?: IExplanationPeriod;
  base_currency: string | BaseCurrency;
  symbol: string;
  value: number;
  type: string | null;
  title: string;
  category_id: number;
}

export interface IPortfolioProduct {
  symbol: string;
  amount: number;
  quantity: number;
  initial_value: number;
  starting_balance: number;
  type: string | null;
  created: number;
  product: ICryptoStrategyProduct;
  fee: number | null;
  initial_value_currency: number;
  amount_with_profit: number | null;
}

export interface IPortfolioChartResponse {
  data: {
    date: string;
    value: number;
  }[];
}

export interface IOrderFee {
  fee: number;
  total: number;
}

export interface IOrderResponse {
  id: number;
  status: string;
  message: string;
}
