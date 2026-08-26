import dotenv from "dotenv";
dotenv.config();
import express, { NextFunction } from "express";
import cors from "cors";
import { clerkMiddleware, createClerkClient } from "@clerk/express";
import UserRouter from "./router/UserRouter.js";
import { Request, Response } from "express";

const app: any = express();
console.log(
  "SECRET KEY CARGADA:",
  process.env.CLERK_SECRET_KEY ? "SÍ (Existe)" : "NO (Es undefined)",
);
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3003", "http://localhost:3002"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

app.use(
  clerkMiddleware({
    secretKey: process.env.CLERK_SECRET_KEY,
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
  }),
);

app.use("/api/users", UserRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

export default app;
