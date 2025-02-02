"use server";

import prisma from "@/lib/prisma";
import {
  CreateAnnouncementSchema,
  CreateAnnouncementSchemaType,
  DeleteAnnouncementSchema,
  DeleteAnnouncementSchemaType,
  UpdateAnnouncementSchema,
  UpdateAnnouncementSchemaType,
} from "../../../../ZodSchema/announcement";
import { revalidatePath } from "next/cache";

// server action to create announcement
export const CreateAnnouncement = async (
  form: CreateAnnouncementSchemaType
) => {
  try {
    // validate form data with type
    const parsedBody = CreateAnnouncementSchema.safeParse(form);

    if (!parsedBody.success) {
      throw new Error("Invalid data");
    }

    // destructure announcement data from body
    const { title, description, projectId, taskId, date } = parsedBody.data;

    // create announcement now
    const newAnnouncement = await prisma.announcement.create({
      data: {
        title,
        description,
        project: {
          connect: { id: projectId },
        },
        task: {
          connect: { id: taskId },
        },
        date: date ?? undefined,
      },
    });

    revalidatePath("/Announcements");
    return newAnnouncement;
  } catch (error) {
    console.log(error);
  }
};

// server action to delete announcement
export const DeleteAnnouncement = async (
  form: DeleteAnnouncementSchemaType
) => {
  try {
    const parsedBody = DeleteAnnouncementSchema.safeParse(form);

    if (!parsedBody.success) {
      throw new Error("Invalid data");
    }

    await prisma.announcement.delete({
      where: {
        id: parsedBody.data?.announcementId,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

// server action to update announcement
export const UpdateAnnouncement = async (
  form: UpdateAnnouncementSchemaType
) => {
  try {
    const parsedBody = UpdateAnnouncementSchema.safeParse(form);

    if (!parsedBody.success) {
      throw new Error("Invalid data");
    }

    const { announcementId, title, description, projectId, taskId, date } =
      parsedBody.data;

    const UpdatedAnnouncement = await prisma.announcement.update({
      where: {
        id: announcementId,
      },
      data: {
        title,
        description,
        project: {
          connect: { id: projectId },
        },
        task: {
          connect: { id: taskId },
        },
        date: date ?? undefined,
      },
    });

    revalidatePath("/Announcements");

    return UpdatedAnnouncement;
  } catch (error) {
    console.log(error);
  }
};
