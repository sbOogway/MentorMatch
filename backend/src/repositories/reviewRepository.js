class ReviewRepository {
  constructor(pool) {
    this.pool = pool
  }

  async getBookingById(bookingId) {
    const { rows } = await this.pool.query(
      `
      SELECT id, mentor_id, mentee_id, status
      FROM bookings
      WHERE id = $1
      `,
      [bookingId]
    )
    return rows[0]
  }

  async insertReview(client, { bookingId, mentorId, menteeId, rating, comment }) {
    const { rows } = await client.query(
      `
      INSERT INTO reviews (booking_id, mentor_id, mentee_id, rating, comment)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id, rating
      `,
      [bookingId, mentorId, menteeId, rating, comment]
    )
    return rows[0]
  }

  async updateMentorRating(client, mentorId) {
    await client.query(
      `
      UPDATE mentor_profiles
      SET
        rating_count = rating_count + 1,
        rating_avg = (
          SELECT ROUND(AVG(rating)::numeric, 2)
          FROM reviews
          WHERE mentor_id = $1
        ),
        updated_at = NOW()
      WHERE id = $1
      `,
      [mentorId]
    )
  }

  async getReviewsByMentor(mentorId) {
    const { rows } = await this.pool.query(
      `
      SELECT
        r.id,
        r.rating,
        r.comment,
        r.created_at,
        u.full_name AS mentee_name
      FROM reviews r
      JOIN users u ON u.id = r.mentee_id
      WHERE r.mentor_id = $1
      ORDER BY r.created_at DESC
      `,
      [mentorId]
    )
    return rows
  }

  async getMentorRatingStats(mentorId) {
    const { rows } = await this.pool.query(
      `
      SELECT rating_avg, rating_count
      FROM mentor_profiles
      WHERE id = $1
      `,
      [mentorId]
    )
    return rows[0]
  }
}

module.exports = ReviewRepository
