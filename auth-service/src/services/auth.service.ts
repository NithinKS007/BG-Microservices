import { UserEntity } from "../entity/user.entity";
import { JwtService } from "../../../utils/src";
import { UserServiceGrpcClient } from "../grpc/user.client";
import { ValidationError } from "../../../utils/src/error.handling.middleware";

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

  async signup(data: {
    name: string;
    email: string;
    password: string;
    role?: "admin";
  }): Promise<void> {
    const { email, password, name, role } = data;
    if (!email || !password || !name) throw new Error("Email,password and name are required");

    if (role === "admin") {
      throw new ValidationError("Invalid role, Please try again later");
    }
    await this.userServiceGrpcClient.signupUser({
      ...data,
    });
  }

  async signin(data: {
    email: string;
    password: string;
  }): Promise<UserEntity & { accessToken: string; refreshToken: string }> {
    const { email, password } = data;
    if (!email || !password) throw new Error("Email and password are required");
    const res = await this.userServiceGrpcClient.signinUser(data);
    if (!res.success || !res.user) {
      throw new Error("Authentication failed");
    }

    const { id, email: userEmail, role, ...rest } = res.user;

    if (!id || !userEmail || !role) {
      throw new Error("User is not valid, Please try again later");
    }

    const customrole = this.mapRole(role);
    const accessToken = await this.jwtService.createAT({ id, email: userEmail, role: customrole });
    const refreshToken = await this.jwtService.createRT({ id, email: userEmail, role: customrole });

    return {
      id,
      email: userEmail,
      role: customrole,
      ...rest,
      accessToken,
      refreshToken,
    };
  }

  private mapRole(role: unknown): "admin" | "user" {
    // 1. If it's the string "admin" or the gRPC-equivalent number/value
    if (role === "admin" || role === 0) {
      // Check what your gRPC returns (usually 0 or 1)
      return "admin";
    }

    // 2. If it's the string "user" or the gRPC-equivalent number
    if (role === "user" || role === 1) {
      return "user";
    }

    return "user";
  }
}
