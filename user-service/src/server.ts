import { logger } from "../../utils/src";
import { app } from "./app";
import { envConfig } from "./config/env.config";
import { closePrisma, connectPrisma } from "./utils/dbconfig";
import { IMessageService } from "./interface/interface";
import { container } from "./container";

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  try {
    // Close database connection
    await closePrisma();

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

// const messageService = container.resolve<IMessageService>("messageService");
// if (envConfig.KAFKA_ENABLED === "true") {
//   messageService
//     .connectProducer()
//     .then(() => console.log("✅ Producer connected."))
//     .catch((err) => console.error("❌ Producer error:", err));

//   messageService
//     .connectConsumer()
//     .then(() => console.log("✅ Consumer connected."))
//     .catch((err) => console.error("❌ Consumer error:", err));
// }

const startServer = async () => {
  try {
    console.log("🚀 Starting POS Backend Server...!");

    // Connect to Database
    const databaseConnected = await connectPrisma();

    if (!databaseConnected) {
      console.error("❌ Failed to connect to database. Exiting...");
      process.exit(1);
    }

    app.listen(envConfig.PORT, () => {
      logger.info(
        `Server is running on port ${envConfig.PORT} with service name "${envConfig.SERVICE_NAME}"`
      );
    });

    app.on("error", (error: any) => {
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
