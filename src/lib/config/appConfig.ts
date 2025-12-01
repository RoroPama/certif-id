export const appConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
    timeout: 30000,
  },

  app: {
    name: "Certif-ID",
    environment: process.env.NODE_ENV || "development",
  },
} as const;
