"use server";

import { currentUser } from "@clerk/nextjs/server";
import {
  CreateCategorySchema,
  CreateCategorySchemaType,
  DeleteCategorySchema,
  DeleteCategorySchemaType,
} from "../../../../ZodSchema/Categories";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

// this server action is being used in createCategoryDialog component
export const createCategory = async (form: CreateCategorySchemaType) => {
  // validating form data by passing in the form parameter
  const parsedBody = CreateCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid data");
  }

  //   getting user from clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { name, icon, type } = await parsedBody.data;

  return await prisma.category.create({
    data: {
      name,
      icon,
      type,
      userId: user.id,
    },
  });
};

// this server action is being used in deleteCategoryDialog component
export const DeleteCategory = async (form: DeleteCategorySchemaType) => {
  // validating form data by passing in the form parameter
  const parsedBody = DeleteCategorySchema.safeParse(form);

  if (!parsedBody.success) {
    throw new Error("Invalid data");
  }

  //   getting user from clerk
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return await prisma.category.delete({
    where: {
      name_userId_type: {
        userId: user.id,
        name: parsedBody.data.name,
        type: parsedBody.data.type,
      },
    },
  });
};
