"use client"

import { Pie, PieChart, Sector, Cell } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Description for the graph
export const description = "Visual representation of capital stack distribution between Token Sale Equity, Senior Debt, Sponsor Equity, and Tax Credits."

// Define the type for chart data
interface ChartData {
  category: string;
  amount: number;
  percentage: number;
  fill: string;
}

// Define the chart data based on the interface
const chartData: ChartData[] = [
  { category: "Token Sale Equity", amount: 1373000, percentage: 24.42, fill: "hsl(var(--chart-5))" },
  { category: "Senior Debt", amount: 4000000, percentage: 71.14, fill: "hsl(var(--chart-2))" },
  { category: "Sponsor Equity", amount: 250000, percentage: 4.45, fill: "hsl(var(--chart-4))" },
  { category: "Tax Credits Equity", amount: 0, percentage: 0.00, fill: "hsl(var(--chart-3))" }
];

// Define the chart configuration
const chartConfig = {
  chrome: {
    label: "Token Sale Equity",
    color: "hsl(var(--chart-5))",
  },
  safari: {
    label: "Senior Debt",
    color: "hsl(var(--chart-2))",
  },
  edge: {
    label: "Sponsor Equity",
    color: "hsl(var(--chart-4))",
  },
  firefox: {
    label: "Tax Credits Equity",
    color: "hsl(var(--chart-3))",
  },
};

// Define props for the Legend component
interface LegendProps {
  data: ChartData[];
}

// Custom Legend Component
const Legend: React.FC<LegendProps> = ({ data }) => {
  return (
    <ul className="ml-4">
      {data.map((entry) => (
        <li key={entry.category} className="flex items-center mb-2">
          <span
            className="inline-block w-3 h-3 mr-2"
            style={{ backgroundColor: entry.fill }} // Use the fill color for the legend
          />
          <span>{entry.category}</span>
        </li>
      ))}
    </ul>
  );
};

// Main CapitalStackGraph Component
export const CapitalStackGraph: React.FC = () => {
  return (
    <Card className="flex border-0 shadow-none flex-col  bg-[#F4FAE2]">
      <CardHeader className="items-center pb-0">
        <CardTitle className="hidden">Capital Stack</CardTitle>
        <CardDescription className="hidden">January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 flex">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] flex-grow"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="amount" // Use "amount" to match the data structure
              nameKey="category" // Change to match the key for the categories
              innerRadius={20}
              strokeWidth={5}
              activeIndex={0}
              activeShape={({ outerRadius = 0, ...props }) => (
                <Sector {...props} outerRadius={outerRadius + 10} />
              )}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* Render the legend next to the pie chart */}
        <Legend data={chartData} />
      </CardContent>
    </Card>
  );
};