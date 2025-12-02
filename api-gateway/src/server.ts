import { logger } from "../../utils/src";
import { app } from "./app";
import { envConfig } from "./config/env.config";

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  try {
    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

const startServer = () => {
  try {
    app.listen(envConfig.PORT, () => {
      logger.info(
        `Server is running on port ${envConfig.PORT} with service name "${envConfig.SERVICE_NAME}"`
      );
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(`Error starting server [ERROR] ${err.message}`);
    } else {
      logger.error(`Error starting server [ERROR] ${JSON.stringify(err)}`);
    }
    process.exit(1);
  }
};

startServer();
