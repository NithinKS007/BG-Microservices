import { Request, Response } from "express";
import { sendResponse } from "../../../utils/src";
import { AuthService } from "services/auth.service";

export class AuthController {
  private readonly authService: AuthService;
  constructor({ authService }: { authService: AuthService }) {
    this.authService = authService;
  }

  async signup(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const result = await this.authService.signup(data);
    sendResponse(res, 201, result, "User created successfully");
  }

  async signin(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const result = await this.authService.signin(data);
    sendResponse(res, 201, result, "User created successfully");
  }
}
