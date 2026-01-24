import { Request, Response } from "express";

export interface IBaseController {
  handle(request: Request, response: Response): Promise<void>;
}

export interface IAuthService {
  signUp(data: { name: string; email: string; password: string }): Promise<void>;
}
