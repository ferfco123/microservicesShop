import fastify from "fastify";
import { clerkClient, clerkPlugin, getAuth } from "@clerk/fastify";
import cors from "@fastify/cors";
import { shouldBeUser } from "./Middleweare/AuthMiddleweare.js";
import orderRoutes from "./routes/routes.orders.js";

const appFastify = fastify({ logger: true });
await appFastify.register(cors, {
  origin: ["http://localhost:3003", "http://localhost:3002"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
});
appFastify.register(clerkPlugin);
appFastify.register(
  orderRoutes,

  { prefix: "/api/orders" },
);

export default appFastify;
