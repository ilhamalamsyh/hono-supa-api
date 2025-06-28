import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

app.get("/", (c) => {
  return c.json({
    message: "Test endpoint - Fast response",
    timestamp: new Date().toISOString(),
    coldStart: true,
  });
});

export default handle(app);
