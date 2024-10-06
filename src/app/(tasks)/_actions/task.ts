"use server";

import { currentUser } from "@clerk/nextjs/server";
import {
  CreateTaskSchema,
  CreateTaskSchemaType,
  DeleTeTaskSchema,
  DeleTeTaskSchemaType,
  UpdateTaskSchema,
  UpdateTaskSchemaType,
} from "../../../../ZodSchema/task";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// import { revalidatePath } from "next/cache";

export const CreateTask = async (form: CreateTaskSchemaType) => {
  // validating form data
  const parsedBody = CreateTaskSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid data");
  }

  //   validating user
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const {
    name,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    estimatedHours,
    actualHours,
    riskFlag,
    projectId,
    dependency,
    dependentOn,
  } = parsedBody.data;

  const createdTask = await prisma.task.create({
    data: {
      name,
      description,
      status,
      priority,
      dueDate: dueDate ?? undefined,
      assignedTo,
      estimatedHours: estimatedHours ?? undefined,
      actualHours: actualHours ?? undefined,
      riskFlag,
      userId: user.id,
      project: {
        connect: { id: projectId },
      },
      dependencies: dependency
        ? {
            connect: { id: dependency },
          }
        : undefined,
      dependentOn: dependentOn
        ? {
            connect: { id: dependentOn },
          }
        : undefined,
    },
  });

  revalidatePath("/MyTasks");
  return createdTask;
};

export const DeleteTask = async (form: DeleTeTaskSchemaType) => {
  const parsedBody = DeleTeTaskSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid post id");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const DeletedTask = await prisma.task.delete({
    where: {
      userId: user.id,
      id: parsedBody.data.taskId,
    },
  });

  redirect("/MyTasks");

  return DeletedTask;
};

export const UpdateTask = async (form: UpdateTaskSchemaType) => {
  // validating form data
  const parsedBody = UpdateTaskSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid data");
  }

  // validating user
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const {
    taskId,
    name,
    description,
    status,
    priority,
    dueDate,
    assignedTo,
    estimatedHours,
    actualHours,
    riskFlag,
  } = parsedBody.data;

  const UpdatedTask = await prisma.task.update({
    where: {
      userId: user.id,
      id: taskId,
    },
    data: {
      name,
      description,
      status,
      priority,
      dueDate,
      assignedTo,
      estimatedHours,
      actualHours,
      riskFlag,
    },
  });

  revalidatePath(`/MyTasks/${taskId}`);

  return Response.json(UpdatedTask);
};
