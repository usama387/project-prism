import { z } from "zod";

// schema used to create the project
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

// schema used to delete the project
export const DeleteProjectSchema = z.object({
  projectId: z.string().uuid("Invalid project id"),
});

export type DeleteProjectSchemaType = z.infer<typeof DeleteProjectSchema>;

// schema used to update the project
export const UpdateProjectSchema = z.object({
  projectId: z.string().uuid(), // Assuming projectId is a string in UUID format
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z.date().nullable().optional(),
  deadline: z.date().nullable().optional(),
  status: z.enum(["COMPLETED", "ONGOING", "CANCELLED"]).optional(),
  priority: z.enum(["High", "Medium", "Low"]).optional(),
  budget: z.number().optional(),
  numberOfTasks: z.number().optional(),
  completedTasks: z.number().optional(),
});

export type UpdateProjectSchemaType = z.infer<typeof UpdateProjectSchema>;
