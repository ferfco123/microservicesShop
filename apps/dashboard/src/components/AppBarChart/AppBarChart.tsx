import { apiOrderPrivate } from "@/api/api";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useAuth } from "@clerk/react";
import { OrderChartType } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

const AppBarChart = () => {
  const { getToken } = useAuth();

  const {
    data: chartData = [],
    isLoading,
    error,
  } = useQuery<OrderChartType[]>({
    queryKey: ["carthData"],
    queryFn: async (): Promise<OrderChartType[]> => {
      const token = await getToken();
      const res = await apiOrderPrivate.get(`/orders/order-chart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error geting data</div>;

  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="mb-4">Total revenue</h1>
      <ChartContainer config={chartConfig} className="min-h-50 w-full ">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="total" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="successfull" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};

export default AppBarChart;
