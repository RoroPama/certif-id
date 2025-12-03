/**
 * Client API HTTP avec Axios
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
    // Log pour vérifier le baseURL (uniquement en développement)
    if (process.env.NODE_ENV === "development") {
      console.log(`[API] Initializing ApiClient with baseURL: ${baseURL}`);
    }
    
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
        // Log pour debug (uniquement en développement)
        if (process.env.NODE_ENV === "development") {
          const fullUrl = config.url
            ? `${config.baseURL || this.client.defaults.baseURL}${config.url}`
            : "unknown";
          console.log(`[API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
        }

        let token: string | null = null;

        if (typeof window !== "undefined") {
          // Côté client : utiliser localStorage
          token = localStorage.getItem("auth_token");
        } else {
          // Côté serveur : utiliser les cookies (pour Next.js Server Components)
          // Note: Pour utiliser les cookies, il faut passer les cookies de la requête
          // via les headers de la requête HTTP
          if (config.headers && "cookie" in config.headers) {
            const cookies = config.headers.cookie as string;
            if (cookies) {
              const tokenMatch = cookies.match(/auth_token=([^;]+)/);
              if (tokenMatch) {
                token = decodeURIComponent(tokenMatch[1]);
              }
            }
          }
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Ne pas définir Content-Type pour FormData, laisser axios le faire automatiquement
        if (config.data instanceof FormData && config.headers) {
          delete config.headers['Content-Type'];
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

        throw new ApiClientError(500, error.message || MESSAGES.errors.network);
      }
    );
  }

  async get<T>(endpoint: string, options?: AxiosRequestConfig): Promise<T> {
    // Log pour debug (uniquement en développement)
    if (process.env.NODE_ENV === "development") {
      const fullUrl = `${this.client.defaults.baseURL}${endpoint}`;
      const params = options?.params ? `with params: ${JSON.stringify(options.params)}` : "";
      console.log(`[API] GET ${fullUrl}`, params);
    }
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
