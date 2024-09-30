"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  CreateProjectSchema,
  CreateProjectSchemaType,
  DeleteProjectSchema,
  DeleteProjectSchemaType,
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
    completedTasks,
  } = parsedBody.data;

  return await prisma.project.create({
    data: {
      name,
      description,
      status,
      priority,
      completedTasks,
      startDate: startDate ?? undefined, // Pass undefined if null
      deadline: deadline ?? undefined, // Pass undefined if null
      budget: budget ?? undefined, // Pass undefined if null
      numberOfTasks: numberOfTasks ?? undefined, // Pass undefined if null
      userId: user.id,
    },
  });
};

// this server action deletes the project belongs to a particular user using project id from zod schema
export const DeleteProject = async (form: DeleteProjectSchemaType) => {
  // validating the project id with zod to delete a project
  const parsedBody = DeleteProjectSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid data");
  }

  // getting and validating user that will delete his/her project
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const DeleteProject = await prisma.project.delete({
    where: {
      userId: user.id,
      id: parsedBody.data.projectId,
    },
  });
};
