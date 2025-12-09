const { Router } = require("express");

const UserService = require("../services/UserService.js");
const UserRepository = require("../repositories/UserRepository.js");
const UserController = require("../controllers/UserController.js");

const authMiddleware = require("../middlewares/authMiddleware.js");
const roleMiddleware = require("../middlewares/roleMiddleware.js");


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

module.exports = router;
// ciaooo
