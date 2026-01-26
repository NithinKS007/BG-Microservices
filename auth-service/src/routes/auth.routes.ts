import { Router } from "express";
import { container } from "../container";
import { AuthController } from "./../controllers/auth.controller";
import { asyncHandler } from "../../../utils/src";

const router = Router();

const authController = container.resolve<AuthController>("authController");

router.post("/signup", asyncHandler(authController.signup.bind(authController)));
router.post("/sign-in", asyncHandler(authController.signin.bind(authController)));

export { router };
