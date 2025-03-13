import { z } from "zod";

// validation schema to create an issue
export const CreateIssueSchema = z.object({
  title: z.string().min(3).max(50),
  description: z.string().min(10).max(1000).optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Resolved", "Unresolved", "In Progress", "Closed"]),
  projectId: z.string().uuid("Invalid project ID"),
  taskId: z.string().uuid("Invalid task ID"),
  date: z.date().optional(),
});

// type for the schema
export type CreateIssueSchemaType = z.infer<typeof CreateIssueSchema>;

// validation schema to delete an issue
export const DeleteIssueSchema = z.object({
  issueId: z.string().uuid("Invalid issue id"),
});

// type for the schema
export type DeleteIssueSchemaType = z.infer<typeof DeleteIssueSchema>;

// validation schema to update an issue
export const UpdateIssueSchema = z.object({
  issueId: z.string().uuid("Invalid issue id"),
  title: z.string().min(3).max(50).optional(),
  description: z.string().min(10).max(1000).optional(),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["Resolved", "Unresolved", "In Progress", "Closed"]),
  projectId: z.string().uuid("Invalid project ID"),
  taskId: z.string().uuid("Invalid task ID"),
  date: z.date().optional(),
});

// type for the schema
export type UpdateIssueSchemaType = z.infer<typeof UpdateIssueSchema>;
