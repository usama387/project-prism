"use server";

import { currentUser } from "@clerk/nextjs/server";

import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  UpdateVersionSchema,
  UpdateVersionSchemaType,
} from "../../../../ZodSchema/taskVersion";
import { revalidatePath } from "next/cache";

export const UpdateTaskVersion = async (form: UpdateVersionSchemaType) => {
  const parsedBody = UpdateVersionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid data");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const {
    versionId,
    version,
    changes,
    updatedBy,
    updatedAt,
    dueDate,
    hoursConsumed,
    status,
    priority,
    taskId,
  } = parsedBody.data;

  const UpdatedTaskVersion = await prisma.taskHistory.update({
    where: {
      userId: user.id,
      id: versionId,
    },
    data: {
      version,
      changes,
      updatedBy,
      status,
      priority,
      updatedAt: updatedAt ?? undefined,
      dueDate: dueDate ?? undefined,
      hoursConsumed: hoursConsumed ?? undefined,
      task: {
        connect: {
          id: taskId,
        },
      },
    },
  });

  revalidatePath(`/MyTasks/versions/${versionId}`);

  return UpdatedTaskVersion;
};
