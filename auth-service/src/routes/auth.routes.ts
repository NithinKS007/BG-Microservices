import { Router } from "express";
import { container } from "../container";
import { AuthController } from "./../controllers/auth.controller";
import { asyncHandler } from "../../../utils/src";

const router = Router();

const authController = container.resolve<AuthController>("authController");

router.post("/signup", asyncHandler(authController.handle.bind(authController)));
router.post("/sign-in", asyncHandler(authController.handle.bind(authController)));
router.put("/reset-password", asyncHandler(authController.handle.bind(authController)));

export { router };
