export const appConfig = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
    timeout: 30000,
  },

  app: {
    name: "Certif-ID",
    environment: process.env.NODE_ENV || "development",
  },
} as const;
