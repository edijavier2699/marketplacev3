"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A bar chart to show how many properties were published during  year period"

const chartConfig = {
  properties: {
    label: "Properties",
    color: "#667085",
  },
} satisfies ChartConfig

interface PropertyChart {
  data: {
      month: string;
      properties: number;
    }[]; 
}
interface Props {
  propertyAmount: number;
  data: PropertyChart[]; // Definimos correctamente que `data` es un array de objetos con las propiedades `month` y `properties`
}
export const NewPropertiesGraph = ({ data, propertyAmount }: Props) => {
  return (
    <Card className="w-[90%] sm:w-full">
      <CardHeader>
        <CardTitle className="text-xl text-gray-500">Properties Listed During Last Year</CardTitle>
        <CardDescription>Total <span className="font-bold text-black text-lg"> {propertyAmount} </span>properties</CardDescription>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[350px] w-[90%] mx-auto" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
            }}
            height={100} // Ajusta aquí la altura del gráfico
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="properties" fill="#667085" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing total properties listed for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
