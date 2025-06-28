import { Context } from "hono";
import { AuthService } from "../service/auth.service";
import { LoginDTO, RegisterDTO } from "../dto/auth.dto";

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  async register(c: Context) {
    try {
      const body = (await c.req.json()) as RegisterDTO;
      const result = await this.service.register(body);
      return c.json(result, 201);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ message: error.message }, 400);
      }
      return c.json({ message: "Internal server error" }, 500);
    }
  }

  async login(c: Context) {
    try {
      const body = (await c.req.json()) as LoginDTO;
      const result = await this.service.login(body);
      return c.json(result);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ message: error.message }, 400);
      }
      return c.json({ message: "Internal server error" }, 500);
    }
  }
}
