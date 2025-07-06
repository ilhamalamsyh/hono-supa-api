import { Hono } from "hono";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import auth from "./route/auth.route";
import user from "./route/user.route";
import { testSupabaseConnection } from "./config/supabase";
import { swaggerConfig } from "./config/swagger";
import { env } from "./config/env";
import { readFileSync } from "fs";
import { join } from "path";

const app = new Hono();

// Manual CORS middleware compatible with Vercel Edge Runtime
app.use("*", async (c, next) => {
  // Add CORS headers
  const origin = c.req.header("Origin");
  const allowedOrigins = env.ALLOWED_ORIGINS;

  // Debug logging
  console.log("🔍 CORS Debug:");
  console.log("  Origin:", origin);
  console.log("  Allowed Origins:", allowedOrigins);
  console.log("  Request Method:", c.req.method);
  console.log("  Request URL:", c.req.url);

  // Always set CORS headers for now (temporary fix)
  if (origin) {
    c.header("Access-Control-Allow-Origin", origin);
    console.log("  ✅ CORS header set to origin:", origin);
  } else {
    c.header("Access-Control-Allow-Origin", "*");
    console.log("  ✅ CORS header set to *");
  }

  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );
  c.header("Access-Control-Allow-Credentials", "true");
  c.header("Access-Control-Max-Age", "86400");

  // Handle preflight requests
  if (c.req.method === "OPTIONS") {
    console.log("  📋 Preflight request handled");
    return new Response(null, { status: 204 });
  }

  await next();
});

// Simple logging middleware
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  console.log(`${c.req.method} ${c.req.url} - ${end - start}ms`);
});

// Swagger UI
app.get("/docs", swaggerUI({ url: "/api-docs" }));
app.get("/api-docs", (c) => c.json(swaggerConfig));

// API routes with /api prefix
const api = new Hono();
api.route("/auth", auth);
api.route("/user", user);

// Mount API routes under /api
app.route("/api", api);

// Serve landing page
app.get("/", async (c) => {
  try {
    const htmlPath = join(process.cwd(), "public", "index.html");
    const html = readFileSync(htmlPath, "utf-8");
    return c.html(html);
  } catch (error) {
    return c.json({ message: "API is running - Hono JS Chat API yuhuu" });
  }
});

// Health check
app.get("/health", (c) =>
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
