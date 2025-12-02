import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { Request, Response } from "express";
import { container } from "./container";

import { routerV1 } from "./routes/auth.routes";
import { notFoundMiddleware, errorMiddleware, rateLimiter } from "../../utils/src";
import { IMessageService } from "interfaces/interfaces";

dotenv.config();

const app = express();
const allowedOrigins = process.env.CLIENT_ORIGINS;

app.use(helmet());
app.use("/api", rateLimiter);
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);
app.get("/", (req: Request, res: Response) => {
  res.json({ message: `message send from server ${process.env.PORT}` });
});

app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use("/api", routerV1);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const messageService = container.resolve<IMessageService>("messageService");
messageService
  .connectProducer()
  .then(() => console.log("Producer connected."))
  .catch((err: Error) => console.error(err));
messageService
  .connectConsumer()
  .then(() => console.log("Consumer connected."))
  .catch((err: Error) => console.error(err));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});
