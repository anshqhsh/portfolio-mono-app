import { Card, CardFooter } from "@workspace/ui/components/card";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

import { Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@workspace/ui/components/hover-card";

import { formatCurrencyByRule } from "@workspace/utils";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { IPortfolioSummaryItem } from "@/hooks/useUnifiedPortfolioSummary";

const COLORS = ["#2B6CB0", "#63B3ED", "#90CDF4", "#68D391"];
const EMPTY_COLOR = "#CBD5E1";

interface IProps {
  isLoading: boolean;
  allPortfolios: IPortfolioSummaryItem[];
  totalInvestments: number;
  totalReturns: number;
}

export default function BalanceChartCard({
  isLoading,
  allPortfolios,
  totalInvestments,
  totalReturns,
}: IProps) {
  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!allPortfolios || allPortfolios.length === 0) return null;

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

  return (
    <Card className="h-full">
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius="65%"
            outerRadius="80%"
            paddingAngle={pieData.length > 1 ? 5 : 0}
            dataKey="percentage"
            nameKey="label"
            labelLine={false}
            label={
              pieData.length > 1
                ? ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                    const RADIAN = Math.PI / 180;
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={8}
                        fontWeight="bold"
                      >
                        {`${(percent * 100).toFixed(0)}%`}
                      </text>
                    );
                  }
                : undefined
            }
            stroke="none"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  pieData.length > 1
                    ? COLORS[index % COLORS.length]
                    : EMPTY_COLOR
                }
              />
            ))}
          </Pie>
          {pieData.length > 1 && (
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              iconType="circle"
              fontSize={8}
              formatter={(_, entry) => {
                const label = (entry as any)?.payload?.label;
                if (typeof label !== "string") return "";
                return <span style={{ color: "#A0AEC0" }}>{label}</span>;
              }}
            />
          )}
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <CardFooter>
        <div className="flex justify-around items-center w-full mt-4">
          <div>
            <div className="text-ui-secondary text-sm">
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex items-center gap-1 sm:text-sm md:text-base font-semibold">
                    {"return"}{" "}
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>{"return-description"}</HoverCardContent>
              </HoverCard>
            </div>
            <div className="text-positive sm:text-sm md:text-2xl font-semibold">
              {formatCurrencyByRule(totalReturns, "USD")}
            </div>
          </div>
          <div>
            <div className="text-ui-secondary text-sm">
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex items-center gap-1 sm:text-sm md:text-base font-semibold">
                    {"amount-invested"}{" "}
                    <Info className="w-4 h-4 text-muted-foreground" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent>
                  {"amount-invested-description"}
                </HoverCardContent>
              </HoverCard>
            </div>
            <div className="text-primary sm:text-sm md:text-2xl font-semibold">
              {formatCurrencyByRule(totalInvestments, "USD")}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
