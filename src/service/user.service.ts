import { AuthRepository } from "../repository/auth.repository";
import { User } from "../models/user.model";

export class UserService {
  private repository: AuthRepository;

  constructor() {
    this.repository = new AuthRepository();
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.repository.findById(id);
  }
}
