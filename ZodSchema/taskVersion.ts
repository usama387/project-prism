import { z } from "zod";

// schema for adding a version
export const AddVersionSchema = z.object({
  version: z.string().min(1, "version is Required"),
  changes: z.string(),
  updatedBy: z.string().min(1, "person name is Required"),
  updatedAt: z.date().optional(),
  // relation with task table using its id
  taskId: z.string().uuid("Invalid task ID"),
});

export type AddVersionSchemaType = z.infer<typeof AddVersionSchema>;

// schema for deleting a version
export const DeleteVersionSchema = z.object({
  taskHistoryId: z.string().uuid("Invalid task history id"),
});

export type DeleteVersionSchemaType = z.infer<typeof DeleteVersionSchema>;

// schema for updating a version
export const UpdateVersionSchema = z.object({
  versionId: z.string().uuid("Invalid task history id"),
  version: z.string().min(1, "version is Required"),
  changes: z.string(),
  updatedBy: z.string().min(1, "person name is Required"),
  updatedAt: z.date().optional(),

  // relation with task table using its id
  taskId: z.string().uuid("Invalid task ID"),
});

export type UpdateVersionSchemaType = z.infer<typeof UpdateVersionSchema>;
