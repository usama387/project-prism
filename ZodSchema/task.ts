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
  // relation with project table using its id
  projectId: z.string().uuid("Invalid project ID"),
  // Added dependencies field relation with task table itself
  dependency: z.string().optional(),
  dependentOn: z.string().optional(),
});

export type CreateTaskSchemaType = z.infer<typeof CreateTaskSchema>;

// export const UpdateTaskSchema = z.object({
//   taskId: z.string().uuid(),
//   name: z.string().optional(),
//   description: z.string().optional(),
// });
