import { createContainer, asClass } from "awilix";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { KafkaService } from "../../utils/src";
import { envConfig } from "./config/env.config";

const container = createContainer();
const CLIENT_ID = envConfig.KAFKA_CLIENT_ID;
const GROUP_ID = envConfig.KAFKA_GROUP_ID;
const BROKERS = envConfig.KAFKA_BROKERS?.split(",").map((b) => b.trim());

container.register({
  authService: asClass(AuthService).scoped(),
  authController: asClass(AuthController).scoped(),
  kafkaService: asClass(KafkaService)
    .scoped()
    .inject(() => ({
      brokers: BROKERS,
      clientId: CLIENT_ID,
      groupId: GROUP_ID,
    })),
});

export { container };
