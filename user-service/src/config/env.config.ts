import dotenv from "dotenv";

dotenv.config();
interface Env {
  PORT: number;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: number;
  POSTGRES_DB: string;
  SERVICE_NAME: string;
  DATABASE_URL: string;
  KAFKA_BROKERS: string;
  KAFKA_CLIENT_ID: string;
  KAFKA_GROUP_ID: string;
  KAFKA_ENABLED: string;
}

export const envConfig: Env = {
  PORT: Number(process.env.PORT) || 3000,
  SERVICE_NAME: process.env.SERVICE_NAME || "user-service",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://postgres:postgres@localhost:5432/postgres",
  POSTGRES_USER: process.env.POSTGRES_USER || "postgres",
  POSTGRES_PASSWORD: Number(process.env.POSTGRES_PASSWORD) || 5432,
  POSTGRES_DB: process.env.POSTGRES_DB || "postgres",
  KAFKA_BROKERS: process.env.KAFKA_BROKERS || "localhost:9092",
  KAFKA_CLIENT_ID: process.env.KAFKA_CLIENT_ID || "user-service",
  KAFKA_GROUP_ID: process.env.KAFKA_GROUP_ID || "user-service-group",
  KAFKA_ENABLED: process.env.KAFKA_ENABLED || "false",
};
