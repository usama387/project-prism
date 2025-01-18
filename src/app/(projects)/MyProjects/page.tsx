"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import CreateProjectDialog from "../_components/CreateProjectDialog";
import { useUser } from "@clerk/nextjs";

// Define the Project type with the status field
type Project = {
  id: string;
  name: string;
  description: string;
  startDate: string | null;
  deadline: string | null;
  status: "COMPLETED" | "ONGOING" | "CANCELLED";
  priority: "High" | "Low" | "Medium";
};

// adding pagination
const PROJECTS_PER_PAGE = 9;

// being used in ProjectsPage.status
const statusColors = {
  COMPLETED: "border-emerald-500 bg-emerald-950 text-white",
  ONGOING: "border-rose-500 bg-rose-950 text-white",
  CANCELLED: "border-rose-500 bg-rose-950 text-white",
};

// being used in ProjectsPage.priority
const priorityColors = {
  High: "border-emerald-500 bg-emerald-950 text-white hover:border-emerald-700 hover:text-white",
  Low: "border-rose-500 bg-rose-950 text-white hover:border-blue-700",
  Medium:
    "border-rose-500 bg-rose-950 text-white hover:border-emerald-700 hover:text-white",
};

// Create a client
const queryClient = new QueryClient();

function ProjectsPageContent() {
  // Fetching projects with useQuery
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: () => fetch("/api/my-projects").then((res) => res.json()),
  });

  // Managing page state
  const [currentPage, setCurrentPage] = useState(1);

  // added 3 states for filters
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string | null>(null);
  const [monthFilter, setMonthFilter] = useState<string | null>(null);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const statusMatch = !statusFilter || project.status === statusFilter;
      const priorityMatch =
        !priorityFilter || project.priority === priorityFilter;

      let monthMatch = true;
      if (monthFilter) {
        const deadline = project.deadline ? new Date(project.deadline) : null;
        const currentYear = new Date().getFullYear();
        const filterMonth = parseInt(monthFilter, 10) - 1; // JavaScript months are 0-indexed
        monthMatch =
          deadline?.getMonth() === filterMonth &&
          deadline.getFullYear() === currentYear;
      }
      return statusMatch && priorityMatch && monthMatch;
    });
  }, [projects, statusFilter, priorityFilter, monthFilter]);

  // Calculating total pages with filtered projects
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  // Slicing the projects for pagination
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(startIndex, endIndex);

  const resetPage = () => setCurrentPage(1);

  // getting user from clerk for role based access
  const { user } = useUser();

  const role = user?.publicMetadata.role;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-center sm:text-left animate-slideIn">
        Projects
      </h1>

      {/* div that implements filter ui for projects*/}
      <div className="flex flex-wrap gap-4 mb-6 animate-slideIn">
        {/* Status Filter */}
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
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
            <SelectItem value="ONGOING">ONGOING</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>

        {/* Priority Filter */}
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

        {/* Deadline Filter */}
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

      <div className="flex items-center justify-start md:justify-end  mb-4">
        {role === "admin" && (
          <CreateProjectDialog
            trigger={
              <Button
                variant={"outline"}
                className="border-emerald-300 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white"
              >
                New Project
              </Button>
            }
          />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/*  skeleton screen when data is not available */}
        {projects.length === 0
          ? Array.from({ length: PROJECTS_PER_PAGE }).map((_, index) => (
              <Card key={index} className="flex flex-col">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between">
                  <Skeleton className="h-20 w-full mb-4" />
                  <div className="flex flex-col sm:flex-row justify-between space-y-2 sm:space-y-0">
                    <Skeleton className="h-10 w-1/3" />
                    <Skeleton className="h-10 w-1/3" />
                  </div>
                </CardContent>
              </Card>
            ))
          : currentProjects.map((project: Project) => (
              // when data is available the card renders with project details inside link component to direct user on single page
              <Link href={`/MyProjects/${project.id}`}>
                <Card key={project.id} className="flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg text-emerald-500 sm:text-xl">
                      {project.name}
                    </CardTitle>
                    <Badge className={statusColors[project.status]}>
                      {project.status}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col justify-between">
                    <p className="text-muted-foreground text-sm sm:text-base mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
                      <div>
                        <p className="font-semibold">Start Date:</p>
                        <p>
                          {project.startDate
                            ? new Date(project.startDate).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>

                      <div className="sm:text-right">
                        <p className="font-semibold">Deadline:</p>
                        <p>
                          {project.deadline
                            ? new Date(project.deadline).toLocaleDateString()
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <h4>Priority:</h4>
                      <Badge className={priorityColors[project.priority]}>
                        {project.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
      </div>
      {/* Pagination logic */}
      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <PaginationPrevious />
              </Button>
            </PaginationItem>
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
              >
                <PaginationNext />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <Separator className="mt-8" />
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProjectsPageContent />
    </QueryClientProvider>
  );
}
