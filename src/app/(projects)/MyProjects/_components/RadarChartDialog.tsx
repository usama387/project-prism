"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Project } from "@prisma/client";
import React, { ReactNode } from "react";

interface Props {
  trigger: ReactNode;
  project: Project;
}

const RadarChartDialog = ({ trigger, project }: Props) => {
  // Calculate metrics dynamically using the project prop
  const chartData = React.useMemo(() => {
    if (!project) return [];

    const {
      budget,
      usedBudget,
      numberOfTasks,
      completedTasks,
      startDate,
      deadline,
      clientSatisfaction,
    } = project;

    const currentDate = new Date();
    const start = startDate ? new Date(startDate) : null;
    const end = deadline ? new Date(deadline) : null;

    const budgetUtilization =
      budget && usedBudget !== null && budget > 0
        ? (usedBudget / budget) * 100
        : 0;

    const taskCompletion =
      numberOfTasks && completedTasks !== null && numberOfTasks > 0
        ? (completedTasks / numberOfTasks) * 100
        : 0;

    const timeProgress =
      start && end && end > start
        ? Math.min(
            ((currentDate.getTime() - start.getTime()) /
              (end.getTime() - start.getTime())) *
              100,
            100
          )
        : 0;

    const clientSatisfactionScore =
      clientSatisfaction !== null ? clientSatisfaction * 20 : 0;

    return [
      { metric: "Budget Utilization", value: budgetUtilization },
      { metric: "Task Completion", value: taskCompletion },
      { metric: "Time Progress", value: timeProgress },
      { metric: "Client Satisfaction", value: clientSatisfactionScore },
    ];
  }, [project]);

  // Chart configuration
  const chartConfig = {
    value: {
      label: "Performance",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Custom tick component to wrap long labels
  const CustomTick = ({ x, y, payload }: any) => {
    const words = payload.value.split(" ");
    return (
      <text x={x} y={y} textAnchor="middle" dy={0} fontSize={12}>
        {words.map((word: string, index: number) => (
          <tspan x={x} dy={index === 0 ? 0 : "1.2em"} key={index}>
            {word}
          </tspan>
        ))}
      </text>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-lg p-6 sm:p-8">
        <DialogHeader>Project Radar Chart</DialogHeader>
        <Card className="w-full">
          <CardHeader className="items-center pb-4">
            <CardTitle>Project Performance Radar</CardTitle>
            <CardDescription>Key metrics for the project health</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[300px]"
            >
              <RadarChart data={chartData}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <PolarAngleAxis dataKey="metric" tick={CustomTick} />
                <PolarGrid />
                <Radar
                  dataKey="value"
                  fill="var(--color-value)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 pt-4 text-sm">
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Data updated as of
              <span className="dark:text-blue-500 font-semibold text-base text-gray-500">
                {new Date().toLocaleDateString()}
              </span>
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default RadarChartDialog;