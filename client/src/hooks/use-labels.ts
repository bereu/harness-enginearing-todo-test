import { useState, useEffect, useCallback } from "react";
import { labelService, type Label } from "@/services/label-service";
import type { ApiError } from "@/services/http-client";

interface UseLabelsResult {
  labels: Label[];
  isLoading: boolean;
  error: string | null;
  createLabel: (name: string, color: string) => Promise<Label>;
}

export function useLabels(): UseLabelsResult {
  const [labels, setLabels] = useState<Label[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    labelService
      .getLabels()
      .then((res) => {
        setLabels(res.data);
      })
      .catch((err: ApiError) => {
        setError(err.message || "Failed to load labels");
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const createLabel = useCallback(async (name: string, color: string): Promise<Label> => {
    const res = await labelService.createLabel(name, color);
    const newLabel = res.data;
    setLabels((prev) => [...prev, newLabel]);
    return newLabel;
  }, []);

  return { labels, isLoading, error, createLabel };
}
