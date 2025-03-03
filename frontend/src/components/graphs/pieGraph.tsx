"use client"

import { Pie, PieChart, Label } from "recharts"

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

// Define a type for the props
interface PieGraphProps {
  data: { item: string; percentage: number; fill: string }[]
  title: string,
  footerDescription: string,
  type?:string,
  customHeight:string,
  customRadius:string
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  }
} satisfies ChartConfig

// Legend component with grid layout for two rows
const Legend = ({ data }: { data: { item: string; fill: string, percentage:number }[] }) => (
  <div className="grid grid-cols-2 gap-2">
    {data.map((item) => (
      <div key={item.item} className="flex items-center space-x-2">
        <div style={{ backgroundColor: item.fill }} className="h-3 w-3 rounded-full" />
        <span className="text-sm">{item.item}: {item.percentage}%</span>
      </div>
    ))}
  </div>
);

import { MdOutlineAnalytics } from 'react-icons/md'; // Ícono de analytics (vacío)

export const PieGraph = ({ data, title, footerDescription, type, customHeight, customRadius }: PieGraphProps) => {
  const totalItems = data.length;

  // Obtener la fecha actual, mes y año
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("default", { month: "long" });
  const currentYear = currentDate.getFullYear();

  // Verifica si hay datos para mostrar
  if (totalItems === 0) {
    return (
      <Card className="border-0 shadow-none">
        <CardHeader className="items-center pb-0">
          <CardTitle>{title}</CardTitle>
          <CardDescription>June - {`${currentMonth} ${currentYear}`}</CardDescription>
        </CardHeader>
        <CardContent className={`h-[350px] ${customHeight} pb-0 flex items-center justify-center`}>
          {/* Placeholder visual: Ícono de gráfico vacío */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <MdOutlineAnalytics className="text-4xl text-muted-foreground" />
            <p className="text-center text-muted-foreground">No data available</p>
          </div>
        </CardContent>
        <CardFooter className="flex-col text-center gap-2 text-sm">
          <p className="leading-none text-muted-foreground">{footerDescription}</p>
        </CardFooter>
      </Card>
    );
  }

  // Código original para cuando hay datos
  return (
    <Card className={`border-0 shadow-none`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>June - {`${currentMonth} ${currentYear}`}</CardDescription>
      </CardHeader>
      <CardContent className={`h-[350px] ${customHeight} pb-0`}>
        <ChartContainer
          config={chartConfig}
          className="aspect-square w-[100%] h-[100%]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={data}
              dataKey="percentage"
              nameKey="item"
              innerRadius={customRadius}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalItems}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-[13px]"
                        >
                          {type}
                        </tspan>
                      </text>
                    )
                  }
                  return null;
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col text-center gap-2 text-sm">
        <p className="leading-none text-muted-foreground">{footerDescription}</p>
        <Legend data={data} />
      </CardFooter>
    </Card>
  );
}
