import { Hono } from "hono";
import { handle } from "hono/vercel";
import { swaggerUI } from "@hono/swagger-ui";
import auth from "../src/route/auth.route";
import user from "../src/route/user.route";
import { swaggerConfig } from "../src/config/swagger";
import { env } from "../src/config/env";

export const runtime = "edge";

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

// Health check
app.get("/", (c) =>
  c.json({ message: "API is running - Hono JS Chat API yuhuu" })
);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
