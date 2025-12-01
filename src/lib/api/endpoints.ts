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
} as const;
