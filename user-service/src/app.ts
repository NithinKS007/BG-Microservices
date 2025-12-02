import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { routerV1 } from "./routes/user.routes";
import { notFoundMiddleware, errorMiddleware } from "../../utils/src";
import { envConfig } from "./config/env.config";

dotenv.config();
const app = express();

app.use(express.json({ limit: "10mb" }));
app.get("/", (req: Request, res: Response) => {
  res.json({ status: "ok", service: envConfig.SERVICE_NAME, port: envConfig.PORT });
});
app.use("/api/users", routerV1);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export { app };
