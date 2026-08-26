import express from "express";
import {
  createCategory,
  deleteCatgorie,
  getCatgories,
  updateCatgories,
} from "../Controllers/category.controller.js";
import { shouldBeAdmin } from "../Middleweare/AuthMiddleweare.js";

const routes: express.Router = express.Router();

routes.post("/", shouldBeAdmin, createCategory);
routes.put("/:id", shouldBeAdmin, updateCatgories);
routes.get("/", getCatgories);
routes.delete("/:id", shouldBeAdmin, deleteCatgorie);

export default routes;
