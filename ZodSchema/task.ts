import { z } from "zod";

export const CreateTaskSchema = z.object({
  name: z.string().min(1, "Task name is Required"),
  description: z.string().optional(),
  status: z.enum(["Todo", "Completed", "OnHold", "Ongoing", "Cancelled"]),
  priority: z.enum(["Low", "Medium", "High"]),
  dueDate: z.date().optional(),
  assignedTo: z.string().optional(),
  estimatedHours: z.number().positive().optional(),
  actualHours: z.number().nonnegative().optional(),
  riskFlag: z.boolean().default(false),
  projectId: z.string().uuid("Invalid project ID"),
});

export type CreateTaskSchemaType = z.infer<typeof CreateTaskSchema>;
