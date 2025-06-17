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

const COLORS = ["#2B6CB0", "#63B3ED", "#90CDF4", "#68D391"];
const EMPTY_COLOR = "#CBD5E1";

export default function BalanceChartCard({
  isLoading,
  chartData,
  totalInvestments,
  totalReturns,
}: {
  isLoading: boolean;
  chartData: { label: string; percentage: number; type: string }[];
  totalInvestments: number;
  totalReturns: number;
}) {
  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  if (!chartData || chartData.length === 0) return null;

  const hasData = chartData && chartData.length > 0;

  // 빈값일 때는 단일 gray slice로
  const pieData = hasData ? chartData : [{ label: "", percentage: 1 }];

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
            paddingAngle={hasData ? 5 : 0}
            dataKey="percentage"
            nameKey="label"
            labelLine={false}
            label={
              hasData
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
                fill={hasData ? COLORS[index % COLORS.length] : EMPTY_COLOR}
              />
            ))}
          </Pie>
          {hasData && (
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
