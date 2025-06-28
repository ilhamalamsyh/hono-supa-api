import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { handle } from "hono/vercel";
import auth from "../src/route/auth.route";
import user from "../src/route/user.route";
import { swaggerConfig } from "../src/config/swagger";
import {
  env,
  validateEnv,
  isProduction,
  isDevelopment,
} from "../src/config/env";

// Validate environment on startup
validateEnv();

const app = new Hono();

// Middleware
app.use("*", logger());
app.use(
  "*",
  cors({
    origin: env.ALLOWED_ORIGINS,
    credentials: true,
  })
);

// Health check with environment status
app.get("/", (c) => {
  return c.json({
    message: "Hono API is running on Vercel!",
    timestamp: new Date().toISOString(),
    status: "ok",
    environment: env.NODE_ENV,
    version: "1.0.0",
    envStatus: {
      supabase: env.SUPABASE_URL ? "configured" : "missing",
      jwt: env.JWT_SECRET ? "configured" : "missing",
    },
  });
});

// Debug endpoint (only in development)
app.get("/debug", (c) => {
  if (isProduction) {
    return c.json({ error: "Debug endpoint not available in production" }, 404);
  }

  return c.json({
    message: "Debug working with Hono",
    env: {
      supabaseUrl: env.SUPABASE_URL ? "Set" : "Missing",
      supabaseKey: env.SUPABASE_ANON_KEY ? "Set" : "Missing",
      jwtSecret: env.JWT_SECRET ? "Set" : "Missing",
    },
    environment: env.NODE_ENV,
  });
});

// API Documentation
app.get("/docs", swaggerUI({ url: "/api-docs" }));
app.get("/api-docs", (c) => c.json(swaggerConfig));

// API Routes
app.route("/auth", auth);
app.route("/user", user);

// 404 handler with helpful information
app.notFound((c) => {
  return c.json(
    {
      error: "Not Found",
      message: "Endpoint not found",
      availableEndpoints: [
        "GET /",
        "GET /debug (dev only)",
        "GET /docs",
        "GET /api-docs",
        "POST /auth/register",
        "POST /auth/login",
        "GET /user/profile",
      ],
      documentation: "/docs",
    },
    404
  );
});

// Global error handler
app.onError((err, c) => {
  console.error("Error:", err);

  return c.json(
    {
      error: "Internal Server Error",
      message: isProduction ? "Something went wrong" : err.message,
      ...(isProduction ? {} : { stack: err.stack }),
    },
    500
  );
});

// Export for Vercel
export default handle(app);
