// api/index.ts
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import { handle } from "hono/vercel";
import auth from "../src/route/auth.route";
import user from "../src/route/user.route";
import { swaggerConfig } from "../src/config/swagger";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Debug endpoint
app.get("/debug", (c) => {
  return c.json({
    message: "Debug endpoint working",
    supabaseUrl: process.env.SUPABASE_URL ? "Set" : "Missing",
    supabaseKey: process.env.SUPABASE_ANON_KEY ? "Set" : "Missing",
    jwtSecret: process.env.JWT_SECRET ? "Set" : "Missing",
    nodeEnv: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Swagger UI
app.get("/docs", swaggerUI({ url: "/api-docs" }));
app.get("/api-docs", (c) => c.json(swaggerConfig));

// Routes
app.route("/auth", auth);
app.route("/user", user);

// Health check
app.get("/", (c) =>
  c.json({
    message: "API is running - Hono JS Chat API yuhuu",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
);

// Error handler
app.onError((err, c) => {
  console.error("Error:", err);
  return c.json(
    {
      error: "Internal Server Error",
      message: err.message,
    },
    500
  );
});

// Export as function for Vercel
export default handle(app);
