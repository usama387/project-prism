"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  CreateProjectSchema,
  CreateProjectSchemaType,
} from "../../../../ZodSchema/Project";
import prisma from "@/lib/prisma";

export const CreateProject = async (form: CreateProjectSchemaType) => {
  // validating form data
  const parsedBody = CreateProjectSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid data");
  }

  //   now validating user
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const {
    name,
    description,
    startDate,
    deadline,
    status,
    priority,
    budget,
    numberOfTasks,
  } = parsedBody.data;

  return await prisma.project.create({
    data: {
      name,
      description,
      status,
      priority,
      startDate: startDate ?? undefined, // Pass undefined if null
      deadline: deadline ?? undefined, // Pass undefined if null
      budget: budget ?? undefined, // Pass undefined if null
      numberOfTasks: numberOfTasks ?? undefined, // Pass undefined if null
      userId: user.id,
    },
  });
};
