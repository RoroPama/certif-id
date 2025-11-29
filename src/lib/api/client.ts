/**
 * Client API HTTP
 * Configuré pour intégrer avec NestJS backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class ApiClientError extends Error {}

interface RequestOptions extends RequestInit {}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {}

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {}

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {}

  async post<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {}

  async put<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {}

  async patch<T>(endpoint: string, data?: unknown, options?: RequestOptions): Promise<T> {}

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {}
}

export const apiClient = new ApiClient();
