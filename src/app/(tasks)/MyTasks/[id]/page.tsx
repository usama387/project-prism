import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  AlertTriangleIcon,
  ClockIcon,
  TrashIcon,
  EditIcon,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import UpdateTaskDialog from "../../_components/UpdateTaskDialog";
import DeleteTaskDialog from "../../_components/DeleteTaskDialog";
import AddVersionDialog from "../../_components/AddVersionDialog";
// import CreateTaskVersionDialog from "../../_components/CreateTaskVersionDialog";

const SingleTaskPage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const task = await prisma.task.findFirst({
    where: {
      id: params.id,
      userId: user.id,
    },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          description: true,
        },
      },
      dependency: {
        select: {
          id: true,
          name: true,
        },
      },
      dependentOn: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  if (!task) {
    return { notFound: true };
  }

  const statusColors = {
    COMPLETED: "border-emerald-500 bg-emerald-950 text-white",
    ONGOING: "border-yellow-500 bg-yellow-950 text-white",
    CANCELLED: "border-red-500 bg-red-950 text-white",
  };

  const priorityColors = {
    High: "border-rose-500 bg-rose-950 text-white hover:border-rose-700",
    Medium:
      "border-yellow-500 bg-yellow-950 text-white hover:border-yellow-700",
    Low: "border-green-500 bg-green-950 text-white hover:border-green-700",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl sm:text-2xl font-bold text-center mb-8 gradient-text">
        Task Overview
      </h2>
      <div className="mb-8 flex flex-col space-y-6 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-500 mb-2">
            {task.name}
          </h1>
          <p className="text-base sm:text-lg text-gray-500">
            {task.description || "No description available."}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <UpdateTaskDialog
            task={{
              taskId: task.id,
              name: task.name,
              description: task.description ?? undefined,
              dueDate: task.dueDate ?? undefined,
              status: task.status as
                | "Completed"
                | "Ongoing"
                | "Cancelled"
                | "OnHold"
                | "Todo",
              priority: task.priority as "High" | "Medium" | "Low",
              estimatedHours: task.estimatedHours ?? undefined,
              actualHours: task.actualHours ?? undefined,
              projectId: task.projectId,
              dependency: task.dependency?.id ?? undefined,
              dependentOn: task.dependentOn?.id ?? undefined,
              assignedTo: task.assignedTo ?? undefined,
              riskFlag: task.riskFlag ?? false,
            }}
            trigger={
              <Button
                className="flex w-full items-center gap-2 text-muted-foreground text-emerald-500 hover:bg-red-500/20"
                variant={"secondary"}
              >
                <EditIcon className="mr-2 h-4 w-4" />
                Edit Task
              </Button>
            }
          />

          <DeleteTaskDialog
            task={task}
            trigger={
              <Button
                className="flex w-full items-center gap-2 text-muted-foreground text-emerald-500 hover:bg-red-500/20"
                variant={"secondary"}
              >
                <TrashIcon className="h-4 w-4 " />
                Delete Task
              </Button>
            }
          />

          <AddVersionDialog
            trigger={
              <Button
                className="flex w-full items-center gap-2 text-muted-foreground text-emerald-500 hover:bg-red-500/20"
                variant={"secondary"}
              >
                <TrashIcon className="h-4 w-4 " />
                Add Version
              </Button>
            }
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Task Status and Priority */}
        <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center justify-between">
              <Badge
                className={
                  statusColors[task.status as keyof typeof statusColors]
                }
              >
                {task.status}
              </Badge>
              <Badge
                className={
                  priorityColors[task.priority as keyof typeof priorityColors]
                }
              >
                {task.priority}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Task Due Date */}
        <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Due Date</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "N/A"}
            </p>
          </CardContent>
        </Card>

        {/* Task Estimated and Actual Hours */}
        <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Time Spent</CardTitle>
            <ClockIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg">
              <p className="font-medium">
                Estimated Hours: {task.estimatedHours}
              </p>
              <p className="font-medium">Actual Hours: {task.actualHours}</p>
            </div>
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{task.project.name}</p>
            <p className="text-lg font-medium text-gray-500 mt-3">
              {task.project.description}
            </p>
          </CardContent>
        </Card>

        {/* Task Dependency */}
        <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Task Dependencies
            </CardTitle>
          </CardHeader>
          <CardContent>
            {task.dependency ? (
              <p
                key={task.dependency.id}
                className="text-lg text-gray-500 font-medium"
              >
                {task.dependency.name}
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-500 mt-3">
                No dependencies assigned.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Task Dependent On */}
        <Card className="hover:shadow-lg transform transition-transform duration-300 hover:scale-105 border border-muted-foreground">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Dependant Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {task.dependentOn ? (
              <p
                key={task.dependentOn.id}
                className="text-lg text-gray-500 font-medium"
              >
                {task.dependentOn.name}
              </p>
            ) : (
              <p className="text-sm font-medium text-gray-500 mt-3">
                No dependencies assigned.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SingleTaskPage;
