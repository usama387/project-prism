"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
} from "@/components/ui/chart";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { Project } from "@prisma/client";
import React, { ReactNode } from "react";

interface Props {
  trigger: ReactNode;
  project: Project;
}

const RadarChartDialog = ({ trigger, project }: Props) => {
  // Calculate metric values using useMemo for optimization
  const metrics = useMemo(() => {
    if (!project) return { priorityValue: 0, progressValue: 0, budgetEfficiency: 0, timeProgress: 0, clientSatisfactionValue: 0 };

    const priorityValue = { Low: 33, Medium: 66, High: 100 }[project.priority] || 0;
    const progressValue =
      project.numberOfTasks > 0
        ? (project.completedTasks / project.numberOfTasks) * 100
        : 0;
    const budgetEfficiency =
      project.budget && project.budget > 0 && project.usedBudget !== null
        ? Math.min((project.usedBudget / project.budget) * 100, 100)
        : 0;
    const timeProgress = (() => {
      if (!project.startDate || !project.deadline) return 0;
      const now = new Date();
      const start = new Date(project.startDate);
      const end = new Date(project.deadline);
      if (now > end) return 100;
      if (start >= end) return 0;
      const totalDuration = end.getTime() - start.getTime();
      const elapsed = now.getTime() - start.getTime();
      return Math.max(0, Math.min((elapsed / totalDuration) * 100, 100));
    })();
    const clientSatisfactionValue = project.clientSatisfaction
      ? project.clientSatisfaction * 20
      : 0;

    return { priorityValue, progressValue, budgetEfficiency, timeProgress, clientSatisfactionValue };
  }, [project]);

  // Create chart data for the radar chart
  const chartData = [
    { metric: "Priority", value: metrics.priorityValue },
    { metric: "Progress", value: metrics.progressValue },
    { metric: "Budget Efficiency", value: metrics.budgetEfficiency },
    { metric: "Time Progress", value: metrics.timeProgress },
    { metric: "Client Satisfaction", value: metrics.clientSatisfactionValue },
  ];

  // Generate dynamic suggestions based on metric values
  const suggestions = useMemo(() => {
    const suggestionsList: string[] = [];

    if (metrics.progressValue < 50 && metrics.timeProgress > 50) {
      suggestionsList.push("Consider increasing resources or adjusting timelines to improve progress.");
    }

    if (metrics.budgetEfficiency > 100) {
      suggestionsList.push("Review expenses or adjust the budget to manage budget efficiency.");
    }

    if (metrics.clientSatisfactionValue < 60) {
      suggestionsList.push("Improve communication or address client concerns to enhance satisfaction.");
    }

    return suggestionsList;
  }, [metrics]);

  // Chart configuration
  const chartConfig = {
    metrics: {
      label: "Project Metrics",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Custom tooltip component for the radar chart
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: any[];
  }) => {
    if (active && payload && payload.length) {
      const { metric, value } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-background p-2 border border-border rounded shadow">
          <p className="font-bold text-foreground">{metric}</p>
          <p className="text-foreground">{`${Math.round(value)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-full sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-lg p-6 sm:p-8">
        <DialogHeader>
          <DialogTitle>{project.name} Analysis</DialogTitle>
        </DialogHeader>
        <Card className="w-full">
          <CardHeader className="items-center pb-4">
            <CardTitle>Project Performance Radar</CardTitle>
            <CardDescription>Key metrics for the project health</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadarChart data={chartData}>
                <ChartTooltip cursor={false} content={CustomTooltip} />
                <PolarGrid className="fill-[--color-metrics] opacity-20" />
                <PolarAngleAxis dataKey="metric" />
                <Radar
                  dataKey="value"
                  fill="var(--color-metrics)"
                  fillOpacity={0.5}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              Priority: {project.priority} | Status: {project.status}
            </div>
            {/* Suggestions based on the data */}
            {suggestions.length > 0 && (
              <div className="mt-2">
                <h4 className="font-semibold">Suggestions:</h4>
                <ul className="list-disc list-inside text-muted-foreground">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Data updated as of{" "}
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