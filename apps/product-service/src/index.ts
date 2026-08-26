import express, { NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { clerkClient, clerkMiddleware, getAuth } from "@clerk/express";
import ProductsRouter from "./routes/product.routes.js";
import CategoryRouter from "./routes/category.routes.js";

import { Request, Response } from "express";

const app: any = express();

app.use(express.json());
app.use(clerkMiddleware());
dotenv.config();
app.use(
  cors({
    origin: ["http://localhost:3003", "http://localhost:3002"],
    credentials: true,
  }),
);
console.log("index");
app.use("/api/products", ProductsRouter);

app.use("/api/category", CategoryRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  return res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

export default app;
