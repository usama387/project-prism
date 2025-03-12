"use client";

import { Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

// Define the chart configuration for months
const chartConfig = {
  tasks: {
    label: "Tasks",
  },
  January: {
    label: "January",
    color: "hsl(var(--chart-1))",
  },
  February: {
    label: "February",
    color: "hsl(var(--chart-2))",
  },
  March: {
    label: "March",
    color: "hsl(var(--chart-3))",
  },
  April: {
    label: "April",
    color: "hsl(var(--chart-4))",
  },
  May: {
    label: "May",
    color: "hsl(var(--chart-5))",
  },
  June: {
    label: "June",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

const TaskDeadlinePieChart = () => {
  // Fetch data from the API using useQuery
  const { data, isLoading } = useQuery({
    queryKey: ["task-deadline"],
    queryFn: () => fetch("/api/task-deadline").then((res) => res.json()),
  });

  // Handle loading state
  if (isLoading) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Tasks by Deadline Month</CardTitle>
          <CardDescription>
            January - June {new Date().getFullYear()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform API data to match the pie chart's expected format
  const chartData = data.map((item: any) => ({
    month: item.month,
    tasks: item.count,
    fill: `var(--color-${item.month})`,
  }));

  // Calculate total tasks for the footer
  const totalTasks = data.reduce(
    (sum: number, item: any) => sum + item.count,
    0
  );

  return (
    <Card className="flex flex-col w-full lg:w-[48%] xl:w-[45%] mx-0 lg:mx-2">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-center">Tasks by Deadline Month</CardTitle>
        <CardDescription>
          January - June {new Date().getFullYear()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0 h-[300px] sm:h-[400px]">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="tasks" nameKey="month" label />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Total tasks: {totalTasks}
        </div>
      </CardFooter>
    </Card>
  );
};

export default TaskDeadlinePieChart;
