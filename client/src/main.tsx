import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "@/app";
import { logErrorToRollbar } from "@/services/rollbar";
import { ErrorBoundary } from "@/components/error-boundary";

// Initialize Rollbar (if token is provided and in production)

// Global unhandled rejection handler
window.addEventListener("unhandledrejection", (event) => {
  const error = event.reason instanceof Error ? event.reason : new Error(String(event.reason));
  logErrorToRollbar(error, "error", {
    errorType: "unhandled_rejection",
  });
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
