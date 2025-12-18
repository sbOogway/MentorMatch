const { Router } = require("express");

const authMiddleware = require("../middlewares/authMiddleware.js");
const roleMiddleware = require("../middlewares/roleMiddleware.js");

const router = Router();

// GET /api/mentors

router.get(
  "/",
  mentorController.listMentors
)

// GET /api/mentors/:id/availability

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
  roleMiddleware(["mentor"]),
  mentorController.updateMentorProfile
)

// POST /api/mentors/availability

router.post(
  "/availability",
  authMiddleware,
  roleMiddleware(["mentor"]),
  mentorController.updateMentorAvailability
)

module.exports = router;
