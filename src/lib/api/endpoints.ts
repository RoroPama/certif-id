/**
 * Définition centralisée des endpoints API
 * Ces endpoints correspondent aux routes NestJS
 */

export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: "/auth/login",
    VERIFY_OTP: "/auth/verify-otp",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REQUEST_RESET_PASSWORD: "/auth/request-reset-password",
    RESET_PASSWORD: "/auth/reset-password",
    ENABLE_2FA: "/auth/enable-2fa",
    DISABLE_2FA: "/auth/disable-2fa",
    RESEND_OTP: "/auth/resend-otp",
  },
  // Requests (Demandes)
  REQUESTS: {
    GET_ALL: "/etablissement/demandes",
    GET_BY_ID: (id: string) => `/etablissement/demandes/${id}`,
    GET_DOCUMENT_BY_ID: (demandeId: string, documentId: string) =>
      `/etablissement/demandes/${demandeId}/documents/${documentId}`,
  },
  // Registry (Documents signés)
  REGISTRY: {
    GET_ALL: "/etablissement/documents",
    GET_HISTORY: "/etablissement/documents/history",
    GET_BY_ID: (id: string) => `/etablissement/documents/${id}`,
    DOWNLOAD: (id: string) => `/etablissement/documents/${id}/download`,
  },
} as const;
