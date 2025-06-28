const { Hono } = require("hono");

const app = new Hono();

// Simple health check
app.get("/", (c) => {
  return c.json({
    message: "API is running - JS version",
    timestamp: new Date().toISOString(),
    status: "ok",
  });
});

// Simple debug endpoint
app.get("/debug", (c) => {
  return c.json({
    message: "Debug working - JS version",
    env: {
      supabaseUrl: process.env.SUPABASE_URL ? "Set" : "Missing",
      supabaseKey: process.env.SUPABASE_ANON_KEY ? "Set" : "Missing",
      jwtSecret: process.env.JWT_SECRET ? "Set" : "Missing",
    },
  });
});

module.exports = app;
