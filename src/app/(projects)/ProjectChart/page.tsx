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
import ProjectDeadlinePieChart from "../MyProjects/_components/ProjectDeadlinePieChart";

const chartConfig = {
  COMPLETED: {
    label: "Completed",
    color: "hsl(var(--chart-1))",
  },
  ONGOING: {
    label: "Ongoing",
    color: "hsl(var(--chart-2))",
  },
  CANCELLED: {
    label: "Cancelled",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const ProjectStatusChart = () => {
  // fetching api
  const { data, isLoading } = useQuery({
    queryKey: ["project-statusChart"],
    queryFn: () => fetch("/api/project-statusChart").then((res) => res.json()),
  });

  // constructing chart data
  const chartData = React.useMemo(() => {
    return (
      data?.statusData?.map((item: { status: string; count: number }) => ({
        ...item,
        fill: chartConfig[item.status as keyof typeof chartConfig].color,
      })) || []
    );
  }, [data]);

  const totalProjects = data?.totalProjects || 0;

  // Skeleton loading component
  const ChartSkeleton = () => (
    <div>
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between mt-8 px-4 md:px-8 lg:px-16">
      <Card className="flex flex-col w-full lg:w-[48%] xl:w-[45%] mx-0 lg:mx-2">
        <CardHeader className="items-center pb-0">
          <CardTitle>Project Status Distribution</CardTitle>
          <CardDescription>Current project health overview</CardDescription>
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
                              {totalProjects.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 28}
                              className="fill-muted-foreground"
                            >
                              Total Projects
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
                Project Portfolios Health Summary{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground text-base font-semibold text-blue-500">
                Showing real-time status distribution across all projects
              </div>
            </>
          )}
        </CardFooter>
      </Card>
      {/* Pie Chart With Project Deadlines */}
      <ProjectDeadlinePieChart />
    </div>
  );
};

export default ProjectStatusChart;
