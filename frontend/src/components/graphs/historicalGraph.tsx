import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface HistoricalPriceProps {
  data: { semana: string; volumen_total: number }[];
}

const chartConfig = {
  volumen_total: {
    label: "Volume",
    color: "#82A621", // O cualquier color que prefieras
  },
};

export const HistoricalPrice = ({ data }: HistoricalPriceProps) => {

  // Transformar los datos para el gráfico
  const chartData = data.map((item) => ({
    semana: new Date(item.semana).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }), // Mostrar la semana en formato amigable (ej. "Dec 30")
    volumen_total: item.volumen_total,
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full py-[40px]">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="semana"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value}
        />
        <YAxis
          tickFormatter={(value) => `${Math.round(value / 1000)}k`} // Redondeamos y eliminamos decimales
          orientation="left"
          tickLine={false}
          axisLine={false}
          domain={[0, "dataMax"]} // Escala dinámica según el máximo de los datos
          tickCount={5} // Número de ticks a mostrar
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="volumen_total" fill={chartConfig.volumen_total.color} radius={4} />
      </BarChart>
    </ChartContainer>
  );
};
