// src/services/logger.ts
export const logEvent = (event: string, data?: any) => {
  console.log(`[${new Date().toISOString()}] ${event}:`, data);
};