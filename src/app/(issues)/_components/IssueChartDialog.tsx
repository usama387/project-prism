"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { ReactNode, useMemo } from "react";
import { Label, Pie, PieChart } from "recharts";
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
import { Loader2, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  trigger: ReactNode;
}

const chartConfig = {
  Resolved: {
    label: "Resolved",
    color: "hsl(var(--chart-1))",
  },
  "In Progress": {
    label: "In Progress",
    color: "hsl(var(--chart-2))",
  },
  Closed: {
    label: "Closed",
    color: "hsl(var(--chart-3))",
  },
  Unresolved: {
    label: "Unresolved",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const IssueChartDialog = ({ trigger }: Props) => {
  // Fetching API data
  const { data, isLoading } = useQuery({
    queryKey: ["issue-statusChart"],
    queryFn: () => fetch("/api/issue-statusChart").then((res) => res.json()),
  });

  // Constructing chart data from data
  const chartData = useMemo(() => {
    return (
      data?.statusData?.map((item: { status: string; count: number }) => ({
        ...item,
        fill:
          chartConfig[item.status as keyof typeof chartConfig]?.color || "gray",
      })) || []
    );
  }, [data]);

//   returns no of issues from api
  const totalIssues = data?.totalIssues || 0;

  // Skeleton loading component
  const ChartSkeleton = () => (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="animate-spin h-8 w-8 text-primary" />
    </div>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="w-[95vw] max-w-[400px] sm:max-w-[500px] md:max-w-[600px] lg:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-lg p-4 sm:p-6 md:p-8"
      >
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl md:text-2xl">
            Issues Status Analysis
          </DialogTitle>
        </DialogHeader>
        <Card className="flex flex-col w-full mx-auto">
          <CardHeader className="items-center pb-0">
            <CardTitle className="text-base sm:text-lg md:text-xl">
              Issues Status Distribution
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Current projects issues overview
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            {isLoading ? (
              <ChartSkeleton />
            ) : (
              <ChartContainer
                config={chartConfig}
                className="mx-auto aspect-square w-full max-h-[250px] sm:max-h-[300px] md:max-h-[350px] lg:max-h-[400px]"
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
                    innerRadius="40%"
                    outerRadius="70%"
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
                                className="fill-foreground text-2xl sm:text-3xl md:text-4xl font-bold"
                              >
                                {totalIssues.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-xs sm:text-sm md:text-base"
                              >
                                Total Issues
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
          <CardFooter className="flex-col gap-2 text-sm sm:text-base">
            {isLoading ? (
              <>
                <Skeleton className="w-32 h-4 mb-2" />
                <Skeleton className="w-48 h-4" />
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 font-medium leading-none">
                  Current Project Issues Status Summary
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground font-semibold text-blue-500">
                  Showing real-time status distribution across all Issues
                </div>
              </>
            )}
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default IssueChartDialog;