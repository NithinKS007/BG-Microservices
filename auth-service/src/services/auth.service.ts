import { UserEntity } from "../entity/user.entity";
import { JwtService } from "../../../utils/src";
import { UserServiceGrpcClient } from "../grpc/user.client";

export class AuthService {
  private readonly userServiceGrpcClient: UserServiceGrpcClient;
  private readonly jwtService: JwtService;
  constructor({
    userServiceGrpcClient,
    jwtService,
  }: {
    userServiceGrpcClient: UserServiceGrpcClient;
    jwtService: JwtService;
  }) {
    this.userServiceGrpcClient = userServiceGrpcClient;
    this.jwtService = jwtService;
  }

  async signup(data: { name: string; email: string; password: string }): Promise<void> {
    await this.userServiceGrpcClient.signupUser({
      ...data,
    });
  }

  async signin(data: {
    email: string;
    password: string;
  }): Promise<UserEntity & { accessToken: string; refreshToken: string }> {
    const res = await this.userServiceGrpcClient.signinUser(data);
    if (!res.success || !res.user) {
      throw new Error("Authentication failed");
    }

    const { id, email, role, ...rest } = res.user;

    if (!id || !email || !role) {
      throw new Error("Invalid user data");
    }

    const accessToken = await this.jwtService.createAT({ id, email, role });
    const refreshToken = await this.jwtService.createRT({ id, email, role });

    return {
      id,
      email,
      role,
      ...rest,
      accessToken,
      refreshToken,
    };
  }
}
