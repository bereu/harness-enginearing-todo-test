import Rollbar from "rollbar";

const ROLLBAR_TOKEN = import.meta.env.VITE_ROLLBAR_TOKEN;
const ROLLBAR_ENABLED = ROLLBAR_TOKEN && import.meta.env.PROD;

export const rollbarService = ROLLBAR_ENABLED
  ? new Rollbar({
      accessToken: ROLLBAR_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: import.meta.env.MODE,
      enabled: true,
    })
  : null;

export interface ErrorContext {
  userId?: string;
  route?: string;
  action?: string;
  [key: string]: unknown;
}

export const logErrorToRollbar = (
  error: Error | string,
  level: "error" | "warning" | "info" = "error",
  context?: ErrorContext,
) => {
  if (!rollbarService) {
    return;
  }

  const data = {
    custom: context || {},
  };

  if (typeof error === "string") {
    rollbarService[level](error, data);
  } else {
    rollbarService[level](error, data);
  }
};

export const logApiError = (
  error: unknown,
  context?: {
    method?: string;
    url?: string;
    status?: number;
    userId?: string;
    action?: string;
  },
) => {
  const errorMessage =
    typeof error === "string"
      ? error
      : (error as unknown as { message?: string })?.message || "Unknown error";

  logErrorToRollbar(errorMessage, "error", {
    errorType: "api_error",
    ...context,
  });
};
