"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import CountUp from "react-countup";

interface Props {
  CompletedTasks: number;
}

const CompletedTasksCard = ({ CompletedTasks }: Props) => {
  return (
    <Link href="/CompletedTasks">
      <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium text-emerald-500">
            Completed Tasks
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CountUp
              start={0}
              end={CompletedTasks || 0}
              duration={2}
              separator=","
            />
          </div>
          <p className="text-base text-muted-foreground">
            Reviewed and completed
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CompletedTasksCard;
