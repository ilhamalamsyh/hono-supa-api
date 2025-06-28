import { AuthRepository } from "../repository/auth.repository";
import { LoginDTO, RegisterDTO, AuthResponse } from "../dto/auth.dto";
import { User } from "../models/user.model";
import { sign } from "hono/jwt";
import { compare, hash } from "bcrypt";

export class AuthService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    const existingUser = await this.repository.findByEmail(data.email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await hash(data.password, 10);
    const user = await this.repository.register({
      ...data,
      password: hashedPassword,
    });

    const token = await this.generateToken(user);
    return {
      token,
      user: this.excludePassword(user),
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await this.repository.login(data);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await compare(data.password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = await this.generateToken(user);
    return {
      token,
      user: this.excludePassword(user),
    };
  }

  private async generateToken(user: User): Promise<string> {
    return await sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "your-secret-key"
    );
  }

  private excludePassword(user: User): Omit<User, "password"> {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
