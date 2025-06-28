import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import auth from "./route/auth.route";
import user from "./route/user.route";
import { testSupabaseConnection } from "./config/supabase";
import { swaggerConfig } from "./config/swagger";
import { env } from "./config/env";

const app = new Hono();

// CORS configuration
const corsOptions = {
  origin: env.ALLOWED_ORIGINS,
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  maxAge: 86400, // 24 hours
};

// Middleware
app.use("*", logger());
app.use("*", cors(corsOptions));

// Swagger UI
app.get("/docs", swaggerUI({ url: "/api-docs" }));
app.get("/api-docs", (c) => c.json(swaggerConfig));

// API routes with /api prefix
const api = new Hono();
api.route("/auth", auth);
api.route("/user", user);

// Mount API routes under /api
app.route("/api", api);

// Health check
app.get("/", (c) =>
  c.json({ message: "API is running - Hono JS Chat API yuhuu" })
);

// Test Supabase connection on startup (only in development)
if (process.env.NODE_ENV !== "production") {
  testSupabaseConnection().then((isConnected) => {
    if (!isConnected) {
      console.error(
        "Failed to connect to Supabase. Server may not work properly."
      );
    } else {
      console.log("Successfully connected to Supabase");
    }
  });
}

export default app;
