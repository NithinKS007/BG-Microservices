import { GrpcHandler } from "../../../utils/src/index";

import { container } from "../container";
import { UserGrpcController } from "./user.server";
const controller = container.resolve<UserGrpcController>("userGrpcController");

export const handlers: GrpcHandler = {
  signupUser: controller.signupUser.bind(controller),
  signinUser: controller.signinUser.bind(controller),
};
