/**
 * Client API HTTP avec Axios
 * Configuré pour intégrer avec NestJS backend
 */

import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from "axios";
import { appConfig } from "../config/appConfig";
import { MESSAGES } from "../utils/messages";

export class ApiClientError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public error?: string
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

class ApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = appConfig.api.baseUrl) {
    this.client = axios.create({
      baseURL,
      timeout: appConfig.api.timeout,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Intercepteur pour les requêtes (ajout du token)
    this.client.interceptors.request.use(
      (config) => {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("auth_token")
            : null;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Intercepteur pour les réponses (gestion des erreurs)
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const statusCode = error.response.status;
          const errorData = error.response.data as {
            message?: string;
            error?: string;
          };

          throw new ApiClientError(
            statusCode,
            errorData.message || error.message || MESSAGES.errors.generic,
            errorData.error
          );
        }

        throw new ApiClientError(
          500,
          error.message || MESSAGES.errors.network
        );
      }
    );
  }

  async get<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(endpoint, options);
    return response.data;
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.post<T>(endpoint, data, options);
    return response.data;
  }

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.put<T>(endpoint, data, options);
    return response.data;
  }

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: AxiosRequestConfig
  ): Promise<T> {
    const response = await this.client.patch<T>(endpoint, data, options);
    return response.data;
  }

  async delete<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(endpoint, options);
    return response.data;
  }
}

export const apiClient = new ApiClient();
