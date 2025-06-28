import { supabase } from "../config/supabase";
import { User } from "../models/user.model";
import { LoginDTO, RegisterDTO } from "../dto/auth.dto";

export class AuthRepository {
  async register(data: RegisterDTO): Promise<User> {
    try {
      console.log("Attempting to register user:", data.email);

      const { data: user, error } = await supabase
        .from("users")
        .insert([data])
        .select()
        .single();

      if (error) {
        console.error("Registration error:", error);
        throw new Error(`Registration failed: ${error.message}`);
      }

      console.log("User registered successfully:", user.id);
      return user;
    } catch (error) {
      console.error("Repository register error:", error);
      throw error;
    }
  }

  async login(data: LoginDTO): Promise<User | null> {
    try {
      console.log("Attempting to login user:", data.email);

      const { data: user, error } = await supabase
        .from("users")
        .select()
        .eq("email", data.email)
        .single();

      if (error) {
        console.error("Login error:", error);
        if (error.code === "PGRST116") {
          return null; // User not found
        }
        throw new Error(`Login failed: ${error.message}`);
      }

      console.log("User found for login:", user.id);
      return user;
    } catch (error) {
      console.error("Repository login error:", error);
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // User not found
        }
        console.error("Find by email error:", error);
        throw error;
      }

      return user;
    } catch (error) {
      console.error("Repository findByEmail error:", error);
      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    try {
      const { data: user, error } = await supabase
        .from("users")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return null; // User not found
        }
        console.error("Find by ID error:", error);
        throw error;
      }

      return user;
    } catch (error) {
      console.error("Repository findById error:", error);
      throw error;
    }
  }
}
