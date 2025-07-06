import { Hono } from "hono";
import { handle } from "hono/vercel";
import { swaggerUI } from "@hono/swagger-ui";
import auth from "../src/route/auth.route";
import user from "../src/route/user.route";
import { swaggerConfig } from "../src/config/swagger";
import { env } from "../src/config/env";

export const runtime = "edge";

const app = new Hono();

// ✅ CORS Middleware
app.use("*", async (c, next) => {
  const requestOrigin = c.req.header("Origin");
  const allowedOrigins = env.ALLOWED_ORIGINS;

  const isAllowed =
    allowedOrigins.includes("*") ||
    allowedOrigins.includes(requestOrigin ?? "");

  if (isAllowed && requestOrigin) {
    c.header("Access-Control-Allow-Origin", requestOrigin);
  }

  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With, Accept"
  );
  c.header("Access-Control-Allow-Credentials", "true");

  if (c.req.method === "OPTIONS") {
    return c.text(""); // ✅ Tangani preflight
  }

  await next();
});

// Logging middleware (opsional)
app.use("*", async (c, next) => {
  const start = Date.now();
  await next();
  const end = Date.now();
  console.log(`${c.req.method} ${c.req.url} - ${end - start}ms`);
});

// Swagger
app.get("/docs", swaggerUI({ url: "/api-docs" }));
app.get("/api-docs", (c) => c.json(swaggerConfig));

// API Routes
const api = new Hono();
api.route("/auth", auth);
api.route("/user", user);
app.route("/api", api);

// Health check
app.get("/", (c) =>
  c.json({ message: "API is running - Hono JS Chat API yuhuu" })
);

// ✅ Exports untuk semua method HTTP
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const OPTIONS = handle(app); // ⬅️ Tambahkan ini
