"use client";

import * as React from "react";
import { Loader2, TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { useQuery } from "@tanstack/react-query";
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
import { Skeleton } from "@/components/ui/skeleton";
import TaskDeadlinePieChart from "../_components/TaskDeadlinePieChart";

const chartConfig = {
  Todo: {
    label: "Todo",
    color: "hsl(var(--chart-1))",
  },
  Completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
  "On Hold": {
    label: "On Hold",
    color: "hsl(var(--chart-3))",
  },
  Ongoing: {
    label: "Ongoing",
    color: "hsl(var(--chart-4))",
  },
  Cancelled: {
    label: "Cancelled",
    color: "hsl(var(--chart-5))",
  },
  Overdue: {
    label: "Overdue",
    color: "hsl(var(--chart-6))",
  },
} satisfies ChartConfig;

const TasksChartPage = () => {
  // Fetching API data
  const { data, isLoading } = useQuery({
    queryKey: ["task-statusChart"],
    queryFn: () => fetch("/api/task-statusChart").then((res) => res.json()),
  });

  // Constructing chart data by combining fetched data with chart config
  const chartData = React.useMemo(() => {
    return (
      data?.statusData?.map((item: { status: string; count: number }) => ({
        ...item,
        fill: chartConfig[item.status as keyof typeof chartConfig].color,
      })) || []
    );
  }, [data]);

  const totalTasks = data?.totalTasks || 0;

  // Skeleton loading component
  const ChartSkeleton = () => (
    <div>
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 mt-8 px-4 md:px-8 lg:px-16">
      {/* Task Status Chart */}
      <Card className="flex flex-col w-full md:w-[48%]">
        <CardHeader className="items-center pb-0">
          <CardTitle>Task Status Distribution</CardTitle>
          <CardDescription>Current tasks status overview</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0 h-[300px] sm:h-[400px]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <ChartSkeleton />
            </div>
          ) : (
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="count"
                  nameKey="status"
                  innerRadius={80}
                  outerRadius={120}
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
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-4xl font-bold"
                            >
                              {totalTasks.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 28}
                              className="fill-muted-foreground"
                            >
                              Total Tasks
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          {isLoading ? (
            <>
              <Skeleton className="w-32 h-4 mb-2" />
              <Skeleton className="w-48 h-4" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 font-medium leading-none">
                Task Management Overview <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground text-base font-semibold text-blue-500">
                Showing real-time status distribution across all tasks
              </div>
            </>
          )}
        </CardFooter>
      </Card>

      {/*  Another Chart (e.g., Task Deadline Distribution) */}
      <TaskDeadlinePieChart />
    </div>
  );
};

export default TasksChartPage;
