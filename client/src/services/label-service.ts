import { httpClient } from "@/services/http-client";
import type { Label } from "@/types/todo";

export type { Label };

export const labelService = {
  getLabels: () => httpClient.get<Label[]>("/todos/labels"),
  createLabel: (name: string, color: string) =>
    httpClient.post<Label>("/todos/labels", { name, color }),
};
