import { Request, Response } from "express";
import { sendResponse, StatusCodes } from "../../../utils/src";
import { validateDto } from "../../../utils/src";
import { AuthService } from "services/auth.service";
import { SigninRequestDto, SignupRequestDto } from "../dtos/auth.dto";

export class AuthController {
  private readonly authService: AuthService;
  constructor({ authService }: { authService: AuthService }) {
    this.authService = authService;
  }

  async signup(req: Request, res: Response): Promise<void> {
    const data = await validateDto(SignupRequestDto, req.body);
    await this.authService.signup(data);
    sendResponse(res, StatusCodes.Created, null, "User created successfully");
  }

  async signin(req: Request, res: Response): Promise<void> {
    const data = await validateDto(SigninRequestDto, req.body);
    const result = await this.authService.signin(data);
    const { name, accessToken, refreshToken } = result;
    sendResponse(res, StatusCodes.OK, { name, accessToken, refreshToken }, "Login successfully");
  }
}
