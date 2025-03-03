"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartNoAxesCombined } from "lucide-react";
import Link from "next/link";
import CountUp from "react-countup";

interface Props {
  PendingTasksThisWeek: number;
}

const PendingTasksCard = ({ PendingTasksThisWeek }: Props) => {
  return (
    <Link href="/MyTasks">
      <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground animate-slideIn">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-emerald-600 dark:text-emerald-500">
            Pending Tasks
          </CardTitle>
          <ChartNoAxesCombined className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp
              start={0}
              end={PendingTasksThisWeek || 0}
              duration={2}
              separator=","
            />
          </div>
          <p className="text-base font-semibold text-muted-foreground">
            Pending in this week
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PendingTasksCard;
