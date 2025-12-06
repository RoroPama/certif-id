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
      timeout: appConfig.api.timeout || 30000, // 30 secondes par défaut
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
          const rawData = error.response.data;
          
          // Parser errorData de manière plus robuste
          let errorData: {
            message?: string | string[];
            error?: string;
            statusCode?: number;
          } = {};
          
          if (rawData) {
            if (typeof rawData === "string") {
              // Si c'est une string, créer un objet avec le message
              errorData = { message: rawData };
            } else if (typeof rawData === "object" && rawData !== null) {
              // Si c'est un objet, l'utiliser directement
              errorData = rawData as {
                message?: string | string[];
                error?: string;
                statusCode?: number;
              };
            }
          }

          // Log pour debug (uniquement en développement)
          if (process.env.NODE_ENV === "development") {
            console.error("[API Error]", {
              status: statusCode,
              url: error.config?.url,
              baseURL: error.config?.baseURL,
              method: error.config?.method,
              params: error.config?.params,
              requestData: error.config?.data,
              responseData: rawData,
              parsedErrorData: errorData,
              headers: error.response.headers,
            });
          }

          // Gérer les messages de validation qui peuvent être un tableau
          let errorMessage: string;
          if (errorData && typeof errorData === "object") {
            if (Array.isArray(errorData.message)) {
              errorMessage = errorData.message.join(", ");
            } else if (errorData.message && typeof errorData.message === "string") {
              errorMessage = errorData.message;
            } else if (errorData.error && typeof errorData.error === "string") {
              errorMessage = errorData.error;
            } else if (error.message) {
              errorMessage = error.message;
            } else {
              errorMessage = `Erreur serveur (${statusCode})`;
            }
          } else if (typeof errorData === "string") {
            errorMessage = errorData;
          } else if (error.message) {
            errorMessage = error.message;
          } else {
            errorMessage = `Erreur serveur (${statusCode})`;
          }

          throw new ApiClientError(
            statusCode,
            errorMessage,
            typeof errorData === "object" && errorData?.error 
              ? errorData.error 
              : typeof errorData === "object" && typeof errorData?.message === "string"
              ? errorData.message
              : undefined
          );
        }

        // Gestion des erreurs réseau (timeout, pas de connexion, etc.)
        if (error.code === 'ECONNABORTED') {
          throw new ApiClientError(
            408,
            'La requête a expiré. Vérifiez que le serveur backend est démarré et accessible.',
            'TIMEOUT'
          );
        }

        if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
          throw new ApiClientError(
            503,
            'Impossible de se connecter au serveur. Vérifiez que le backend est démarré sur ' + baseURL,
            'NETWORK_ERROR'
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
