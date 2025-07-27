import { useMemo } from "react";
import { IPortfolioSummaryItem } from "@/hooks/useUnifiedPortfolioSummary";

export function usePieData(
  allPortfolios: IPortfolioSummaryItem[],
  totalInvestments: number
) {
  return useMemo(() => {
    if (!allPortfolios || allPortfolios.length === 0) {
      return [{ label: "", percentage: 1, type: "empty" }];
    }

    // 1. 비율 계산
    const chartData = allPortfolios.map((portfolio) => ({
      label: portfolio.name,
      percentage: totalInvestments
        ? Math.round((portfolio.sortingUSDValue / totalInvestments) * 100)
        : 0,
      type: portfolio.type,
    }));

    // 2. 0% 항목 제외
    const filteredData = chartData.filter((item) => item.percentage > 0);

    // 3. 5개 초과시 상위 4개 + Others로 묶기
    let pieData = filteredData;
    if (filteredData.length > 4) {
      const top4 = filteredData.slice(0, 4);
      const others = filteredData.slice(4).reduce(
        (acc, item) => ({
          ...acc,
          percentage: acc.percentage + item.percentage,
        }),
        { label: "Others", percentage: 0, type: "others" }
      );
      pieData = [...top4, others];
    }

    // 4. 데이터 없으면 빈 slice
    if (!pieData.length) {
      pieData = [{ label: "", percentage: 1, type: "empty" }];
    }

    return pieData;
  }, [allPortfolios, totalInvestments]);
}
