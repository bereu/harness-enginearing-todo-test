import type { TodoStatus } from "../types/todo";

export const TODO_STATUSES: readonly TodoStatus[] = ["todo", "in-progress", "done"];

export const STATUS_LABELS: Record<TodoStatus, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export const STATUS_COLORS: Record<TodoStatus, string> = {
  todo: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};
