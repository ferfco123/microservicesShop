import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProduct,
  updateProduct,
} from "../Controllers/product.controller.js";

import { shouldBeAdmin } from "../Middleweare/AuthMiddleweare.js";
console.log("archivo de rutas");

const routes: express.Router = express.Router();

routes.post("/", shouldBeAdmin, createProduct);

routes.get("/", getAllProducts);
routes.get("/singleProduct/:id", getProduct);
routes.put("/:id", shouldBeAdmin, updateProduct);
routes.delete("/", shouldBeAdmin, deleteProduct);

export default routes;
