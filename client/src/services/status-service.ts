import { httpClient } from "@/services/http-client";

export interface StatusOption {
  id: string;
  label: string;
  slug: string;
}

export const statusService = {
  getStatuses: () => httpClient.get<StatusOption[]>("/statuses"),
  createStatus: (label: string) => httpClient.post<StatusOption>("/statuses", { label }),
};
