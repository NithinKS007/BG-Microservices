import { sendResponse, logger, RateLimiter } from "../../utils/src";
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
  }),
);
const limit = new RateLimiter();
app.use(limit.apiGatewayLimiter());
app.use(morgan("dev"));

/**
 * Health check endpoint.
 * Used by load balancers or monitoring services to verify gateway is alive.
 */
app.get("/health", (req: Request, res: Response) => {
  sendResponse(res, 200, null, "OK");
});

/**
 * Sets up proxy routes for underlying microservices.
 * All requests to configured paths are forwarded to their respective services.
 */

proxyServices(app);

/**
 * Handles all requests that do not match any route or proxy.
 * Must be placed after all routes.
 */
app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found [WARN] ${req.method} ${req.url}`);
  sendResponse(res, 404, null, "Not found");
});

/**
 * Catches all unhandled errors from routes or middleware.
 * Must be the last middleware in the stack.
 */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error [ERROR] ${err.message}`);
  sendResponse(res, 500, null, "Internal server error");
});

export { app };
