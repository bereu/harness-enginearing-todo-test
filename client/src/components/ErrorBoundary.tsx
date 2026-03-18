import React, { ErrorInfo, ReactNode } from "react";
import { logErrorToRollbar } from "@/services/rollbar";
import "./ErrorBoundary.css";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logErrorToRollbar(error, "error", {
      errorType: "react_error_boundary",
      componentStack: errorInfo.componentStack,
    });

    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary-fallback">
            <h1>Something went wrong</h1>
            <p>We've been notified about this issue and will look into it.</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="error-boundary-retry"
            >
              Try again
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
