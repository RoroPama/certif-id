/**
 * Constantes de l'application
 * Routes, configuration et autres constantes globales
 */

// ============================================================================
// ROUTES
// ============================================================================

/**
 * Routes d'authentification
 */
export const AUTH_ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
} as const;

/**
 * Routes du module Institution (Établissements d'enseignement)
 */
export const INSTITUTION_ROUTES = {
  ROOT: "/institution",
  OVERVIEW: "/institution/overview",
  REQUESTS: "/institution/requests",
  REQUEST_DETAIL: (id: string) => `/institution/requests/${id}`,
  REGISTRY: "/institution/registry",
  REGISTRY_DETAIL: (id: string) => `/institution/registry/${id}`,
  NEW_REQUEST: "/institution/new-request",
  CONFIG: "/institution/config",
  INSTITUTION_PROFILE: "/institution/institution",
} as const;

/**
 * Routes du module Government (Ministère)
 */
export const GOVERNMENT_ROUTES = {
  ROOT: "/government",
  OVERVIEW: "/government/overview",
  UNIVERSITIES: "/government/universities",
  UNIVERSITY_DETAIL: (id: string) => `/government/universities/${id}`,
  CERTIFICATIONS: "/government/certifications",
  CERTIFICATION_DETAIL: (id: string) => `/government/certifications/${id}`,
  REGISTRY: "/government/registry",
  REGISTRY_DETAIL: (id: string) => `/government/registry/${id}`,
  CONFIG: "/government/config",
} as const;

/**
 * Toutes les routes de l'application
 */
export const ROUTES = {
  HOME: "/",
  AUTH: AUTH_ROUTES,
  INSTITUTION: INSTITUTION_ROUTES,
  GOVERNMENT: GOVERNMENT_ROUTES,
} as const;

// ============================================================================
// APPLICATION CONFIG
// ============================================================================

export const APP_CONFIG = {
  NAME: "CERTIF-ID",
  COUNTRY: "République du Congo",
  OTP_LENGTH: 6,
  OTP_EXPIRY_MINUTES: 5,
  ITEMS_PER_PAGE: 10,
} as const;

// ============================================================================
// MENTIONS ACADÉMIQUES
// ============================================================================

export const ACADEMIC_MENTIONS = [
  "Passable",
  "Assez Bien",
  "Bien",
  "Très Bien",
  "Excellent",
] as const;

export type AcademicMention = (typeof ACADEMIC_MENTIONS)[number];

// ============================================================================
// STATUTS
// ============================================================================

export const REQUEST_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export const DIPLOMA_STATUS = {
  ACTIVE: "active",
  REVOKED: "revoked",
} as const;

export type RequestStatus = (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];
export type DiplomaStatus = (typeof DIPLOMA_STATUS)[keyof typeof DIPLOMA_STATUS];
