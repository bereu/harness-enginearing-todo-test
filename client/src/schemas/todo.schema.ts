import { z } from "zod";
import type { TodoStatus } from "@/types/todo";

const TODO_STATUSES: TodoStatus[] = ["todo", "in-progress", "done"];

export const CreateTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be no longer than 255 characters"),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be no longer than 2000 characters")
    .optional()
    .nullable(),
  status: z.enum(TODO_STATUSES).optional().default("todo"),
});

export const UpdateTodoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(255, "Title must be no longer than 255 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(2000, "Description must be no longer than 2000 characters")
    .optional()
    .nullable(),
  completed: z.boolean().optional(),
  status: z.enum(TODO_STATUSES).optional(),
});

export type CreateTodoInput = z.infer<typeof CreateTodoSchema>;
export type UpdateTodoInput = z.infer<typeof UpdateTodoSchema>;
