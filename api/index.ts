// api/index.ts
import app from "../src/index";
import { handle } from "hono/vercel";

// Export as Edge Function handlers
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

// Export for Vercel Edge Function
export default app;
