"use server";

import { currentUser } from "@clerk/nextjs/server";
import {
  CreateTaskSchema,
  CreateTaskSchemaType,
} from "../../../../ZodSchema/task";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
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
    },
  });

  //   revalidatePath("/tasks");
  return createdTask;
};
