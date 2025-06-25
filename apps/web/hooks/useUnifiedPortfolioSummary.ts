import { useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi, ICurrency } from "@workspace/api";
import { orderApi } from "@workspace/api";

import { AuthContext } from "@/components/context/AuthProvider";
import type {
  StrategyOrderListItem,
  FixedIncomeOrderListItem,
  SmaOrderListItem,
  OrderListItem,
} from "@workspace/api";
import { calculateUserDepositUSD } from "@/utils/portfoiloSummary";
/**
 * 단일 포트폴리오 요약 정보를 담는 타입
 * - 각 포트폴리오의 주요 정보(잔액, 수익률 등)를 표현
 */
export interface IPortfolioSummaryItem {
  id: string;
  name: string;
  type: string;
  currentBalance: number;
  description: string;
  returnPercent: number;
  returnAmount: number;
  initialBalance: number;
  currency: string;
  sortingUSDValue: number;
  icon: string | undefined;
}

/**
 * 전체 포트폴리오 요약 정보를 담는 타입
 * - 여러 포트폴리오의 집계, 차트 데이터, 로딩 상태 등 포함
 * - UI에서 필요한 모든 요약 정보를 한 번에 제공
 *
 * @property {IPortfolioSummaryItem[]} allPortfolios - 모든 포트폴리오의 요약 정보 배열
 * @property {number} totalInvestmentsBalance - 현재 총 투자에 대한 현재 잔액(USD 기준)
 * @property {number} totalInvestments - 총 투자 금액(초기 투자액, USD 기준)
 * @property {{ label: string; percentage: number; type: string }[]} chartData - 차트 시각화를 위한 데이터(포트폴리오별 비율 등)
 * @property {number} totalReturns - 총 수익금(USD 기준, 현재 잔액 - 총 투자금)
 * @property {IPortfolioSummaryItem[]} top3Portfolios - 수익 기준 상위 3개 포트폴리오
 * @property {number} totalBalanceUSDT - 총 잔액(USD 기준) + 예치금(USD 기준)
 * @property {boolean} isLoading - 데이터 로딩 중 여부(로딩 스피너 등 UI 제어에 사용)
 * @property {number} userDepositUSD - 유저 예치금(USD 환산, 현금성 자산)
 * @property {Record<string, number>=} userRawBalance - 유저의 원화/달러 등 실제 잔고(통화별)
 * @property {ICurrency[]=} currencies - 환율 정보(통화별 현재가)
 */
export interface IUnifiedPortfolioSummary {
  /** 모든 포트폴리오의 요약 정보 배열 */
  allPortfolios: IPortfolioSummaryItem[];
  /** 현재 총 투자에 대한 현재 잔액(USD 기준) */
  totalInvestmentsBalance: number;
  /** 총 투자 금액(초기 투자액, USD 기준) */
  totalInvestments: number;
  /** 총 수익금(USD 기준, 현재 잔액 - 총 투자금) */
  totalReturns: number;
  /** 수익 기준 상위 3개 포트폴리오 */
  top3Portfolios: IPortfolioSummaryItem[];
  /** 총 잔액(USD 기준) + 예치금(USD 기준) */
  totalBalanceUSDT: number;
  /** 데이터 로딩 중 여부(로딩 스피너 등 UI 제어에 사용) */
  isLoading: boolean;
  /** 유저 예치금(USD 환산, 현금성 자산) */
  userDepositUSD: number;
  /** 유저의 원화/달러 등 실제 잔고(통화별) */
  userRawBalance?: Record<string, number>;
  /** 환율 정보(통화별 현재가) */
  currencies?: ICurrency[];
}

/**
 * StrategyOrderListItem 타입인지 판별
 * @param item - 판별할 객체
 * @returns StrategyOrderListItem 여부
 */
function isStrategyOrder(item: any): item is StrategyOrderListItem {
  return (
    typeof item.product === "object" && !!item.product && "type" in item.product
  );
}

/**
 * FixedIncomeOrderListItem 타입인지 판별
 * @param item - 판별할 객체
 * @returns FixedIncomeOrderListItem 여부
 */
function isFixedIncomeOrder(
  item: OrderListItem
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
function isSmaOrder(item: OrderListItem): item is SmaOrderListItem {
  return item.type_name === "SMA";
}

/**
 * 전체 포트폴리오 요약 정보를 가져오는 커스텀 훅
 * - 여러 API를 호출하여 포트폴리오, 환율, 상품 정보를 가져옴
 * - 각 포트폴리오별 요약, 전체 투자금, 수익률, 차트 데이터, 로딩 상태 등 UI에 필요한 모든 정보를 반환
 *
 * @returns IUnifiedPortfolioSummary 타입의 포트폴리오 요약 정보 객체
 *
 * @example
 * const {
 *   allPortfolios,
 *   totalInvestmentsBalance,
 *   totalInvestments,
 *   totalReturns,
 *   top3Portfolios,
 *   totalBalanceUSDT,
 *   isLoading,
 *   userDepositUSD,
 *   userRawBalance,
 *   currencies,
 * } = useUnifiedPortfolioSummary();
 */
export function useUnifiedPortfolioSummary(): IUnifiedPortfolioSummary {
  const { state } = useContext(AuthContext);
  const userRawBalance: Record<string, number> | undefined =
    state.user?.balance;
  // API calls
  const { data: orderList, isLoading: isPortfolioProductsLoading } = useQuery({
    queryKey: ["portfolio"],
    queryFn: () => orderApi.getOrderList(),
  });
  const { data: currencies, isLoading: isCurrenciesLoading } = useQuery<
    ICurrency[]
  >({
    queryKey: ["currencies"],
    queryFn: () => productApi.getCurrenciesPrice(),
  });
  const { data: products, isLoading: isProductsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: () => productApi.getProducts(),
  });

  const userDepositUSD = calculateUserDepositUSD(userRawBalance, currencies);

  const productImages = useMemo(() => {
    return products?.map((product) => {
      return {
        logo: product.files.logo,
        symbol: product.symbol,
        description: product.description,
      };
    });
  }, [products]);

  const summary = useMemo(() => {
    if (!orderList)
      return {
        allPortfolios: [],
        totalInvestmentsBalance: 0,
        totalInvestments: 0,
        totalReturns: 0,
        top3Portfolios: [],
        totalBalanceUSDT: 0,
      };

    const allPortfolios: IPortfolioSummaryItem[] = orderList
      .map((item) => {
        if (isSmaOrder(item)) {
          const smaItem = item;
          const currentBalance = Number(smaItem.current_balance);
          const returnPercent = smaItem.yearly_pnl_percent;
          const returnAmount = smaItem.total_pnl_amount;
          const initialBalance = smaItem.principal;
          const currency = "KRW";
          const currencyPrice = currencies?.find(
            (c) => c.id === "KRW"
          ) as ICurrency;
          const sortingUSDValue = currencyPrice
            ? currentBalance / Number(currencyPrice.price)
            : 0;
          return {
            id: String(smaItem.type_name),
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
        if (isFixedIncomeOrder(item)) {
          const currentBalance =
            Number(item.principal) + Number(item.accrued_interest);
          const isMatured =
            typeof item.days_until_maturity === "number" &&
            item.days_until_maturity <= 0;
          if (isMatured) return null;
          let currencyPrice = 1;
          if (item.currency === "KRW") {
            currencyPrice =
              1 / Number(currencies?.find((c) => c.id === "KRW")?.price);
          } else if (item.currency === "USD") {
            currencyPrice = 1;
          } else {
            currencyPrice = Number(
              currencies?.find((c) => c.id === item.currency)?.price
            );
          }
          const returnAmount = Number(item.accrued_interest);
          const returnPercent = Number(item.interest_rate); // 연이자율
          const currency = item.currency;
          const initialBalance = Number(item.principal);
          const sortingUSDValue = currencyPrice * currentBalance;
          return {
            id: String(item.id),
            name: item.product,
            type: item.type_name, // preferred_return, fixed_income
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
        if (isStrategyOrder(item)) {
          const amountWithProfit = item.amount;
          const currentBalance = amountWithProfit * (item.product.value ?? 0);
          const initialBalance = item.amount * item.initial_value;
          const returnPercent = item.product.apy;

          const returnAmount = currentBalance - initialBalance;
          const currency = item.product.base_currency;
          let currencyPrice = 1;
          if (currency === "KRW") {
            currencyPrice =
              1 / Number(currencies?.find((c) => c.id === "KRW")?.price);
          } else if (currency !== "USD") {
            currencyPrice = Number(
              currencies?.find((c) => c.id === currency)?.price
            );
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
            currency: currency ?? "",
            sortingUSDValue,
            icon:
              productImages?.find((p) => p.symbol === item.symbol)?.logo ||
              undefined,
          };
        }
        return null;
      })
      .filter((item): item is IPortfolioSummaryItem => !!item);

    if (allPortfolios.length === 0) {
      return {
        allPortfolios: [],
        totalInvestmentsBalance: 0,
        totalInvestments: 0,
        totalReturns: 0,
        top3Portfolios: [],
        totalBalanceUSDT: 0,
      };
    }

    // 총 잔액 계산 (USD 기준)
    const totalInvestmentsBalance = allPortfolios.reduce(
      (acc, portfolio) => acc + portfolio.sortingUSDValue,
      0
    );

    // 총 투자금액 계산 (USD 기준)
    const totalInvestments = allPortfolios.reduce((acc, portfolio) => {
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
      return acc + initialUSDValue;
    }, 0);

    // 총 수익금 계산
    const totalReturns = totalInvestmentsBalance - totalInvestments;

    // sortingUSDValue 기준으로 정렬 (내림차순)
    const sortedPortfolios = [...allPortfolios].sort(
      (a, b) => b.sortingUSDValue - a.sortingUSDValue
    );

    // Top 3 포트폴리오 (MyTopPortfoliosCard용)
    const top3Portfolios = sortedPortfolios.slice(0, 3);

    // 총 잔액(USD 기준) + 예치금(USD 기준)
    const totalBalanceUSDT = totalInvestmentsBalance + userDepositUSD;

    return {
      allPortfolios: sortedPortfolios,
      totalInvestmentsBalance, // 현재 총 투자에대한 현재 잔액
      totalInvestments, // 총 투자 금액 초기 투자 액
      totalReturns,
      top3Portfolios,
      totalBalanceUSDT, // 총 잔액(USD 기준) + 예치금(USD 기준)
    };
  }, [orderList, userDepositUSD, currencies, productImages]);

  const isLoading =
    isPortfolioProductsLoading || isCurrenciesLoading || isProductsLoading;

  return { ...summary, isLoading, userDepositUSD, userRawBalance, currencies };
}
