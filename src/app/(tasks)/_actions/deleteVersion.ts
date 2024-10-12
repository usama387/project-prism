"use server";

import { currentUser } from "@clerk/nextjs/server";
import {
  DeleteVersionSchema,
  DeleteVersionSchemaType,
} from "../../../../ZodSchema/taskVersion";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export const DeleteTaskVersion = async (form: DeleteVersionSchemaType) => {
  const parsedBody = DeleteVersionSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid id");
  }

  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const DeletedTaskVersion = await prisma.taskHistory.delete({
    where: {
      userId: user.id,
      id: parsedBody.data?.taskHistoryId,
    },
  });

  redirect("/MyTasks/versions");

  return DeletedTaskVersion;
};
