import { createContainer, asClass } from "awilix";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { JwtService } from "./services/jwt.service";
import { KafkaService } from "./services/kafka.service";

const container = createContainer();

container.register({
  jwtService: asClass(JwtService).scoped(),
  messageService: asClass(KafkaService).scoped(),
  authService: asClass(AuthService).scoped(),
  authController: asClass(AuthController).scoped(),
});

export { container };
