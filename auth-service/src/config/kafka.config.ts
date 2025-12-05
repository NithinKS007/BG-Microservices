import { Kafka } from "kafkajs";
import { envConfig } from "./env.config";

const CLIENT_ID = envConfig.KAFKA_CLIENT_ID;
const GROUP_ID = envConfig.KAFKA_GROUP_ID;
const BROKERS = envConfig.KAFKA_BROKERS?.split(",").map((b) => b.trim());

if (!BROKERS) {
  throw new Error("Kafka brokers are required (KAFKA_BROKERS in .env).");
}

if (!CLIENT_ID) {
  throw new Error("Kafka client ID is required (KAFKA_CLIENT_ID in .env).");
}

if (!GROUP_ID) {
  throw new Error("Kafka group ID is required (KAFKA_GROUP_ID in .env).");
}

const kafkaConnect = new Kafka({
  clientId: CLIENT_ID,
  brokers: BROKERS,
});

export { kafkaConnect, CLIENT_ID, GROUP_ID, BROKERS };
