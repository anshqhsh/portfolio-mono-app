import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { productApi, ICurrency } from "@workspace/api";
import { orderApi } from "@workspace/api";

import { AuthContext } from "@/components/context/AuthProvider";

import {
  calculateTotalInvestedAndCurrentValue,
  calculateUserDepositUSD,
  mapOrderListToPortfolioSummaries,
  mapProductsToMetaData,
} from "@/utils/portfoiloSummary";
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
  /** 모든 포트폴리오의 요약 정보 배열 정렬된 상태 */
  sortedPortfolios: IPortfolioSummaryItem[];
  /** 현재 총 투자에 대한 현재 잔액(USD 기준) */
  totalInvestedPrincipal: number;
  /** 총 투자 금액(초기 투자액, USD 기준) */
  totalCurrentValue: number;
  /** 총 수익금(USD 기준, 현재 잔액 - 총 투자금) */
  totalReturns: number;
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

  const productMetaData = mapProductsToMetaData(products);

  if (!orderList)
    return {
      sortedPortfolios: [],
      totalInvestedPrincipal: 0,
      totalCurrentValue: 0,
      totalReturns: 0,
      totalBalanceUSDT: 0,
      isLoading:
        isPortfolioProductsLoading || isCurrenciesLoading || isProductsLoading,
      userDepositUSD,
      userRawBalance,
      currencies,
    };

  const allPortfolios = mapOrderListToPortfolioSummaries(
    orderList,
    currencies ?? [],
    productMetaData
  );

  if (allPortfolios.length === 0) {
    return {
      sortedPortfolios: [],
      totalInvestedPrincipal: 0,
      totalCurrentValue: 0,
      totalReturns: 0,
      totalBalanceUSDT: 0,
      isLoading:
        isPortfolioProductsLoading || isCurrenciesLoading || isProductsLoading,
      userDepositUSD,
      userRawBalance,
      currencies,
    };
  }
  // 총 잔액(USD 기준)과 총 투자금(USD 기준) 계산
  const { totalInvestedPrincipal, totalCurrentValue } =
    calculateTotalInvestedAndCurrentValue(allPortfolios, currencies ?? []);

  // 총 수익금 계산
  const totalReturns = totalCurrentValue - totalInvestedPrincipal;

  // sortingUSDValue 기준으로 정렬 (내림차순)
  const sortedPortfolios = [...allPortfolios].sort(
    (a, b) => b.sortingUSDValue - a.sortingUSDValue
  );

  // 총 잔액(USD 기준) + 예치금(USD 기준)
  const totalBalanceUSDT = totalCurrentValue + userDepositUSD;

  const isLoading =
    isPortfolioProductsLoading || isCurrenciesLoading || isProductsLoading;

  return {
    sortedPortfolios,
    totalInvestedPrincipal,
    totalCurrentValue,
    totalReturns,
    totalBalanceUSDT,
    isLoading,
    userDepositUSD,
    userRawBalance,
    currencies,
  };
}
