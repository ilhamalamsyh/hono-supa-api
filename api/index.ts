import { Hono } from "hono";
import { handle } from "hono/vercel";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono();

// Middleware
app.use("*", logger());
app.use("*", cors());

// Routes
app.get("/", (c) => {
  return c.json({
    message: "Hello Hono!",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/hello", (c) => {
  return c.json({
    message: "Hello from API!",
    timestamp: new Date().toISOString(),
  });
});

// Export for Vercel
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export default handle(app);
