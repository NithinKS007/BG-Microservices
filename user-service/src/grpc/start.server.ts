import { startGrpcServer } from "../../../utils/src/index";
import { UserServiceService } from "../../../utils/src/index";
import { handlers } from "./handler";

export const startUserGrpcServer = () => {
  startGrpcServer(UserServiceService, handlers, "50051");
};
