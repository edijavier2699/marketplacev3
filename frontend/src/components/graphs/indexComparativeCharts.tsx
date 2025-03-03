

"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", iShares: 186, Tokunize: 80, GlobalX: 50 },
  { month: "February", iShares: 305, Tokunize: 200, GlobalX: 90 },
  { month: "March", iShares: 237, Tokunize: 120, GlobalX: 70 },
  { month: "April", iShares: 73, Tokunize: 190, GlobalX: 120 },
  { month: "May", iShares: 209, Tokunize: 130, GlobalX: 95 },
  { month: "June", iShares: 214, Tokunize: 140, GlobalX: 110 },
]

const chartConfig = {
  iShares: {
    label: "iShares",
    color: "hsl(var(--chart-1))",
    icon: TrendingDown,
  },
  Tokunize: {
    label: "Tokunize",
    color: "hsl(var(--chart-2))",
    icon: TrendingUp,
  },
  GlobalX: {
    label: "GlobalX",
    color: "hsl(var(--chart-4))", // Asegúrate de definir este color en tu tema
    icon: TrendingUp,
  },
} satisfies ChartConfig

const IndexComparativeCharts = () => {
    return (
    <Card>
      <CardHeader>
        <CardTitle>iShares European Property Yield UCITS ETF</CardTitle>
        <CardDescription>
          Showing a comparative chart between iShares European Property Yield UCITS ETF , Global X SuperDividend REIT ETF and Tokunize performance

        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="Tokunize"
              type="natural"
              fill="var(--color-Tokunize)"
              fillOpacity={0.4}
              stroke="var(--color-Tokunize)"
              stackId="a"
            />
            <Area
              dataKey="iShares"
              type="natural"
              fill="var(--color-iShares)"
              fillOpacity={0.4}
              stroke="var(--color-iShares)"
              stackId="a"
            />
            <Area
              dataKey="GlobalX"
              type="natural"
              fill="var(--color-GlobalX)"
              fillOpacity={0.4}
              stroke="var(--color-GlobalX)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


export default IndexComparativeCharts
