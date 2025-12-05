import { sendResponse, logger, rateLimiter } from "../../utils/src";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { proxyServices } from "./config/service.proxy";
import { envConfig } from "./config/env.config";

const app = express();

// Security & core middleware
app.use(helmet());
app.use(
  cors({
    origin: envConfig.CLIENT_URL || "*",
    credentials: true,
  })
);
app.use(rateLimiter);
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check - must be before 404 and error handlers
app.get("/health", (req: Request, res: Response) => {
  sendResponse(res, 200, null, "OK");
});

// Proxy routes to underlying services
proxyServices(app);

// 404 handler - after all routes/proxies
app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found [WARN] ${req.method} ${req.url}`);
  sendResponse(res, 404, null, "Not found");
});

// Global error handler - must be last
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error [ERROR] ${err.message}`);
  sendResponse(res, 500, null, "Internal server error");
});

export { app };
