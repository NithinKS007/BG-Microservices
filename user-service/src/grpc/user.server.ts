import { UserService } from "../services/user.service";
import { toGrpcError, SigninUserRequest, SigninUserResponse } from "../../../utils/src/index";
import { ServerUnaryCall, SendUnaryData } from "../../../utils/src/index";
import { SignupUserRequest, SignupUserResponse } from "../../../utils/src/index";

export class UserGrpcController {
  private readonly userService: UserService;
  constructor({ userService }: { userService: UserService }) {
    this.userService = userService;
  }

  signup(
    call: ServerUnaryCall<SignupUserRequest, SignupUserResponse>,
    callback: SendUnaryData<SignupUserResponse>,
  ): void {
    const { email, password, name } = call.request;
    this.userService
      .signup({
        email,
        password,
        name,
      })
      .then(() => callback(null, { success: true, message: "User created successfully" }))
      .catch((err) => callback(toGrpcError(err), null));
  }

  signin(
    call: ServerUnaryCall<SigninUserRequest, SigninUserResponse>,
    callback: SendUnaryData<SigninUserResponse>,
  ) {
    const { email, password } = call.request;
    this.userService
      .signin({ email, password })
      .then((user) =>
        callback(null, { success: true, message: "User signed in successfully", user }),
      )
      .catch((err) => callback(toGrpcError(err), null));
  }
}
