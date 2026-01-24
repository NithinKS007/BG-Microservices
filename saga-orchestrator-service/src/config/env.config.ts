import "dotenv/config";

interface Env {
  PORT: number;
  SERVICE_NAME: string;
  KAFKA_BROKERS: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_GROUP_ID: string;
  KAFKA_ENABLED: string;
}

export const envConfig: Env = {
  PORT: Number(process.env.PORT) || 3004,
  SERVICE_NAME: process.env.SERVICE_NAME || "saga-orchestrator-service",
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || "kafka:9092",
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || "saga-orchestrator-service",
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || "saga-orchestrator-service-group",
  KAFKA_ENABLED: process.env.KAFKA_ENABLED || "true",
};
