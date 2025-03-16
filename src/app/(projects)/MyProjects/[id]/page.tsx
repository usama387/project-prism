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
  Radar,
} from "lucide-react";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import DeleteProjectDialog from "../../_components/DeleteProjectDialog";
import React from "react";
import UpdateProjectDialog from "../../_components/UpdateProjectDialog";
import BudgetDetailsCard from "../_components/BudgetDetailsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import RadarChartDialog from "../_components/RadarChartDialog";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const SingleProjectPage = async ({ params }: { params: { id: string } }) => {
  // getting user from clerk to get its role
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // extracting role so that ony admin can access crud buttons
  const role = user?.publicMetadata.role;

  // getting project id url params
  const id = params.id;

  const project = await prisma.project.findFirst({
    where: {
      id,
    },
    include: {
      tasks: {
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          dueDate: true,

          _count: {
            select: {
              TaskHistory: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    return { notFound: true };
  }

  // this variable is passed as a value prop in progress component
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

  // function to truncate description to display first 7 words
  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 7) {
      return words.slice(0, 7).join(" ") + "...";
    }
    return description;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl sm:text-2xl font-bold text-center mb-8 gradient-text">
        Project Details
      </h2>

      <div className="mb-8 flex flex-col space-y-6 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-emerald-500 mb-2">
            {project.name}
          </h1>
          <p className="text-base text-muted-foreground sm:text-lg text-gray-500">
            {truncateDescription(project?.description!)}
            {project?.description &&
              project.description.split(" ").length > 7 && (
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="text-emerald-500 cursor-pointer hover:underline">
                      Read More
                    </span>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <h2 className="text-xl font-semibold mb-2">
                      Project Description
                    </h2>
                    <p>{project?.description}</p>
                  </DialogContent>
                </Dialog>
              )}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <Link href="/" passHref>
            <Button className="w-full sm:w-auto flex items-center justify-center text-white bg-gradient-to-r  to-blue-500 from-green-500 hover:to-blue-600 transition duration-300 hover:scale-105">
              <DollarSignIcon className="mr-2 h-4 w-4" />
              Budgeting
            </Button>
          </Link>
          <Link href="/MyTasks" passHref>
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center transition duration-300 hover:scale-105"
            >
              <ListTodoIcon className="mr-2 h-4 w-4" />
              Tasks
            </Button>
          </Link>
        </div>
      </div>

      {/* this div contains a child component that updates a project taking its all details */}
      <div className="flex flex-col md:flex-row items-center justify-start mt-4 gap-4 p-4">
        {role === "admin" && (
          <UpdateProjectDialog
            project={{
              projectId: project.id,
              name: project.name,
              description: project.description ?? undefined,
              startDate: project.startDate ?? undefined,
              deadline: project.deadline ?? undefined,
              status: project.status as "COMPLETED" | "ONGOING" | "CANCELLED", // Cast status
              priority: project.priority as "High" | "Medium" | "Low", // Cast priority
              budget: project.budget ?? undefined,
              numberOfTasks: project.numberOfTasks,
              completedTasks: project.completedTasks,
            }}
            trigger={
              <Button
                className="flex border-separate items-center gap-2 rounded-t-none text-muted-foreground text-emerald-600 dark:text-emerald-500 hover:bg-red-500/20 font-semibold transition duration-300 hover:scale-105"
                variant={"secondary"}
              >
                Update Insights
              </Button>
            }
          />
        )}
        {/* this dialog contains a child component that deletes a project taking its id */}
        {role === "admin" && (
          <DeleteProjectDialog
            project={project}
            trigger={
              <Button
                className="flex w-max border-separate items-center gap-2 rounded-t-none text-muted-foreground  hover:bg-red-500/20 text-emerald-600 dark:text-emerald-500 font-semibold transition duration-300 hover:scale-105"
                variant={"secondary"}
              >
                <TrashIcon className="h-4 w-4 " />
                Delete Project
              </Button>
            }
          />
        )}

        <RadarChartDialog
          project={project}
          trigger={
            <Button
              className="flex w-max border-separate items-center gap-2 rounded-t-none text-muted-foreground  hover:bg-red-500/20 text-emerald-600 dark:text-emerald-500 font-semibold transition duration-300 hover:scale-105"
              variant={"secondary"}
            >
              <Radar className="h-4 w-4" /> Radar Chart
            </Button>
          }
        />
      </div>

      {/* Project details Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Project Budget child component*/}
        <BudgetDetailsCard project={project} />

        {/* Task Progress */}
        <Card className="transform transition-transform duration-300 hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Tasks Progress
            </CardTitle>
            <ListTodoIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-bold">
                {project.completedTasks}/{project.numberOfTasks}
              </span>
              <Badge className="ml-auto">Completed</Badge>
            </div>
            <Progress value={progress} className="mt-2" />
          </CardContent>
        </Card>

        {/* Project Status and Priority */}
        <Card className="transform transition-transform duration-300 hover:scale-105">
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
      <Card className="mt-6 transform transition-transform duration-300 hover:scale-105">
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Timeline</CardTitle>
          <ClockIcon className="h-4 w-4 text-muted-foreground" />
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

      {/* Task History Table */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4">Project Tasks</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="text-emerald-500 text-base font-extrabold"
                  scope="col"
                >
                  Name
                </TableHead>
                <TableHead
                  className="text-emerald-500 text-base font-extrabold"
                  scope="col"
                >
                  Description
                </TableHead>
                <TableHead
                  className="text-emerald-500 text-base font-extrabold"
                  scope="col"
                >
                  Status
                </TableHead>
                <TableHead
                  className="text-emerald-500 text-base font-extrabold"
                  scope="col"
                >
                  Due Date
                </TableHead>
                <TableHead
                  className="text-emerald-500 text-base font-extrabold text-center"
                  scope="col"
                >
                  Versions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {project.tasks.length > 0 ? (
                project.tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell className="font-semibold text-base text-gray-600">
                      {task.name}
                    </TableCell>
                    <TableCell className="font-semibold text-base text-gray-600">
                      {truncateDescription(task?.description!)}
                      {task?.description &&
                        task.description.split(" ").length > 7 && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <span className="text-emerald-500 cursor-pointer hover:underline">
                                Read More
                              </span>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <h2 className="text-xl font-semibold mb-2">
                                Task Description
                              </h2>
                              <p>{task?.description}</p>
                            </DialogContent>
                          </Dialog>
                        )}
                    </TableCell>
                    <TableCell className="font-semibold text-base text-gray-600">
                      {task.status}
                    </TableCell>
                    <TableCell className="font-semibold text-base text-gray-600">
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="font-semibold text-base text-emerald-500 text-center">
                      {task._count.TaskHistory}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No tasks available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default SingleProjectPage;
