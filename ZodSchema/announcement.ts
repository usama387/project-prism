import { z } from "zod";

// form validation schema to create announcements
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

// form validation schema to delete announcements
export const DeleteAnnouncementSchema = z.object({
  announcementId: z.string().uuid("Invalid announcement id"),
});

export type DeleteAnnouncementSchemaType = z.infer<
  typeof DeleteAnnouncementSchema
>;

// form validation schema to update announcements
export const UpdateAnnouncementSchema = z.object({
  announcementId: z.string().uuid("Invalid announcement id"),
  title: z.string().min(1, "Title is Required"),
  description: z.string().min(1, "Description is Required"),
  projectId: z.string().uuid("Invalid project ID"),
  taskId: z.string().uuid("Invalid task ID"),
  date: z.date().optional(),
});

export type UpdateAnnouncementSchemaType = z.infer<
  typeof UpdateAnnouncementSchema
>;
