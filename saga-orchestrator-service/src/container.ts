import { createContainer, asClass } from "awilix";
import { envConfig } from "./config/env.config";
import { KafkaService } from "../../utils/src";
const container = createContainer();

const clientId = envConfig.KAFKA_CLIENT_ID;
const groupId = envConfig.KAFKA_GROUP_ID;
const brokers = envConfig.KAFKA_BROKERS?.split(",").map((b) => b.trim());

container.register({
  kafkaService: asClass(KafkaService)
    .scoped()
    .inject(() => ({
      brokers,
      clientId,
      groupId,
    })),
});

export { container };
