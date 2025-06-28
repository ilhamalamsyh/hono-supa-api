import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

// Simple health check
app.get("/", (c) => {
  return c.json({
    message: "Hono API is running on Vercel!",
    timestamp: new Date().toISOString(),
    status: "ok",
  });
});

// Debug endpoint
app.get("/debug", (c) => {
  return c.json({
    message: "Debug working with Hono",
    env: {
      supabaseUrl: process.env.SUPABASE_URL ? "Set" : "Missing",
      supabaseKey: process.env.SUPABASE_ANON_KEY ? "Set" : "Missing",
      jwtSecret: process.env.JWT_SECRET ? "Set" : "Missing",
    },
  });
});

// Export for Vercel
export default handle(app);
