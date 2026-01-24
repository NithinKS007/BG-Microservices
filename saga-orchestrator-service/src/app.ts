import express, { Request, Response } from "express";
import { notFoundMiddleware, errorMiddleware } from "../../utils/src";
import { envConfig } from "./config/env.config";

const app = express();

app.use(express.json({ limit: "10mb" }));

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", service: envConfig.SERVICE_NAME, port: envConfig.PORT });
});

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
