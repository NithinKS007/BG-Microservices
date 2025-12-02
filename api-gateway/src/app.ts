import dotenv from "dotenv";
import { sendResponse, logger, rateLimiter } from "../../utils/src";
import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { proxyServices } from "./config/service.proxy";
dotenv.config();
const app = express();

app.use(helmet());
app.use(cors());
app.use(rateLimiter);
//Request Logging
app.use(morgan("dev"));

//404 handler
app.use((req: Request, res: Response) => {
  logger.warn(`Resource not found [WARN] ${req.method} ${req.url}`);
  sendResponse(res, 404, null, "Not found");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error [ERROR] ${err.message}`);
  sendResponse(res, 500, null, "Internal server error");
});
//health check
app.get("/health", (req: Request, res: Response) => {
  sendResponse(res, 200, null, "OK");
});

proxyServices(app);

export { app };
