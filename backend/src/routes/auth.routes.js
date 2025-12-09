const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication endpoints
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user (mentor, mentee or admin)
 *     tags: [Auth]
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
 *                 example: Mario Rossi
 *               email:
 *                 type: string
 *                 example: mario@example.com
 *               password:
 *                 type: string
 *                 example: StrongPassword123!
 *               role:
 *                 type: string
 *                 enum: [mentor, mentee, admin]
 *                 example: mentee
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User registered successfully"
 *               user:
 *                 id: 12
 *                 full_name: "Mario Rossi"
 *                 email: "mario@example.com"
 *                 role: "mentee"
 *                 created_at: "2025-01-01T12:00:00Z"
 *               token: "jwt.token.here"
 *
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             example:
 *               error: "Missing required fields"
 *
 *       403:
 *         description: Invalid role provided
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid role — allowed roles: mentor, mentee, admin"
 *
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             example:
 *               error: "Email already exists"
 *
 *       500:
 *         description: Internal server error
 */
