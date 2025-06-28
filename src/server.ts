import { serve } from "@hono/node-server";
import app from "./index";

const port = 8080;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running at http://localhost:${info.port}`);
  }
);
