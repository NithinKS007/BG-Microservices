import { Router } from "express";

const router = Router();

router.get("/users/:id");
router.put("/users/:id");
router.delete("/users/:id");
router.get("/users");



export { router };
