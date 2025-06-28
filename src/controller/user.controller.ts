import { AuthenticatedContext } from "../middleware/auth.middleware";
import { UserService } from "../service/user.service";

export class UserController {
  private service: UserService;

  constructor() {
    this.service = new UserService();
  }

  async getProfile(c: AuthenticatedContext) {
    try {
      const userId = c.user.id;
      const user = await this.service.getUserById(userId);

      if (!user) {
        return c.json({ message: "User not found" }, 404);
      }

      return c.json({
        message: "Profile retrieved successfully",
        user: this.excludePassword(user),
      });
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ message: error.message }, 400);
      }
      return c.json({ message: "Internal server error" }, 500);
    }
  }

  private excludePassword(user: any): any {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
