import { z } from "zod";

// Define the status enum
const StatusEnum = z.enum(["COMPLETED", "ONGOING", "CANCELLED"]);

// Define the priority enum
const PriorityEnum = z.enum(["High", "Low", "Medium"]);

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
  startDate: z.date().nullable().optional(),
  deadline: z.date().nullable().optional(),
  status: StatusEnum.default("ONGOING"),
  priority: PriorityEnum.default("Medium"),
  budget: z.number().min(0, "Budget must be a positive number").optional(),
  numberOfTasks: z
    .number()
    .min(1, "Number of tasks must be at least 1")
    .optional(),
  completedTasks: z
    .number()
    .min(0, "Number of tasks must be at least 1")
    .optional(),
});

export type CreateProjectSchemaType = z.infer<typeof CreateProjectSchema>;

export const DeleteProjectSchema = z.object({
  projectId: z.string().uuid("Invalid project id"),
});

export type DeleteProjectSchemaType = z.infer<typeof DeleteProjectSchema>;
