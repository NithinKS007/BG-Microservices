import { createContainer, asClass } from "awilix";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { KafkaService, JwtService } from "../../utils/src";
import { envConfig } from "./config/env.config";
import { UserServiceGrpcClient } from "./grpc/user.client";

const container = createContainer();
const clientId = envConfig.KAFKA_CLIENT_ID;
const groupId = envConfig.KAFKA_GROUP_ID;
const brokers = envConfig.KAFKA_BROKERS?.split(",").map((b) => b.trim());

const accessSecret = envConfig.JWT_ACCESS_TOKEN_SECRET;
const refreshSecret = envConfig.JWT_REFRESH_TOKEN_SECRET;
const accessExpiration = envConfig.JWT_ACCESS_TOKEN_EXPIRATION;
const refreshExpiration = envConfig.JWT_REFRESH_TOKEN_EXPIRATION;

container.register({
  authService: asClass(AuthService).scoped(),
  authController: asClass(AuthController).scoped(),
  kafkaService: asClass(KafkaService)
    .scoped()
    .inject(() => ({
      brokers,
      clientId,
      groupId,
    })),
  jwtService: asClass(JwtService)
    .scoped()
    .inject(() => ({
      accessSecret,
      refreshSecret,
      accessExpiration,
      refreshExpiration,
    })),
  userServiceGrpcClient: asClass(UserServiceGrpcClient).scoped(),
});

export { container };
