"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Task } from "@prisma/client";
import { ReactNode, useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
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

interface Props {
  trigger: ReactNode;
  task: Task;
}

const TaskRadarChart = ({ trigger, task }: Props) => {
  // Calculate metrics
  const metrics = useMemo(() => {
    const calculateUrgency = () => {
      if (!task.dueDate) return 0;
      const now = new Date();
      const due = new Date(task.dueDate);
      const created = new Date(task.createdAt);

      if (now > due) return 100;
      const totalDuration = due.getTime() - created.getTime();
      if (totalDuration <= 0) return 0;
      const elapsed = now.getTime() - created.getTime();
      return (elapsed / totalDuration) * 100;
    };

    return {
      priorityValue: { Low: 33, Medium: 66, High: 100 }[task.priority] || 0,
      progressValue:
        { "Not Started": 0, Ongoing: 50, Completed: 100 }[task.status] || 0,
      efficiencyValue:
        task.estimatedHours && task.estimatedHours > 0
          ? ((task.actualHours || 0) / task.estimatedHours) * 100
          : 0,
      riskValue: task.riskFlag ? 100 : 0,
      urgencyValue: calculateUrgency() || 0,
    };
  }, [task]);

  // Define chart data
  const chartData = [
    { metric: "Priority", value: metrics.priorityValue },
    { metric: "Progress", value: metrics.progressValue },
    { metric: "Efficiency", value: metrics.efficiencyValue },
    { metric: "Risk", value: metrics.riskValue },
    { metric: "Urgency", value: metrics.urgencyValue },
  ];

  // Generate suggestions
  const suggestions = useMemo(() => {
    if (metrics.progressValue >= 100) return []; // No suggestions for completed tasks

    const suggestionsList: string[] = [];

    if (metrics.urgencyValue > 70) {
      suggestionsList.push(
        "The task is approaching its due date. Prioritize its completion."
      );
    }

    if (metrics.efficiencyValue > 100) {
      suggestionsList.push(
        "The task is taking longer than estimated. Consider reviewing the task's scope or allocating additional resources."
      );
    }

    if (metrics.riskValue === 100) {
      suggestionsList.push(
        "This task has a high risk flag. Take immediate action to mitigate the risk."
      );
    }

    if (metrics.priorityValue === 100) {
      suggestionsList.push(
        "This is a high-priority task. Ensure it is completed on time."
      );
    }

    return suggestionsList;
  }, [metrics]);

  const chartConfig = {
    metrics: {
      label: "Task Metrics",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

  // Custom tooltip component
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
          <DialogTitle>{task.name} Analysis</DialogTitle>
        </DialogHeader>
        <Card className="w-full">
          <CardHeader className="items-center pb-4">
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Key task metrics visualization</CardDescription>
          </CardHeader>
          <CardContent className="pb-0">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <RadarChart data={chartData}>
                <ChartTooltip cursor={false} content={CustomTooltip} />
                <PolarGrid className="fill-[--color-metrics] opacity-20" />
                <PolarAngleAxis dataKey="metric" tick={false} />
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
              Priority: {task.priority} | Status: {task.status}
            </div>
            {task.riskFlag && (
              <div className="flex items-center gap-2 text-muted-foreground">
                ⚠️ High Risk Task
              </div>
            )}
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

export default TaskRadarChart;
