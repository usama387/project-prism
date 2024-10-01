import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  CalendarIcon,
  DollarSignIcon,
  ListTodoIcon,
  AlertTriangleIcon,
  ClockIcon,
  TrashIcon,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DeleteProjectDialog from "../../_components/DeleteProjectDialog";
import React from "react";
import UpdateProjectDialog from "../../_components/UpdateProjectDialog";

const SingleProjectPage = async ({ params }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const id = params.id;

  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!project) {
    return { notFound: true };
  }

  const progress = (project.completedTasks / project.numberOfTasks) * 100;

  const statusColors = {
    COMPLETED: "border-emerald-500 bg-emerald-950 text-white",
    ONGOING: "border-rose-500 bg-rose-950 text-white",
    CANCELLED: "border-rose-500 bg-rose-950 text-white",
  };

  const priorityColors = {
    High: "border-emerald-500 bg-emerald-950 text-white hover:border-emerald-700 hover:text-white",
    Low: "border-rose-500 bg-rose-950 text-white hover:border-blue-700",
    Medium:
      "border-rose-500 bg-rose-950 text-white hover:border-emerald-700 hover:text-white",
  };

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-4xl sm:text-2xl font-bold text-center mb-8 gradient-text">
          Project Overview
        </h2>
        <div className="mb-8 flex flex-col space-y-6 sm:flex-row sm:justify-between sm:items-center">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-emerald-500 mb-2">
              {project.name}
            </h1>
            <p className="text-base sm:text-lg text-gray-500">
              {project.description || "No description available."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href={`/projects/${project.id}/budgeting`} passHref>
              <Button className="w-full sm:w-auto flex items-center justify-center text-white bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600">
                <DollarSignIcon className="mr-2 h-4 w-4" />
                Budgeting
              </Button>
            </Link>
            <Link href={`/projects/${project.id}/tasks`} passHref>
              <Button
                variant="outline"
                className="w-full sm:w-auto flex items-center justify-center"
              >
                <ListTodoIcon className="mr-2 h-4 w-4" />
                Tasks
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Project Budget */}
          <Card className="hover:shadow-xl transform transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Budget</CardTitle>
              <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-emerald-600">
                {project.budget ? project.budget.toLocaleString() : "N/A"} pkr
              </div>
            </CardContent>
          </Card>

          {/* Task Progress */}
          <Card className="hover:shadow-xl transform transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Tasks Progress
              </CardTitle>
              <ListTodoIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {project.completedTasks}/{project.numberOfTasks}
              </div>
              <Progress value={progress} className="mt-2" />
            </CardContent>
          </Card>

          {/* Project Status and Priority */}
          <Card className="hover:shadow-xl transform transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <AlertTriangleIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center justify-between">
                <Badge
                  className={
                    statusColors[project.status as keyof typeof statusColors]
                  }
                >
                  {project.status}
                </Badge>
                <Badge
                  className={
                    priorityColors[
                      project.priority as keyof typeof priorityColors
                    ]
                  }
                >
                  {project.priority}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Timeline */}
        <Card className="mt-6 hover:shadow-xl transform transition-all duration-300">
          <CardHeader>
            <CardTitle>Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Start Date</p>
                  <p className="text-sm text-muted-foreground">
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <ClockIcon className="hidden sm:block h-4 w-4 text-muted-foreground" />
              <div className="flex items-center">
                <div className="text-left sm:text-right">
                  <p className="text-sm font-medium">Deadline</p>
                  <p className="text-sm text-muted-foreground">
                    {project.deadline
                      ? new Date(project.deadline).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <CalendarIcon className="ml-2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div>
          <DeleteProjectDialog
            project={project}
            trigger={
              <Button
                className="flex w-full border-separate items-center gap-2 rounded-t-none text-muted-foreground text-emerald-500 hover:bg-red-500/20"
                variant={"secondary"}
              >
                <TrashIcon className="h-4 w-4 " />
                Delete Project
              </Button>
            }
          />
          {/* <UpdateProjectDialog
            project={{...project}}
            trigger={<Button> Update Project</Button>}
          /> */}
        </div>
      </div>
    </>
  );
};

export default SingleProjectPage;
