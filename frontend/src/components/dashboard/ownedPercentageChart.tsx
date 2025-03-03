import React from "react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Define the props type
interface OwnedPercentageChartProps {
  totalTokens: number;
  myTokens: number;
  title: string;
  tokenAvailable: number;
}

export const OwnedPercentageChart: React.FC<OwnedPercentageChartProps> = ({
  totalTokens,
  myTokens,
  title,
  tokenAvailable,
}) => {
  const percentageAvailable =
    totalTokens > 0 ? (tokenAvailable / totalTokens) * 100 : 0;
  const percentageOwned = totalTokens > 0 ? (myTokens / totalTokens) * 100 : 0;
  const percentageOthers = 100 - (percentageAvailable + percentageOwned);

  // Define chart data
  const chartData = [
    { category: "My Tokens", value: percentageOwned, fill: "#E88D30" }, // Custom color
    { category: "Other Investors", value: percentageOthers, fill: "#4a90e2" }, // Custom color
    { category: "Tokens Available", value: percentageAvailable, fill: "#2EB88A" }, // Custom color
  ];

  // Get current date
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription>Updated on {formattedDate}</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center pb-0">
        <div
          className="mx-auto aspect-square max-h-[250px]"
          style={{ height: "250px", width: "250px" }}
        >
          <PieChart width={250} height={250}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="category"
              innerRadius={70} // Increase this value to make the inner radius larger
              outerRadius={110} // Increase this value to make the outer radius larger
              strokeWidth={5}
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
                        className="fill-foreground text-xs font-bold"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {percentageOwned.toFixed(1)}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          My Percentage
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </div>
        <div className="mt-4">
          <ul className="list-disc pl-5">
            {chartData.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <div
                  className="h-4 w-4 rounded-sm"
                  style={{ backgroundColor: item.fill }}
                />
                <span className="text-sm">
                  {item.category} - {item.value.toFixed(1)}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing ownership percentage of tokens for the property
        </div>
      </CardFooter>
    </Card>
  );
};
