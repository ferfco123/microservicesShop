import { clerkMiddleware } from "@hono/clerk-auth";
import { Hono } from "hono";
import "dotenv/config";

import sessionRoute from "./routes/sessions.routes.js";
import { cors } from "hono/cors";
import webHooksRoutes from "./routes/webhooks.js";

const app = new Hono();

app.use("*", clerkMiddleware());
app.use("*", cors());

app.route("/session", sessionRoute);
app.route("/webhooks", webHooksRoutes);

export default app;
