"use client";

import { useQuery } from "@tanstack/react-query";
import AddVersionDialog from "../../_components/AddVersionDialog";
import { Loader2, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Adjusted TaskHistory type to include task.name
type TaskHistory = {
  id: string;
  task: {
    name: string; // Ensure the task includes the name of the task
  };
  taskId: string;
  version: string;
  changes: string;
  updatedBy: string;
  updatedAt: string | null;
};

const TaskVersionsPage = () => {
  // fetching my api
  const {
    data: versions,
    isLoading,
    error,
  } = useQuery<TaskHistory[]>({
    queryKey: ["versions"],
    queryFn: () => fetch("/api/task-version").then((res) => res.json()),
  });

  // loading spinner screen logic
  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center mt-24 space-y-4">
        <Loader2 className="animate-spin text-emerald-400 h-16 w-16 stroke-[4]" />
        <p className="text-emerald-600 font-semibold text-lg animate-pulse">
          Please hold...
        </p>
      </div>
    );

  // when api fails renders this div is rendered
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg md:text-xl font-semibold">Versions</h1>

        {/* child component to add a version of task */}
        <AddVersionDialog
          trigger={
            <Button className="text-sm md:text-base px-4 py-2 md:px-6 md:py-3">
              <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" /> Add Version
            </Button>
          }
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left text-sm md:text-base">
              Version
            </TableHead>
            <TableHead className="text-left text-sm md:text-base">
              Changes
            </TableHead>
            <TableHead className="text-left text-sm md:text-base">
              Updated By
            </TableHead>
            <TableHead className="text-left text-sm md:text-base">
              Updated At
            </TableHead>
            <TableHead className="text-left text-sm md:text-base">
              Related Task
            </TableHead>
            <TableHead className="text-right text-sm md:text-base">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {versions &&
            versions.map((version) => (
              <TableRow key={version.id}>
                <TableCell className="font-medium text-sm md:text-base px-4 py-2">
                  <Link href={`/MyTasks/versions/${version.id}`}>
                    {version.version}
                  </Link>
                </TableCell>
                <TableCell className="text-sm md:text-base px-4 py-2">
                  {version.changes}
                </TableCell>
                <TableCell className="text-sm md:text-base px-4 py-2">
                  {version.updatedBy}
                </TableCell>
                <TableCell className="text-sm md:text-base px-4 py-2">
                  {version.updatedAt &&
                    format(new Date(version.updatedAt), "PPP")}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm md:text-base px-4 py-2">
                  {version.task.name}
                </TableCell>
                <TableCell className="text-right text-sm md:text-base px-4 py-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 md:h-10 md:w-10"
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel className="text-sm md:text-base">
                        Actions
                      </DropdownMenuLabel>
                      <DropdownMenuItem className="text-emerald-500 font-bold">
                        Edit Version
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-500 font-semibold">
                        Delete Version
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskVersionsPage;