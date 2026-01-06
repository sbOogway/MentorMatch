class ReviewService {
  constructor(reviewRepository, pool) {
    this.reviewRepository = reviewRepository
    this.pool = pool
  }

  async createReview(user, { booking_id, rating, comment }) {
    if (user.role !== "mentee") {
      throw this._error("Not authorized", 403)
    }

    if (rating < 1 || rating > 5) {
      throw this._error("Rating fuori range", 400)
    }

    const booking = await this.reviewRepository.getBookingById(booking_id)

    if (!booking) {
      throw this._error("Booking not found", 404)
    }

    if (booking.status !== "completed" || booking.mentee_id !== user.id) {
      throw this._error("Not authorized / booking not completed", 403)
    }

    const client = await this.pool.connect()

    try {
      await client.query("BEGIN")

      const review = await this.reviewRepository.insertReview(client, {
        bookingId: booking_id,
        mentorId: booking.mentor_id,
        menteeId: user.id,
        rating,
        comment
      })

      await this.reviewRepository.updateMentorRating(client, booking.mentor_id)

      await client.query("COMMIT")
      return review
    } catch (err) {
      await client.query("ROLLBACK")

     

      throw err
    } finally {
      client.release()
    }
  }

  async getReviewsByMentor(mentorId) {
    const [items, stats] = await Promise.all([
      this.reviewRepository.getReviewsByMentor(mentorId),
      this.reviewRepository.getMentorRatingStats(mentorId)
    ])

    return {
      rating_avg: stats?.rating_avg ?? 0,
      rating_count: stats?.rating_count ?? 0,
      items
    }
  }

  _error(message, statusCode) {
    const err = new Error(message)
    err.statusCode = statusCode
    return err
  }
}

module.exports = ReviewService

