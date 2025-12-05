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
    CREATE: "/etablissement/demandes",
  },
  // Documents (Types de documents)
  DOCUMENTS: {
    GET_TYPES: "/etablissement/documents/types",
    UPLOAD: "/etablissement/documents/upload",
  },
  // Registry (Documents signés)
  REGISTRY: {
    GET_ALL: "/etablissement/documents",
    GET_HISTORY: "/etablissement/documents/history",
    GET_BY_ID: (id: string) => `/etablissement/documents/${id}`,
    DOWNLOAD: (id: string) => `/etablissement/documents/${id}/download`,
  },
  // Profile (Profil établissement)
  PROFILE: {
    GET: "/etablissement/profile",
    UPDATE: "/etablissement/profile",
    GET_STATS: "/etablissement/profile/stats",
  },
  // Ministère - Demandes
  MINISTERE: {
    DEMANDES: {
      GET_ALL: "/ministere/demandes",
      GET_BY_ID: (id: string) => `/ministere/demandes/${id}`,
      GET_DOCUMENT_BY_ID: (demandeId: string, documentId: string) =>
        `/ministere/demandes/${demandeId}/documents/${documentId}`,
      GET_STATS: "/ministere/demandes/stats",
      BULK_APPROVE: (demandeId: string) =>
        `/ministere/demandes/${demandeId}/documents/bulk-approve`,
      BULK_REJECT: (demandeId: string) =>
        `/ministere/demandes/${demandeId}/documents/bulk-reject`,
      APPROVE_DOCUMENT: (demandeId: string, documentId: string) =>
        `/ministere/demandes/${demandeId}/documents/${documentId}/sign`,
      REJECT_DOCUMENT: (demandeId: string, documentId: string) =>
        `/ministere/demandes/${demandeId}/documents/${documentId}/reject`,
    },
    // Ministère - Documents signés (Registre)
    DOCUMENTS: {
      GET_ALL: "/ministere/documents",
      GET_BY_ID: (id: string) => `/ministere/documents/${id}`,
    },
    // Ministère - Établissements
    ETABLISSEMENTS: {
      GET_ALL: "/ministere/etablissements",
      GET_BY_ID: (id: string) => `/ministere/etablissements/${id}`,
      CREATE: "/ministere/etablissements",
      UPDATE: (id: string) => `/ministere/etablissements/${id}`,
    },
    // Ministère - Parcours
    PARCOURS: {
      GET_ALL: "/ministere/parcours",
      GET_BY_ID: (id: string) => `/ministere/parcours/${id}`,
      CREATE: "/ministere/parcours",
      UPDATE: (id: string) => `/ministere/parcours/${id}`,
      DELETE: (id: string) => `/ministere/parcours/${id}`,
    },
    // Ministère - Types de documents (Diplômes)
    DOCUMENT_TYPES: {
      GET_ALL: "/ministere/document-types",
      GET_BY_ID: (id: string) => `/ministere/document-types/${id}`,
      CREATE: "/ministere/document-types",
      UPDATE: (id: string) => `/ministere/document-types/${id}`,
      DELETE: (id: string) => `/ministere/document-types/${id}`,
    },
  },
} as const;
