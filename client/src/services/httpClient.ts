import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from "axios";
import { logApiError } from "@/services/rollbar";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add any request interceptors here (e.g., auth tokens)
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message: error.message,
          status: error.response?.status || 0,
          code: error.code,
        };

        // Handle specific error statuses
        if (error.response?.status === 401) {
          // Handle unauthorized - redirect to login if needed
          apiError.message = "Unauthorized - please log in again";
        } else if (error.response?.status === 404) {
          apiError.message = "Resource not found";
        } else if (error.response?.status === 400) {
          const data = error.response.data as { message?: string };
          apiError.message = data?.message || "Bad request";
        } else if (!error.response) {
          apiError.message = "Network error - please check your connection";
        }

        // Log to Rollbar
        logApiError(apiError, {
          method: error.config?.method?.toUpperCase(),
          url: error.config?.url,
          status: apiError.status,
          action: "api_request",
        });

        return Promise.reject(apiError);
      },
    );
  }

  get<T>(url: string, config?: any) {
    return this.instance.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: any) {
    return this.instance.post<T>(url, data, config);
  }

  patch<T>(url: string, data?: any, config?: any) {
    return this.instance.patch<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: any) {
    return this.instance.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: any) {
    return this.instance.delete<T>(url, config);
  }
}

export const httpClient = new HttpClient();
