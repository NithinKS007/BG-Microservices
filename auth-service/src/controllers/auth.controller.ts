import { Request, Response } from "express";
import { IAuthService, IBaseController } from "../interfaces/interfaces";
import { sendResponse } from "../../../utils/src";

export class AuthController implements IBaseController {
  constructor(private readonly authService: IAuthService) {}

  async handle(req: Request, res: Response): Promise<void> {
    const data = req.body;
    const result = await this.authService.signUp(data);
    sendResponse(res, 201, result, "User created successfully");
  }
}
