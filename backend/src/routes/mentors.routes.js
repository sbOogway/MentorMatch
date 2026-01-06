const { Router } = require("express")
const router = Router()

const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const MentorController = require("../controllers/mentorController")
const MentorService = require("../services/mentorService")
const MentorRepository = require("../repositories/mentorRepository")

const mentorRepository = new MentorRepository()
const mentorService = new MentorService(mentorRepository)
const mentorController = new MentorController(mentorService)

// GET /api/mentors
router.get(
  "/",
  mentorController.listMentors
)

//GET /api/mentors/me/availability (MENTOR LOGGATO)
router.get(
  "/me/availability",
  authMiddleware,
  roleMiddleware("mentor"),
  mentorController.getMyAvailability
)

// GET /api/mentors/:id/availability (PUBBLICO)
router.get(
  "/:id/availability",
  mentorController.getMentorAvailability
)

// GET /api/mentors/:id
router.get(
  "/:id",
  mentorController.getMentorById
)

// POST /api/mentors/profile
router.post(
  "/profile",
  authMiddleware,
  roleMiddleware("mentor"),
  mentorController.updateMentorProfile
)

// POST /api/mentors/availability
router.post(
  "/availability",
  authMiddleware,
  roleMiddleware("mentor"),
  mentorController.updateMentorAvailability
)

module.exports = router



/**
 * @swagger
 * tags:
 *   name: Mentors
 *   description: Mentor related endpoints
 */

/**
 * @swagger
 * /api/mentors:
 *   get:
 *     summary: List mentors
 *     tags: [Mentors]
 *     parameters:
 *       - in: query
 *         name: sector
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: lang
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of mentors
 *       400:
 *         description: Invalid parameters
 */

/**
 * @swagger
 * /api/mentors/{id}:
 *   get:
 *     summary: Get mentor by ID
 *     tags: [Mentors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Mentor found
 *       404:
 *         description: Mentor not found
 */

/**
 * @swagger
 * /api/mentors/{id}/availability:
 *   get:
 *     summary: Get mentor availability
 *     tags: [Mentors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: to
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: Availability slots
 */

/**
 * @swagger
 * /api/mentors/profile:
 *   post:
 *     summary: Update mentor profile
 *     tags: [Mentors]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               sectors:
 *                 type: array
 *                 items:
 *                   type: string
 *               languages:
 *                 type: array
 *                 items:
 *                   type: string
 *               meeting_link_template:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/mentors/availability:
 *   post:
 *     summary: Create mentor availability slots
 *     tags: [Mentors]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slots:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     start_time:
 *                       type: string
 *                       format: date-time
 *                     end_time:
 *                       type: string
 *                       format: date-time
 *     responses:
 *       201:
 *         description: Slots created
 *       400:
 *         description: Invalid times
 *       409:
 *         description: Slot overlap
 */

