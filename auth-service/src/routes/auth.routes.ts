import { Router } from "express";
import { container } from "../container";
import { AuthController } from "./../controllers/auth.controller";
import { asyncHandler } from "../../../utils/src";

const routerV1 = Router();

const authController = container.resolve<AuthController>("authController");

routerV1.post("/v1/signup",asyncHandler(authController.handle.bind(authController)));


export { routerV1 };
