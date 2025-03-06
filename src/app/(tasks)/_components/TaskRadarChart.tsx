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
  ChartTooltipContent,
} from "@/components/ui/chart";

interface Props {
  trigger: ReactNode;
  task: Task;
}

const TaskRadarChart = ({ trigger, task }: Props) => {
  // putting in a memo to prevent expensive calculations
  const chartData = useMemo(() => {
    const calculateUrgency = () => {
      if (!task.dueDate) return 0;
      const now = new Date();
      const due = new Date(task.dueDate);
      const created = new Date(task.createdAt);

      if (now > due) return 100;
      const totalDuration = due.getTime() - created.getTime();
      const elapsed = now.getTime() - created.getTime();
      return (elapsed / totalDuration) * 100;
    };

    return [
      {
        metric: "Priority",
        value: { Low: 33, Medium: 66, High: 100 }[task.priority] || 0,
      },
      {
        metric: "Progress",
        value:
          { "Not Started": 0, Ongoing: 50, Completed: 100 }[task.status] || 0,
      },
      {
        metric: "Efficiency",
        value:
          task.estimatedHours && task.estimatedHours > 0
            ? Math.min(
                ((task.actualHours || 0) / task.estimatedHours) * 100,
                100
              )
            : 0,
      },
      {
        metric: "Risk",
        value: task.riskFlag ? 100 : 0,
      },
      {
        metric: "Urgency",
        value: calculateUrgency(),
      },
    ];
  }, [task]);

  const chartConfig = {
    metrics: {
      label: "Task Metrics",
      color: "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;

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
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      label={(payload: any) => payload?.payload?.metric}
                      // Replace 'value' with the correct prop name, e.g., 'formatter'
                      formatter={(payload: any) =>
                        `${Math.round(payload.value)}%`
                      }
                    />
                  }
                />
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
              Priority: {task.priority} | Status: {task.status}
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              {task.riskFlag && "⚠️ High Risk Task"}
            </div>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default TaskRadarChart;
