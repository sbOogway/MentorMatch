class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService

    this.createReview = this.createReview.bind(this)
    this.getMentorReviews = this.getMentorReviews.bind(this)
  }

  async createReview(req, res, next) {
    try {
      const review = await this.reviewService.createReview(req.user, req.body)
      res.status(201).json(review)
    } catch (err) {
      next(err)
    }
  }

  async getMentorReviews(req, res, next) {
    try {
      const data = await this.reviewService.getReviewsByMentor(req.params.mentor_id)
      res.json(data)
    } catch (err) {
      next(err)
    }
  }
}

module.exports = ReviewController
