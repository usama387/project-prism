import { z } from "zod";

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  startDate: z.date().nullable().optional(),
  deadline: z.date().nullable().optional(),
  taskCount: z.coerce.number().positive(),
});

export type CreateProjectSchemaType = z.infer<typeof CreateProjectSchema>;
