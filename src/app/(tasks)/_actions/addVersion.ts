"use server";

import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  AddVersionSchema,
  AddVersionSchemaType,
} from "../../../../ZodSchema/taskVersion";
import { revalidatePath } from "next/cache";

export const AddVersion = async (form: AddVersionSchemaType) => {
  // validating form data
  const parsedBody = AddVersionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid data");
  }

  //   validating user
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const {
    version,
    changes,
    taskId,
    updatedBy,
    updatedAt,
    dueDate,
    hoursConsumed,
    status,
    priority,
  } = parsedBody.data;

  const addedVersion = await prisma.taskHistory.create({
    data: {
      version,
      changes,
      updatedBy,
      updatedAt: updatedAt ?? undefined,
      dueDate: dueDate ?? undefined,
      hoursConsumed: hoursConsumed ?? undefined,
      status,
      priority,
      userId: user.id,
      task: {
        connect: { id: taskId },
      },
    },
  });

  revalidatePath("/MyTasks/versions");

  return addedVersion;
};
