"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  CreateProjectSchema,
  CreateProjectSchemaType,
  DeleteProjectSchema,
  DeleteProjectSchemaType,
  UpdateProjectSchema,
  UpdateProjectSchemaType,
} from "../../../../ZodSchema/Project";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    usedBudget,
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
      usedBudget: budget ?? undefined, // Pass undefined if null
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

  const deletedProject = await prisma.project.delete({
    where: {
      userId: user.id,
      id: parsedBody.data.projectId,
    },
  });

  redirect("/MyProjects");

  return deletedProject;
};

export const UpdateProject = async (form: UpdateProjectSchemaType) => {
  // validating project id from zod to update a project
  const parsedBody = UpdateProjectSchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid data");
  }

  // getting and validating user
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const {
    projectId,
    name,
    description,
    startDate,
    deadline,
    status,
    priority,
    budget,
    usedBudget,
    numberOfTasks,
    completedTasks,
  } = parsedBody.data;

  // Update the project
  const updatedProject = await prisma.project.update({
    where: {
      userId: user.id,
      id: projectId,
    },
    data: {
      name,
      description,
      startDate: startDate ?? undefined,
      deadline: deadline ?? undefined,
      status,
      priority,
      budget: budget ?? undefined,
      usedBudget: budget ?? undefined,
      numberOfTasks: numberOfTasks ?? undefined,
      completedTasks: completedTasks ?? undefined,
    },
  });

  // Revalidate the path for the updated project
  revalidatePath(`/MyProjects/${projectId}`); // Add this line to revalidate the specific project page

  return updatedProject; // Return the updated project
};
