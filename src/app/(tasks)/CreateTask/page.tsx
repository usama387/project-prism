import React from "react";
import CreateTaskDialog from "../_components/CreateTaskDialog";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { Plus, CheckCircle2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { currentUser } from "@clerk/nextjs/server";

const CreateTaskPage = async () => {
  // Fetching projects and passing to CreateTaskDialog component
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  // Fetching tasks and passing as prop to CreateTaskDialog component
  // to select dependency
  const tasks = await prisma.task.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  // getting user to display its details
  const user = await currentUser();

  // getting role from user metadata
  const role = user?.publicMetadata.role;
  
  return (
    <>
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="mt-4 text-center text-base text-muted-foreground">
          Let's get started by setting up your task
        </h2>
        <h3 className="mt-2 text-center text-sm text-muted-foreground">
          You can add tasks and change their details at any time
        </h3>
      </div>
      <Separator />
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Task Manager</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Example task card */}
          <div className="bg-card text-card-foreground rounded-lg shadow-lg p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-lg mb-2">
                Complete project proposal
              </h3>
              <p className="text-sm text-muted-foreground">
                Draft and submit the project proposal by Friday
              </p>
            </div>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />
              In Progress
            </div>
          </div>

          {/* Task creation button with dialog */}
          {role === "admin" && (
            <CreateTaskDialog
              projects={projects}
              tasks={tasks}
              trigger={
                <Button
                  variant="outline"
                  className="h-full flex flex-col items-center justify-center space-y-4 border-2 border-dashed border-emerald-300 bg-emerald-950 text-white hover:bg-emerald-900 transition-colors duration-300"
                >
                  <Plus className="h-8 w-8" />
                  <span>Create New Task</span>
                </Button>
              }
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CreateTaskPage;
