import { UserService } from "services/user.service";
import { sendResponse } from "../../../utils/src";
import { Request, Response } from "express";

export class UserController {
  private readonly userService: UserService;
  constructor({ userService }: { userService: UserService }) {
    this.userService = userService;
  }

  async findUserById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await this.userService.findUserById(id);
    sendResponse(res, 200, result, "User found successfully");
  }
}
