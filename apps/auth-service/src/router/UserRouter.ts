import express from "express";
import {
  createUser,
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from "src/controllers/UserControllers.js";
import { shouldBeUser } from "src/middleweare/authMiddleweare.js";

const route: express.Router = express.Router();

route.get("/", shouldBeUser, getUsers);
route.get("/:id", shouldBeUser, getUser);
route.post("/bulk-delete", shouldBeUser, deleteUser);
route.post("/", shouldBeUser, createUser);
route.patch("/:id", shouldBeUser, updateUser);

export default route;
