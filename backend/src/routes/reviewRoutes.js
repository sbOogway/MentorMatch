const { Router } = require("express")
const router = Router()

const authMiddleware = require("../middlewares/authMiddleware")
const roleMiddleware = require("../middlewares/roleMiddleware")

const ReviewController = require("../controllers/reviewController")
const ReviewService = require("../services/reviewService")
const ReviewRepository = require("../repositories/reviewRepository")

const reviewRepository = new ReviewRepository()
const reviewService = new ReviewService(reviewRepository)
const reviewController = new ReviewController(reviewService)


 //POST /api/reviews

router.post(
  "/",
  authMiddleware,
  roleMiddleware("mentee"),
  reviewController.createReview
)


//GET /api/reviews/mentor/:mentor_id

router.get(
  "/mentor/:mentor_id",
  reviewController.getMentorReviews
)

module.exports = router
