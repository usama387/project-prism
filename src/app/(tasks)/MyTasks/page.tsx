"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";

type Task = {
  id: string;
  name: string;
  status: "Completed" | "Ongoing" | "OnHold" | "Cancelled" | "Todo";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignedTo: string;
};

const MyTaskPage = () => {
  
  // fetching task with useQuery
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["Tasks"],
    queryFn: () => fetch("/api/my-tasks").then((res) => res.json()),
  });

  //   setting first page as default page
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 9;
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  const priorityColors = {
    High: "border-emerald-500 bg-emerald-950 text-white hover:border-emerald-700 hover:text-white",
    Low: "border-rose-500 bg-rose-950 text-white hover:border-blue-700",
    Medium:
      "border-rose-500 bg-rose-950 text-white hover:border-emerald-700 hover:text-white",
  };

  // being used in ProjectsPage.status
  const statusColors = {
    Completed: "border-emerald-500 bg-emerald-950 text-white",
    Ongoing: "border-rose-500 bg-rose-950 text-white",
    OnHold: "border-rose-500 bg-rose-950 text-white",
    Cancelled: "border-rose-500 bg-rose-950 text-white",
    Todo: "border-rose-500 bg-rose-950 text-white",
  };

  // pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const TaskSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex justify-between items-center">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          ))}
          <Skeleton className="h-9 w-full mt-4" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">
        My Tasks
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? [...Array(9)].map((_, index) => <TaskSkeleton key={index} />)
          : currentTasks.map((task) => (
              <Card key={task.id}>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-emerald-400">
                    {task.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Status:</span>
                      <span className={statusColors[task.status]}>
                        {task.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Priority:</span>
                      <Badge className={priorityColors[task.priority]}>
                        {task.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Due Date:</span>
                      <span className="text-sm">
                        {format(new Date(task.dueDate), "PP")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Assigned To:</span>
                      <span className="text-sm">{task.assignedTo}</span>
                    </div>
                    <Link href={`/MyTasks/${task.id}`} className="w-full mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-4 text-emerald-400"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {/* pagination logic starts from here */}
      {!isLoading && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) paginate(currentPage - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => (
                <PaginationItem key={number}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === number}
                    onClick={(e) => {
                      e.preventDefault();
                      paginate(number);
                    }}
                  >
                    {number}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) paginate(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default MyTaskPage;
