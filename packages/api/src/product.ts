import { api } from "../../api";
import { IPaginatedResponse } from "../types/common";

export interface IProductListParams {
  lang?: string; // en-US
  is_published?: boolean;
  type?: string | null; // index | strategy
}

export interface IUnderlineAsset {
  type: string;
  name: string;
  symbol: string | null;
  link: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cinnamon_asset_info?: any; // or specific structure if known
}
export interface IDescription {
  heading?: string;
  break_down_text?: string;
  caption?: string;
  title?: string;
  bottom_title?: string;
  read_more_link?: string;
  incentive?: string;
  description?: string;
}

export interface IFiles {
  logo: string | null;
  image_file: string | null;
  one_page: string | null;
  white_paper: string | null;
  quick_introduction: string | null;
  chartPreview?: string | null;
}
export interface ICategory {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export interface IChanges {
  day: { currency: number | null; usd: number | null };
  week: { currency: number | null; usd: number | null };
  month: { currency: number | null; usd: number | null };
  quarter: { currency: number | null; usd: number | null };
  half_year: { currency: number | null; usd: number | null };
  year: { currency: number | null; usd: number | null };
  all: { currency: number | null; usd: number | null };
}

export interface IProduct {
  id: number;
  symbol: string | null;
  type: string;
  value: number | null;
  prev_value: number | null;
  underline_asset: IUnderlineAsset;
  description: IDescription;
  title: string;
  category_id: number;
  base_currency: string | null;
  published: boolean;
  aum: number | null;
  apy: number | null;
  index: string | null;
  percent: number | null;
  is_display_in_percent: boolean;
  tcs: number | null;
  created_at: string;
  updated_at: string;
  files: IFiles;
  category: ICategory;
  changes: IChanges;
  explanation?: {
    buy_period?: {
      start_date: number;
      end_date: number;
      is_suitable: boolean;
    };
    sell_period?: {
      start_date: number;
      end_date: number;
      is_suitable: boolean;
    };
  };
  // investor 전용 필드
  minimum_investment_size?: number | null;
  type_name: InvestorProductType;
}

export type InvestorProductType =
  | "PREFERRED_RETURN"
  | "FIXED_INCOME"
  | "SMA"
  | "CRYPTO"
  | "null"; // FixedIncome, PreferredReturn, Sma, cryptostrategy는 null

export interface IProductParams {
  heading?: string;
  bottom_title?: string;
  tcs?: number;
  incentive?: string;
  underline_asset_name?: string;
  published?: boolean;
  breakdown_txt?: string;
  is_display_in_percent?: boolean;
  symbol?: string;
  title?: string;
  language?: string;
  aum?: number;
  underline_asset_symbol?: string;
  type?: string;
  read_more_link?: string;
  bottom_txt?: string;
  underline_asset_type?: string;
  underline_asset_link?: string;
  category_id?: number;
  related_index?: string;
  base_currency?: string;
}
export interface IProductParamsWithFiles extends IProductParams, IFiles {}

export interface IProductHistoricalDataParams {
  symbol: string;
  page: number;
  limit: number;
}

export interface IProductHistoricalData {
  ticker: string;
  price: number;
  date: string;
  logo: string;
  aum: number;
  tcs: number;
}
interface IProductValue {
  ok: boolean;
  value: number;
}

export const isInvestorProduct = (product: IProduct) => {
  return product.type_name !== null;
};

export type ProductFileTypes =
  | "logo"
  | "image_file"
  | "one_page"
  | "white_paper"
  | "quick_introduction"
  | "chartPreview";
export const productApi = {
  createProduct: async (data: IProductParams, files: IFiles) => {
    const formData = new FormData();
    formData.append("product", JSON.stringify(data));
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });
    return api.post<IProduct>("/api/v2/products", formData);
  },
  putProduct: async (data: {
    symbol: string;
    language?: string;
    data: IProductParams;
    files?: IFiles;
  }) => {
    const params = new URLSearchParams();
    if (data.language) params.set("language", data.language);
    const formData = new FormData();
    formData.append("product", JSON.stringify(data.data));
    if (data.files) {
      Object.entries(data.files).forEach(([key, file]) => {
        if (file) {
          formData.append(key, file);
        }
      });
    }
    return api.put<IProduct>(`/api/v2/products/${data.symbol}`, formData);
  },
  getProducts: async (params?: IProductListParams) => {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.set("type", params.type);
    if (params?.lang) searchParams.set("lang", params.lang);
    if (params?.is_published !== undefined) {
      searchParams.set("is_published", params.is_published.toString());
    } else {
      searchParams.set("is_published", "true");
    }
    const queryString = searchParams.toString();
    const url = queryString
      ? `/api/v2/products/?${queryString}`
      : "/api/v2/products/";
    return api.get<IProduct[]>(url);
  },

  getProductHistoricalData: async (data: IProductHistoricalDataParams) => {
    const params = new URLSearchParams();
    params.set("page", data.page.toString());
    params.set("limit", data.limit.toString());
    return api.get<IPaginatedResponse<IProductHistoricalData>>(
      `/api/v2/products/${data.symbol}/historical-data?${params.toString()}`
    );
  },
  postProductPublishStatus: async (symbol: string, published: number) => {
    return api.post<IProduct>(
      `/api/v2/products/${symbol}/publish?should_publish=${published}`
    );
  },

  deleteProduct: async (symbol: string) => {
    return api.delete<void>(`/api/v2/products/${symbol}`);
  },
  deleteProductFile: async (symbol: string, key: ProductFileTypes) => {
    return api.delete<void>(`/api/v2/products/${symbol}/files?key=${key}`);
  },
  getProductValueBySymbol: async (symbol: string) => {
    return api.get<IProductValue>(`/api/v2/products/${symbol}/value`);
  },
  getProductHistoricalDataBySymbol: async (symbol: string) => {
    return api.get<IProduct>(`/api/v2/products/${symbol}`);
  },

  // 1btc => 1,000,000USDT
  // 1krw => 1400USDT
  getCurrencyPrice: async (currency: string) => {
    return api.get<ICurrencyPrice>(`/api/v2/currencies/${currency}/price`);
  },
  getProduct: async (symbol: string) => {
    return api.get<IProduct>(`/api/v2/products/${symbol}`);
  },
  getCurrenciesPrice: async () => {
    return api.get<ICurrency[]>(`/api/v2/currencies/`);
  },
};

interface ICurrencyPrice {
  ok: boolean;
  price: number;
}

export interface ICurrency {
  name: string;
  price: string;
  id: string;
  change: string;
  updated_at: number;
}
