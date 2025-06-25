import { IPortfolioSummaryItem } from "@/hooks/useUnifiedPortfolioSummary";
import {
  FixedIncomeOrderListItem,
  ICurrency,
  IDescription,
  IProduct,
  OrderListItemType,
  SmaOrderListItem,
  StrategyOrderListItem,
} from "@workspace/api";

/**
 * 유저의 잔고(balances)를 USD 기준으로 환산하여 합산합니다.
 */
export function calculateUserDepositUSD(
  balances?: Record<string, number>,
  currencies?: ICurrency[]
): number {
  if (!balances || !currencies) return 0;

  const priceMap = new Map(currencies.map((c) => [c.id, Number(c.price)]));

  // 유저의 잔고를 돌아 조건에 따라 환산하여 합산
  return Object.entries(balances).reduce((total = 0, [currency, amountStr]) => {
    const amount = Number(amountStr);
    // USD, USDT는 변환 없이 더함
    if (currency === "USD" || currency === "USDT") {
      return total + amount;
    }
    // 그 외 통화는 환율을 곱해서 USD로 변환
    // 환율 정보가 없는 통화는 무시
    const currencyPrice = priceMap.get(currency);
    if (currencyPrice === undefined) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`환율 정보가 없는 통화: ${currency}`);
      }
      return total;
    }

    return total + amount * currencyPrice;
  }, 0);
}

export interface IProductImageMeta {
  logo: string | null;
  symbol: string | null;
  description: IDescription;
}

export function mapProductsToMetaData(
  products?: IProduct[]
): IProductImageMeta[] {
  if (!products) return [];
  return products.map(({ files, symbol, description }) => ({
    logo: files.logo,
    symbol,
    description,
  }));
}

/**
 * StrategyOrderListItem 타입인지 판별
 * @param item - 판별할 객체
 * @returns StrategyOrderListItem 여부
 */
function isStrategyOrder(
  item: OrderListItemType
): item is StrategyOrderListItem {
  return (
    "product" in item &&
    typeof item.product === "object" &&
    !!item.product &&
    "type" in item.product
  );
}

/**
 * FixedIncomeOrderListItem 타입인지 판별
 * @param item - 판별할 객체
 * @returns FixedIncomeOrderListItem 여부
 */
function isFixedIncomeOrder(
  item: OrderListItemType
): item is FixedIncomeOrderListItem {
  return (
    item.type_name === "PREFERRED_RETURN" || item.type_name === "FIXED_INCOME"
  );
}

/**
 * SmaOrderListItem 타입인지 판별
 * @param item - 판별할 객체
 * @returns SmaOrderListItem 여부
 */
function isSmaOrder(item: OrderListItemType): item is SmaOrderListItem {
  return item.type_name === "SMA";
}

// 타입별 매핑 함수
export function mapSmaOrderToSummary(
  item: SmaOrderListItem,
  currencies: ICurrency[]
): IPortfolioSummaryItem {
  const currentBalance = Number(item.current_balance);
  const returnPercent = item.yearly_pnl_percent;
  const returnAmount = item.total_pnl_amount;
  const initialBalance = item.principal;
  const currency = "KRW";
  const currencyPrice = currencies?.find((c) => c.id === "KRW") as ICurrency;
  const sortingUSDValue = currencyPrice
    ? currentBalance / Number(currencyPrice.price)
    : 0;
  return {
    id: String(item.type_name),
    name: "SMA",
    type: "sma",
    currentBalance,
    description: "SMA",
    returnPercent,
    returnAmount,
    initialBalance,
    currency: currency ?? "",
    sortingUSDValue,
    icon: undefined,
  };
}

export function mapFixedIncomeOrderToSummary(
  item: FixedIncomeOrderListItem,
  currencies: ICurrency[]
): IPortfolioSummaryItem | null {
  const currentBalance = Number(item.principal) + Number(item.accrued_interest);
  const isMatured =
    typeof item.days_until_maturity === "number" &&
    item.days_until_maturity <= 0;
  if (isMatured) return null;
  let currencyPrice = 1;
  if (item.currency === "KRW") {
    currencyPrice = 1 / Number(currencies?.find((c) => c.id === "KRW")?.price);
  } else if (item.currency === "USD") {
    currencyPrice = 1;
  } else {
    currencyPrice = Number(
      currencies?.find((c) => c.id === item.currency)?.price
    );
  }
  const returnAmount = Number(item.accrued_interest);
  const returnPercent = Number(item.interest_rate);
  const currency = item.currency;
  const initialBalance = Number(item.principal);
  const sortingUSDValue = currencyPrice * currentBalance;
  return {
    id: String(item.id),
    name: item.product,
    type: item.type_name,
    currentBalance,
    description: item.product,
    returnPercent,
    returnAmount,
    initialBalance,
    currency: currency ?? "",
    sortingUSDValue,
    icon: undefined,
  };
}

export function mapStrategyOrderToSummary(
  item: StrategyOrderListItem,
  currencies: ICurrency[],
  productMetaData: IProductImageMeta[]
): IPortfolioSummaryItem {
  const amountWithProfit = item.amount;
  const currentBalance = amountWithProfit * (item.product.value ?? 0);
  const initialBalance = item.amount * item.initial_value;
  const returnPercent = item.product.apy ?? 0;
  const returnAmount = currentBalance - initialBalance;
  const currency = item.product.base_currency ?? "";

  let currencyPrice = 1;

  if (currency === "KRW") {
    currencyPrice = 1 / Number(currencies?.find((c) => c.id === "KRW")?.price);
  } else if (currency !== "USD") {
    currencyPrice = Number(currencies?.find((c) => c.id === currency)?.price);
  }
  const sortingUSDValue = currentBalance * currencyPrice;
  return {
    id: String(item.symbol),
    name: item.symbol,
    type: "cryptoStrategy",
    currentBalance,
    description: item.product.title,
    returnPercent,
    returnAmount,
    initialBalance,
    currency: currency,
    sortingUSDValue,
    icon:
      productMetaData?.find((p) => p.symbol === item.symbol)?.logo || undefined,
  };
}

// 전체 포트폴리오 요약 생성
export function mapOrderListToPortfolioSummaries(
  orderList: OrderListItemType[],
  currencies: ICurrency[],
  productMetaData: IProductImageMeta[]
): IPortfolioSummaryItem[] {
  return orderList
    .map((item) => {
      if (isSmaOrder(item)) return mapSmaOrderToSummary(item, currencies);
      if (isFixedIncomeOrder(item))
        return mapFixedIncomeOrderToSummary(item, currencies);
      if (isStrategyOrder(item))
        return mapStrategyOrderToSummary(item, currencies, productMetaData);
      return null;
    })
    .filter((item): item is IPortfolioSummaryItem => !!item);
}

/**
 * 모든 포트폴리오의 총 투자 원금(USD)과 현재 평가금액(USD, 원금+수익)을 계산합니다.
 * @returns { totalInvestedPrincipal, totalCurrentValue }
 */
export function calculateTotalInvestedAndCurrentValue(
  portfolios: IPortfolioSummaryItem[],
  currencies: ICurrency[]
): { totalInvestedPrincipal: number; totalCurrentValue: number } {
  return portfolios.reduce(
    (acc, portfolio) => {
      // 현재 평가금액(원금+수익, USD)
      acc.totalCurrentValue += portfolio.sortingUSDValue;

      // 실제 투자 원금(USD)
      let initialUSDValue = portfolio.initialBalance;
      if (portfolio.currency === "KRW") {
        const krwPrice = currencies?.find((c) => c.id === "KRW")?.price;
        initialUSDValue = krwPrice
          ? portfolio.initialBalance / Number(krwPrice)
          : portfolio.initialBalance;
      } else if (portfolio.currency !== "USD") {
        const currencyPrice = currencies?.find(
          (c) => c.id === portfolio.currency
        )?.price;
        initialUSDValue = currencyPrice
          ? portfolio.initialBalance * Number(currencyPrice)
          : portfolio.initialBalance;
      }
      acc.totalInvestedPrincipal += initialUSDValue;

      return acc;
    },
    { totalInvestedPrincipal: 0, totalCurrentValue: 0 }
  );
}
