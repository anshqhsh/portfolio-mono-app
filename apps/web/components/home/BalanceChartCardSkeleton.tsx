import { Skeleton } from "@workspace/ui/components/skeleton";

const BalanceChartCardSkeleton = () => (
  <Skeleton className="flex flex-col h-full justify-between p-6">
    <div className="flex items-center gap-6">
      <Skeleton className="w-32 h-32 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-32 h-6" />
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-16 h-4" />
      </div>
    </div>
    <div className="flex justify-between mt-8">
      <div>
        <Skeleton className="w-12 h-4 mb-2" />
        <Skeleton className="w-20 h-6" />
      </div>
      <div>
        <Skeleton className="w-12 h-4 mb-2" />
        <Skeleton className="w-24 h-6" />
      </div>
    </div>
  </Skeleton>
);

export default BalanceChartCardSkeleton;
