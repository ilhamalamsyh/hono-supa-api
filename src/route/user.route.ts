import { Hono } from "hono";
import {
  AuthenticatedContext,
  authMiddleware,
} from "../middleware/auth.middleware";
import { UserController } from "../controller/user.controller";

const user = new Hono();
const controller = new UserController();

// Apply auth middleware to all user routes
user.use("*", authMiddleware);

// Protected endpoint - requires valid JWT token
user.get("/profile", (c) =>
  controller.getProfile(c as unknown as AuthenticatedContext)
);

export default user;
