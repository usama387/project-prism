"use server";

import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  AddVersionSchema,
  AddVersionSchemaType,
} from "../../../../ZodSchema/taskVersion";

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

  const { version, changes, taskId, updatedBy, updatedAt } = parsedBody.data;

  const createdTask = await prisma.taskHistory.create({
    data: {
      version,
      changes,
      updatedBy,
      updatedAt: updatedAt ?? undefined,
      userId: user.id,
      task: {
        connect: { id: taskId },
      },
    },
  });

  return createdTask;
};
