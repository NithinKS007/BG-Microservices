import { createContainer, asClass, asValue } from "awilix";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/user.repository";
import { KafkaService } from "../../utils/src/kafka.service";
import { UserController } from "./controllers/user.controller";
import { envConfig } from "./config/env.config";
import { prisma } from "./utils/dbconfig";

const container = createContainer();
const CLIENT_ID = envConfig.KAFKA_CLIENT_ID;
const GROUP_ID = envConfig.KAFKA_GROUP_ID;
const BROKERS = envConfig.KAFKA_BROKERS?.split(",").map((b) => b.trim());

container.register({
  prisma: asValue(prisma),
});

container.register({
  userService: asClass(UserService).scoped(),
  userRepository: asClass(UserRepository).scoped(),
  kafkaService: asClass(KafkaService)
    .scoped()
    .inject(() => ({
      brokers: BROKERS,
      clientId: CLIENT_ID,
      groupId: GROUP_ID,
    })),
  userController: asClass(UserController).scoped(),
});

export { container };
