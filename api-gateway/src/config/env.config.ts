interface Env {
  PORT: number;
  SERVICE_NAME: string;
  DEFAULT_TIMEOUT:number
  AUTH_SERVICE_URL: string;
  USER_SERVICE_URL: string;
  BLOG_SERVICE_URL: string;
}

export const envConfig: Env = {
  PORT: Number(process.env.PORT) || 3000,
  SERVICE_NAME: process.env.SERVICE_NAME || "api-gateway",
  DEFAULT_TIMEOUT: Number(process.env.DEFAULT_TIMEOUT) || 5000,
  AUTH_SERVICE_URL:process.env.AUTH_SERVICE_URL || "http://localhost:3001",
  USER_SERVICE_URL:process.env.USER_SERVICE_URL || "http://localhost:3002",   
  BLOG_SERVICE_URL:process.env.BLOG_SERVICE_URL || "http://localhost:3003",
};
