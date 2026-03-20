export const TODO_STATUSES = ["todo", "in-progress", "done"] as const;

export const STATUS_LABELS: Record<string, string> = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

export const STATUS_COLORS: Record<string, string> = {
  todo: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  done: "bg-green-100 text-green-800",
};

export function getStatusLabel(slug: string): string {
  return STATUS_LABELS[slug] ?? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getStatusColor(slug: string): string {
  return STATUS_COLORS[slug] ?? "bg-purple-100 text-purple-800";
}
