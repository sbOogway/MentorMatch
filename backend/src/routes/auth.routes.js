const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const ProfileController = require("../controllers/ProfileController")
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// GET /api/auth/me  
router.get("/me",ProfileController.getLoggedInUserProfile);

// PUT /api/auth/me
router.put("/me",ProfileController.updateLoggedInUserProfile);

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
 *     summary: Register a new user (mentor or mentee)
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
 *                 example: StrongPass123
 *               role:
 *                 type: string
 *                 enum: [mentor, mentee]
 *                 example: mentor
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "User registered successfully"
 *               user:
 *                 id: 1
 *                 full_name: "Mario Rossi"
 *                 email: "mario@example.com"
 *                 role: "mentor"
 *                 created_at: "2025-01-01T12:00:00Z"
 *               token: "jwt.token.here"
 *
 *       400:
 *         description: Invalid input (bad email, weak password, missing fields)
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid email format"
 *
 *       403:
 *         description: Invalid role (only mentor or mentee allowed)
 *         content:
 *           application/json:
 *             example:
 *               error: "Only 'mentor' or 'mentee' role are allowed during registration"
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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user (mentor, mentee or admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: mario@example.com
 *               password:
 *                 type: string
 *                 example: StrongPass123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: "Login successful"
 *               user:
 *                 id: 1
 *                 full_name: "Mario Rossi"
 *                 email: "mario@example.com"
 *                 role: "admin"
 *                 created_at: "2025-01-01T12:00:00Z"
 *               token: "jwt.token.here"
 *
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             example:
 *               error: "Email and password required"
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *
 *       401:
 *         description: Invalid password
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid password"
 *
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               id: "550e8400-e29b-41d4-a716-446655440000"
 *               full_name: "Sara Verdi"
 *               email: "sara@example.com"
 *               role: "mentor"
 *               created_at: "2025-12-03T14:00:00Z"
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/auth/me:
 *   put:
 *     summary: Update logged-in user's profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
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
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Profilo aggiornato con successo."
 *               data:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 full_name: "Updated Name"
 *                 email: "updated@example.com"
 *                 role: "mentor"
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
