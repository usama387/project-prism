"use server";

import { revalidatePath } from "next/cache";
import {
  CreateIssueSchema,
  CreateIssueSchemaType,
  DeleteIssueSchema,
  DeleteIssueSchemaType,
  UpdateIssueSchema,
  UpdateIssueSchemaType,
} from "../../../../ZodSchema/issue";
import prisma from "@/lib/prisma";

// server action to create an issue
export const CreateIssue = async (form: CreateIssueSchemaType) => {
  try {
    // validate form data with type
    const parsedBody = CreateIssueSchema.safeParse(form);

    if (!parsedBody.success) {
      throw new Error("Invalid data");
    }

    // destructure announcement data from body
    const { title, description, projectId, taskId, date, status, priority } =
      parsedBody.data;

    // create announcement now
    const newIssue = await prisma.issue.create({
      data: {
        title,
        description,
        status,
        priority,
        project: {
          connect: { id: projectId },
        },
        task: {
          connect: { id: taskId },
        },
        date: date ?? undefined,
      },
    });

    revalidatePath("/Issues");
    return newIssue;
  } catch (error) {
    console.log(error);
  }
};

// server action to delete a issue
export const DeleteIssue = async (form: DeleteIssueSchemaType) => {
  try {
    const parsedBody = DeleteIssueSchema.safeParse(form);

    if (!parsedBody.success) {
      throw new Error("Invalid data");
    }

    await prisma.issue.delete({
      where: {
        id: parsedBody.data?.issueId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// server action to create an issue
export const UpdateIssue = async (form: UpdateIssueSchemaType) => {
  try {
    // validate form data with type
    const parsedBody = UpdateIssueSchema.safeParse(form);

    if (!parsedBody.success) {
      throw new Error("Invalid data");
    }

    // destructure announcement data from body
    const {
      issueId,
      title,
      description,
      projectId,
      taskId,
      date,
      status,
      priority,
    } = parsedBody.data;

    // create announcement now
    const updatedIssue = await prisma.issue.update({
      where: {
        id: issueId,
      },
      data: {
        title,
        description,
        status,
        priority,
        project: {
          connect: { id: projectId },
        },
        task: {
          connect: { id: taskId },
        },
        date: date ?? undefined,
      },
    });

    revalidatePath("/Issues");
    return updatedIssue;
  } catch (error) {
    console.log(error);
  }
};
