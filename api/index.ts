import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { swaggerUI } from "@hono/swagger-ui";
import auth from "../src/route/auth.route";
import user from "../src/route/user.route";
import { swaggerConfig } from "../src/config/swagger";
import { env } from "../src/config/env";

export const runtime = "edge";

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

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
