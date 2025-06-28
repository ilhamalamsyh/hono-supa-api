import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

// Manual CORS headers (Vercel compatible)
app.use("*", async (c, next) => {
  // Add CORS headers manually
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (c.req.method === "OPTIONS") {
    return c.text("", 200);
  }

  // Simple logging
  console.log(`${c.req.method} ${c.req.url} - ${new Date().toISOString()}`);

  await next();
});

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

// Simple user profile (without auth middleware for now)
app.get("/user/profile", (c) => {
  return c.json({
    message: "User profile endpoint",
    note: "Auth middleware temporarily disabled",
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
