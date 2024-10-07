"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { type TaskHistory as TaskHistoryType } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const TaskHistoryPage = () => {
  const {
    data: taskHistory = [],
    isLoading,
    error,
  } = useQuery<TaskHistoryType[]>({
    queryKey: ["TaskHistory"],
    queryFn: () => fetch("/api/task-history").then((res) => res.json()),
  });

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="flex items-center justify-center h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="flex items-center justify-center h-[400px]">
          <p className="text-red-500">Error loading task history</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <Card className="max-w-max p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardHeader>
          <CardTitle>Task History</CardTitle>
          <CardDescription>
            Track changes and updates for this task
          </CardDescription>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};

export default TaskHistoryPage;
