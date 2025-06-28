import { Context, Next } from "hono";
import { verify } from "hono/jwt";

export interface AuthenticatedContext extends Context {
  user: {
    id: string;
    email: string;
  };
}

export const authMiddleware = async (
  c: Context,
  next: Next
): Promise<Response | void> => {
  try {
    const authHeader = c.req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return c.json(
        {
          message: "Unauthorized - No token provided",
          error: "MISSING_TOKEN",
        },
        401
      );
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    try {
      const payload = await verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      );

      // Add user information to context
      (c as AuthenticatedContext).user = {
        id: payload.id as string,
        email: payload.email as string,
      };

      await next();
    } catch (jwtError) {
      return c.json(
        {
          message: "Unauthorized - Invalid token",
          error: "INVALID_TOKEN",
        },
        401
      );
    }
  } catch (error) {
    return c.json(
      {
        message: "Unauthorized - Authentication failed",
        error: "AUTH_FAILED",
      },
      401
    );
  }
};
