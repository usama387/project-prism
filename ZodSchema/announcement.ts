import { z } from "zod";

export const CreateAnnouncementSchema = z.object({
  title: z.string().min(1, "Title is Required"),
  description: z.string().min(1, "Description is Required"),
  projectId: z.string().uuid("Invalid project ID"),
  taskId: z.string().uuid("Invalid task ID"),
  date: z.date().optional(),
});

export type CreateAnnouncementSchemaType = z.infer<
  typeof CreateAnnouncementSchema
>;

export const DeleteAnnouncementSchema = z.object({
  announcementId: z.string().uuid("Invalid announcement id"),
});

export type DeleteAnnouncementSchemaType = z.infer<
  typeof DeleteAnnouncementSchema
>;