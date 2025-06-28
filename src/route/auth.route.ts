import { Hono } from "hono";
import { AuthController } from "../controller/auth.controller";

const auth = new Hono();
const controller = new AuthController();

auth.post("/register", (c) => controller.register(c));
auth.post("/login", (c) => controller.login(c));

export default auth;
