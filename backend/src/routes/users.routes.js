import { Router } from "express";
import UserService from "../services/UserService.js";
import UserRepository from "../repositories/UserRepository.js";
import UserController from "../controllers/UserController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = Router();


const userService = new UserService(UserRepository);
const userController = new UserController(userService);


router.use(authMiddleware);

// GET /users (admin only)
router.get(
  "/",
  roleMiddleware(["admin"]),
  userController.getAllUsers
);

// GET /users/:id (admin only)
router.get(
  "/:id",
  roleMiddleware(["admin"]),
  userController.getUserById
);

// POST /users (admin only)
router.post(
  "/",
  roleMiddleware(["admin"]),
  userController.createUser
);

// PUT /users/:id (admin only)
router.put(
  "/:id",
  roleMiddleware(["admin"]),
  userController.updateUser
);

// DELETE /users/:id (admin only)
router.delete(
  "/:id",
  roleMiddleware(["admin"]),
  userController.deleteUser
);

export default router;
