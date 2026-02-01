import { KafkaService, logger } from "../../utils/src";
import { app } from "./app";
import { envConfig } from "./config/env.config";
import { container } from "./container";

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  try {
    /** Close database connection */
    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during graceful shutdown:", error);
    process.exit(1);
  }
};

// Handle process signals for graceful shutdown
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("💥 Uncaught Exception:", error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("💥 Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

const startServer = async () => {
  try {
    console.log("🚀 Starting POS Backend Server...!");

    const server = app.listen(envConfig.PORT, () => {
      logger.info(
        `Server is running on port ${envConfig.PORT} with service name "${envConfig.SERVICE_NAME}"`,
      );
    });

    /** Connect producer and consumer */
    const kafkaService = container.resolve<KafkaService>("kafkaService");

    if (envConfig.KAFKA_ENABLED === "true") {
      await kafkaService.connectProducer();
      await kafkaService.connectConsumer();
    }

    server.on("error", (error: NodeJS.ErrnoException) => {
      if (error.code === "EADDRINUSE") {
        console.error(`❌ Port ${envConfig.PORT} is already in use`);
      } else {
        console.error("❌ Server error:", error);
      }
      process.exit(1);
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      logger.error(err.message);
    } else {
      logger.error(`Unknown error starting server [ERROR] ${JSON.stringify(err)}`);
    }

    process.exit(1);
  }
};

startServer();
