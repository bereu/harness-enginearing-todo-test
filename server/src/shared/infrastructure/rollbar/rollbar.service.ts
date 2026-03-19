import { Injectable } from "@nestjs/common";
import Rollbar from "rollbar";

interface ErrorContext {
  userId?: string;
  resourceId?: string;
  action?: string;
  [key: string]: unknown;
}

@Injectable()
export class RollbarService {
  private rollbar: Rollbar | null;

  constructor() {
    const token = process.env.ROLLBAR_TOKEN;
    const environment = process.env.NODE_ENV || "development";

    if (token && environment === "production") {
      this.rollbar = new Rollbar({
        accessToken: token,
        environment,
        enabled: true,
      });
    } else {
      this.rollbar = null;
    }
  }

  logError(error: Error | string, context?: ErrorContext): void {
    if (!this.rollbar) {
      return;
    }

    const data = { custom: context || {} };
    if (typeof error === "string") {
      this.rollbar.error(error, data);
    } else {
      this.rollbar.error(error, data);
    }
  }

  logBusinessLogicError(message: string, context?: ErrorContext): void {
    if (!this.rollbar) {
      return;
    }

    this.rollbar.warning(message, {
      custom: { ...context, errorType: "business_logic" },
    });
  }

  logSystemError(error: Error | string, context?: ErrorContext): void {
    if (!this.rollbar) {
      return;
    }

    const data = {
      custom: { ...context, errorType: "system_error" },
    };
    if (typeof error === "string") {
      this.rollbar.error(error, data);
    } else {
      this.rollbar.error(error, data);
    }
  }

  async wait(): Promise<void> {
    return this.rollbar?.wait() || Promise.resolve();
  }
}
