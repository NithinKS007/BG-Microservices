import { createContainer, asClass } from "awilix";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";

const container = createContainer();

container.register({
  authService: asClass(AuthService).scoped(),
  authController: asClass(AuthController).scoped(),
});

export { container };
