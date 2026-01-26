import { createContainer, asClass } from "awilix";
import { JwtService } from "../../utils/src";
import { envConfig } from "./config/env.config";

const container = createContainer();

const accessSecret = envConfig.JWT_ACCESS_TOKEN_SECRET;
const refreshSecret = envConfig.JWT_REFRESH_TOKEN_SECRET;
const accessExpiration = envConfig.JWT_ACCESS_TOKEN_EXPIRATION;
const refreshExpiration = envConfig.JWT_REFRESH_TOKEN_EXPIRATION;

container.register({
  jwtService: asClass(JwtService)
    .scoped()
    .inject(() => ({
      accessSecret,
      refreshSecret,
      accessExpiration,
      refreshExpiration,
    })),
});

export { container };
