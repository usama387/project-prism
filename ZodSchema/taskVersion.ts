import { z } from "zod";

export const AddVersionSchema = z.object({
  version: z.string().min(1, "version is Required"),
  changes: z.string(),
  updatedBy: z.string().min(1, "person name is Required"),
  updatedAt: z.date().optional(),
  // relation with task table using its id
  taskId: z.string().uuid("Invalid task ID"),
});

export type AddVersionSchemaType = z.infer<typeof AddVersionSchema>;
