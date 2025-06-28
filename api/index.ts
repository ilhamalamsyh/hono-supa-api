import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

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

// Simple user profile (without any middleware)
app.get("/user/profile", (c) => {
  return c.json({
    message: "User profile endpoint",
    timestamp: new Date().toISOString(),
  });
});

// Handle favicon.ico
app.get("/favicon.ico", (c) => {
  return new Response("", { status: 204 });
});

// Export for Vercel
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export default handle(app);
