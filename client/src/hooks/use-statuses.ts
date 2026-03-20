import { useState, useEffect, useCallback } from "react";
import { statusService, type StatusOption } from "@/services/status-service";
import type { ApiError } from "@/services/http-client";

interface UseStatusesResult {
  statuses: StatusOption[];
  isLoading: boolean;
  error: string | null;
  createStatus: (label: string) => Promise<StatusOption>;
}

export function useStatuses(): UseStatusesResult {
  const [statuses, setStatuses] = useState<StatusOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    statusService
      .getStatuses()
      .then((res) => {
        setStatuses(res.data);
      })
      .catch((err: ApiError) => {
        setError(err.message || "Failed to load statuses");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const createStatus = useCallback(async (label: string): Promise<StatusOption> => {
    const res = await statusService.createStatus(label);
    const newStatus = res.data;
    setStatuses((prev) => [...prev, newStatus]);
    return newStatus;
  }, []);

  return { statuses, isLoading, error, createStatus };
}
