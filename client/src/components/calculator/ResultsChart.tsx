import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import type { Results } from "@shared/schema";

interface ResultsChartProps {
  results: Results;
}

export default function ResultsChart({ results }: ResultsChartProps) {
  const data = [
    {
      name: "Email Campaigns",
      value: results.emailRevenue,
      color: "hsl(var(--chart-1))"
    },
    {
      name: "Social Media",
      value: results.socialSavings,
      color: "hsl(var(--chart-2))"
    },
    {
      name: "Chatbot",
      value: results.chatbotSavings,
      color: "hsl(var(--chart-3))"
    },
    {
      name: "Product Descriptions",
      value: results.productSavings,
      color: "hsl(var(--chart-4))"
    }
  ];

  return (
    <div className="w-full">
      <h3 className="text-lg font-medium mb-4">Annual Benefits Breakdown</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value.toLocaleString()}`, "Annual Impact"]}
            />
            <Legend />
            <Bar
              dataKey="value"
              fill="currentColor"
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
