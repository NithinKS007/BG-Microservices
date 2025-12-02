import { createContainer, asClass } from "awilix";
import { UserService } from "./services/user.service";
import { UserRepository } from "./repositories/user.repository";
import { KafkaService } from "./services/kafka.service";
const container = createContainer();

container.register({
  userService: asClass(UserService).scoped(),
  userRepository: asClass(UserRepository).scoped(),
  messageService: asClass(KafkaService).scoped(),
});

export { container };