"use client";

import React, { useState, useMemo } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import CreateTaskDialog from "../_components/CreateTaskDialog";
import { useUser } from "@clerk/nextjs";

type Task = {
  project?: {
    id: string;
    name: string;
  };
  id: string;
  name: string;
  status: "Completed" | "Ongoing" | "OnHold" | "Cancelled" | "Todo";
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  assignedTo: string;
};
// project type safety
type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string | null;
  deadline: string | null;
  status: "COMPLETED" | "ONGOING" | "CANCELLED";
  priority: "High" | "Low" | "Medium";
};

const MyTaskPage = () => {
  // fetching api that returns all tasks
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["Tasks"],
    queryFn: () => fetch("/api/my-tasks").then((res) => res.json()),
  });

  // fetching api that returns all projects
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/my-projects").then((res) => res.json()),
  });

  // pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 9;

  // useState hook for all filters
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | null>(null);

  //logic for dynamic colors for different priorities
  const priorityColors = {
    High: "border-emerald-500 bg-emerald-950 text-white hover:border-emerald-700 hover:text-white",
    Low: "border-rose-500 bg-rose-950 text-white hover:border-blue-700",
    Medium:
      "border-rose-500 bg-rose-950 text-white hover:border-emerald-700 hover:text-white",
  };

  //logic for  dynamic colors for different statuses
  const statusColors = {
    Completed: "border-rose-500 bg-rose-950 text-white hover:border-blue-700",
    Ongoing:
      "border-emerald-500 bg-emerald-950 text-white hover:border-emerald-700 hover:text-white",
    OnHold:
      "border-rose-500 bg-rose-950 text-white hover:border-emerald-700 hover:text-white",
    Cancelled: "border-rose-500 bg-rose-950 text-white",
    Todo: "border-rose-500 bg-rose-950 text-white hover:border-blue-700",
  };

  // Added filteredTasks using useMemo for performance
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const statusMatch = !statusFilter || task.status === statusFilter;
      const priorityMatch = !priorityFilter || task.priority === priorityFilter;
      const projectMatch =
        !projectFilter || task.project?.name === projectFilter;

      let monthMatch = true;
      if (monthFilter) {
        const dueDate = task.dueDate ? new Date(task.dueDate) : null;
        const currentYear = new Date().getFullYear();
        const filterMonth = parseInt(monthFilter, 10) - 1; // JavaScript months are 0-indexed
        monthMatch =
          dueDate?.getMonth() === filterMonth &&
          dueDate.getFullYear() === currentYear;
      }

      return statusMatch && priorityMatch && projectMatch && monthMatch;
    });
  }, [tasks, statusFilter, priorityFilter, projectFilter, monthFilter]);

  // Updated to use filteredTasks instead of tasks which was before filtration
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  // pagination calculation logic
  const currentTasks = filteredTasks.slice(
    (currentPage - 1) * tasksPerPage,
    currentPage * tasksPerPage
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const resetPage = () => setCurrentPage(1);

  // getting user from clerk for role based access
  const { user } = useUser();

  const role = user?.publicMetadata.role;

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
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 animate-slideIn">
        Tasks
      </h1>

      {/* div that implements filter ui */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Select
          onValueChange={(value) => {
            setStatusFilter(value === "all" ? null : value);
            resetPage();
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Ongoing">Ongoing</SelectItem>
            <SelectItem value="On Hold">On Hold</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
            <SelectItem value="Todo">Todo</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            setPriorityFilter(value === "all" ? null : value);
            resetPage();
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="Low">Low</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="High">High</SelectItem>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value) => {
            setProjectFilter(value === "all" ? null : value);
            resetPage();
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {Array.from(new Set(tasks.map((task) => task.project?.name))).map(
              (projectName) => (
                <SelectItem key={projectName} value={projectName || "unnamed"}>
                  {projectName || "Unnamed Project"}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        {/* DueDate Filter */}
        <Select
          onValueChange={(value) => {
            setMonthFilter(value === "all" ? null : value);
            resetPage();
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by Deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Months</SelectItem>
            <SelectItem value="1">January</SelectItem>
            <SelectItem value="2">February</SelectItem>
            <SelectItem value="3">March</SelectItem>
            <SelectItem value="4">April</SelectItem>
            <SelectItem value="5">May</SelectItem>
            <SelectItem value="6">June</SelectItem>
            <SelectItem value="7">July</SelectItem>
            <SelectItem value="8">August</SelectItem>
            <SelectItem value="9">September</SelectItem>
            <SelectItem value="10">October</SelectItem>
            <SelectItem value="11">November</SelectItem>
            <SelectItem value="12">December</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-start md:justify-end mb-4">
        {role === "admin" && (
          <CreateTaskDialog
            projects={projects}
            tasks={tasks}
            trigger={
              <Button
                variant="outline"
                className="border-emerald-300 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
              >
                <span>New Task</span>
              </Button>
            }
          />
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? // [...Array(9)] spreads the array into an array of 9 undefined values to show 9 skeletons
            [...Array(9)].map((_, index) => <TaskSkeleton key={index} />)
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
                      <span className="text-sm font-medium">Project:</span>
                      {task.project?.name}
                    </div>

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
      <Separator className="mt-4" />
    </div>
  );
};

export default MyTaskPage;
