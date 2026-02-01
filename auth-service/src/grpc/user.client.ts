import { envConfig } from "../config/env.config";
import {
  createGrpcClient,
  fromGrpcError,
  SigninUserRequest,
  SigninUserResponse,
} from "../../../utils/src";
import { UserServiceClient, SignupUserRequest, SignupUserResponse } from "../../../utils/src";

export class UserServiceGrpcClient {
  private client = createGrpcClient(UserServiceClient,envConfig.USER_SERVICE_URL_GRPC || "user:50051");

  signupUser(data: SignupUserRequest): Promise<SignupUserResponse> {
    return new Promise((resolve, reject) => {
      this.client.signupUser(data, (err, res) => {
        if (err) return reject(fromGrpcError(err));
        resolve(res);
      });
    });
  }

  signinUser(data: SigninUserRequest): Promise<SigninUserResponse> {
    return new Promise((resolve, reject) => {
      this.client.signinUser(data, (err, res) => {
        if (err) return reject(fromGrpcError(err));
        resolve(res);
      });
    });
  }
}
