const { Router } = require("express");

const UserService = require("../services/userService.js");
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
  roleMiddleware("admin"),
  userController.getAllUsers
);

// GET /users/:id (admin only)
router.get(
  "/:id",
  roleMiddleware("admin"),
  userController.getUserById
);

// POST /users (admin only)
router.post(
  "/",
  roleMiddleware("admin"),
  userController.createUser
);

// PUT /users/:id (admin only)
router.put(
  "/:id",
  roleMiddleware("admin"),
  userController.updateUser
);

// DELETE /users/:id (admin only)
router.delete(
  "/:id",
  roleMiddleware("admin"),
  userController.deleteUser
);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management endpoints (admin only)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             example:
 *               users:
 *                 - id: "550e8400-e29b-41d4-a716-446655440000"
 *                   full_name: "Mario Rossi"
 *                   email: "mario@example.com"
 *                   role: "mentor"
 *                 - id: "550e8400-e29b-41d4-a716-446655440111"
 *                   full_name: "Luca Bianchi"
 *                   email: "luca@example.com"
 *                   role: "mentee"
 *       403:
 *         description: Forbidden — only admin can access
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID (UUID)
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               full_name: "Sara Verdi"
 *               email: "sara@example.com"
 *               role: "mentor"
 *       403:
 *         description: Forbidden — only admin can access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [mentor, mentee, admin]
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User created successfully"
 *               user:
 *                 id: "550e8400-e29b-41d4-a716-446655440333"
 *                 full_name: "Giovanni Neri"
 *                 email: "giovanni@example.com"
 *                 role: "mentor"
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Forbidden — only admin can access
 *       409:
 *         description: Email already exists
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID (UUID)
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [mentor, mentee, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User updated successfully"
 *               user:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 full_name: "Updated Name"
 *                 email: "updated@example.com"
 *                 role: "mentor"
 *       400:
 *         description: Invalid data
 *       403:
 *         description: Forbidden — only admin can access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user (admin only)
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: User ID (UUID)
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       403:
 *         description: Forbidden — only admin can access
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
