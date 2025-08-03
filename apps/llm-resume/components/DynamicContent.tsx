"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { motion } from "framer-motion";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DynamicContentProps {
  content: {
    type: "chart" | "code" | "image" | "list";
    data: any;
  };
}

export function DynamicContent({ content }: DynamicContentProps) {
  const renderContent = () => {
    switch (content.type) {
      case "chart":
        return <ChartContent data={content.data} />;
      case "code":
        return <CodeContent data={content.data} />;
      case "list":
        return <ListContent data={content.data} />;
      case "image":
        return <ImageContent data={content.data} />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      {renderContent()}
    </motion.div>
  );
}

function ChartContent({ data }: { data: any }) {
  const chartData = data.data.labels.map((label: string, index: number) => ({
    name: label,
    value: data.data.datasets[0].data[index],
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={data.data.datasets[0].borderColor}
                strokeWidth={2}
                dot={{
                  fill: data.data.datasets[0].borderColor,
                  strokeWidth: 2,
                  r: 4,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function CodeContent({ data }: { data: any }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Badge variant="secondary">{data.language}</Badge>
          코드 예시
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <SyntaxHighlighter
            language={data.language}
            style={tomorrow}
            customStyle={{
              margin: 0,
              borderRadius: "8px",
              fontSize: "14px",
            }}
            showLineNumbers
          >
            {data.code}
          </SyntaxHighlighter>
        </div>
      </CardContent>
    </Card>
  );
}

function ListContent({ data }: { data: any }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{data.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.items.map((category: any, index: number) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <h4 className="font-semibold text-slate-700 dark:text-slate-300">
                {category.category}
              </h4>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item: string) => (
                  <Badge key={item} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ImageContent({ data }: { data: any }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">{data.title || "이미지"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <img
            src={data.url}
            alt={data.alt || "동적 이미지"}
            className="w-full h-auto rounded-lg"
          />
        </div>
      </CardContent>
    </Card>
  );
}
