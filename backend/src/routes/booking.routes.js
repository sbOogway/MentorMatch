const { Router } = require("express");
const router = Router();

const pool = require("../config/database")

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const BookingController = require("../controllers/bookingController");
const BookingService = require("../services/bookingService");
const BookingRepository = require("../repositories/bookingRepository");

const bookingRepository = new BookingRepository(pool);
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);


// POST /api/booking

router.post(
  "/",
  authMiddleware,
  roleMiddleware("mentee"),
  bookingController.createBooking
);

// GET /api/booking/my

router.get(
  "/my",
  authMiddleware,
  bookingController.getMyBookings
);

// POST /api/booking/:id/cancel

router.post(
  "/:id/cancel",
  authMiddleware,
  bookingController.cancelBooking
);

// POST /api/booking/:id/complete

router.post(
  "/:id/complete",
  authMiddleware,
  roleMiddleware("mentor"),
  bookingController.completeBooking
);

// PATCH /api/booking/:id/meeting-link

router.patch(
  "/:id/meeting-link",
  authMiddleware,
  roleMiddleware("mentor"
  ),
  bookingController.updateMeetingLink
);

module.exports = router;



/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking management endpoints
 */

/**
 * @swagger
 * /api/booking:
 *   post:
 *     summary: Create a booking
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - slot_id
 *             properties:
 *               slot_id:
 *                 type: string
 *                 format: uuid
 *               meeting_link:
 *                 type: string
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: User role not allowed
 *       404:
 *         description: Slot not found
 *       409:
 *         description: Slot already booked
 *       422:
 *         description: Slot out of allowed range
 */

/**
 * @swagger
 * /api/booking/my:
 *   get:
 *     summary: Get bookings of the logged-in user
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   start_time:
 *                     type: string
 *                     format: date-time
 *                   end_time:
 *                     type: string
 *                     format: date-time
 *                   status:
 *                     type: string
 *                   meeting_link:
 *                     type: string
 */

/**
 * @swagger
 * /api/booking/{id}/cancel:
 *   post:
 *     summary: Cancel a booking
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/booking/{id}/complete:
 *   post:
 *     summary: Mark booking as completed
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Booking completed
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/booking/{id}/meeting-link:
 *   patch:
 *     summary: Update booking meeting link (mentor only)
 *     tags: [Booking]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             required:
 *               - meeting_link
 *             properties:
 *               meeting_link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Meeting link updated
 *       403:
 *         description: Not allowed
 *       404:
 *         description: Booking not found
 */
