import dynamic from "next/dynamic";
import { useUnifiedPortfolioSummary } from "@/hooks/useUnifiedPortfolioSummary";
import BalanceChartCardSkeleton from "@/components/home/BalanceChartCardSkeleton";

const BalanceChartCard = dynamic(
  () => import("@/components/home/BalanceChartCard"),
  {
    ssr: false,
  }
);

export function Home() {
  const unifiedPortfolioSummary = useUnifiedPortfolioSummary();

  const isLoading = unifiedPortfolioSummary.isLoading;

  return (
    <div className="min-h-screen ">
      <div className="container mx-auto flex flex-col gap-container">
        {/* <TotalBalance
          totalBalance={unifiedPortfolioSummary?.totalBalanceUSDT}
        /> */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-container">
          <div className="col-span-1 lg:col-span-3 row-span-1">
            {isLoading ? (
              <BalanceChartCardSkeleton />
            ) : (
              <BalanceChartCard
                isLoading={isLoading}
                totalInvestments={
                  unifiedPortfolioSummary?.totalInvestments ?? 0
                }
                totalReturns={unifiedPortfolioSummary?.totalReturns ?? 0}
              />
            )}
          </div>
          <div className="col-span-1 lg:col-span-2 row-span-1">
            {/* <AvailableDepositsCard /> */}
          </div>
          <div className="col-span-1 lg:col-span-2 row-span-1">
            {/* <CurrentCryptoPricesCard /> */}
          </div>
          <div className="col-span-1 lg:col-span-5 lg:row-start-2">
            {/* <MyTopPortfoliosCard
                  portfolios={unifiedPortfolioSummary?.top3Portfolios}
                /> */}
          </div>
          <div className="col-span-1 lg:col-span-2 lg:row-start-2">
            {/* <LatestTransactionsCard /> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
