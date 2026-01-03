const pool = require("../config/database")

class BookingRepository {
  constructor(pool) {
    this.pool = pool
  }

  async lockSlot(slotId, client = this.pool) {
    const query = `
      SELECT id, mentor_id, start_time, end_time, is_booked
      FROM availability_slots
      WHERE id = $1
      FOR UPDATE
    `
    const result = await client.query(query, [slotId])
    return result.rows[0] || null
  }

  async createBooking(data, client = this.pool) {
    const { menteeId, slotId, meetingLink } = data

    const mentorResult = await client.query("SELECT mentor_id FROM availability_slots WHERE id = $1", [slotId])
    if (mentorResult.rowCount === 0) return null

    const mentorId = mentorResult.rows[0].mentor_id

    const query = `
      INSERT INTO bookings (slot_id, mentor_id, mentee_id, meeting_link, status)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `
    const values = [slotId, mentorId, menteeId, meetingLink || null, "confirmed"]

    const result = await client.query(query, values)
    return result.rows[0]
  }

  async markSlotBooked(slotId, client = this.pool) {
    const query = `
      UPDATE availability_slots
      SET is_booked = true
      WHERE id = $1
      RETURNING *
    `
    const result = await client.query(query, [slotId])
    return result.rows[0]
  }

  async getBookingsByMenteeId(menteeId) {
    const query = "SELECT * FROM bookings WHERE mentee_id = $1"
    const result = await this.pool.query(query, [menteeId])
    return result.rows
  }

  async getBookingsByMentorId(mentorId) {
    const query = "SELECT * FROM bookings WHERE mentor_id = $1"
    const result = await this.pool.query(query, [mentorId])
    return result.rows
  }

  async findBookingById(bookingId, client = this.pool) {
    const query = "SELECT * FROM bookings WHERE id = $1 FOR UPDATE"
    const result = await client.query(query, [bookingId])
    return result.rows[0] || null
  }

  async updateBookingStatus(bookingId, status, client = this.pool) {
    const query = `
      UPDATE bookings
      SET status = $1
      WHERE id = $2
      RETURNING *
    `
    const result = await client.query(query, [status, bookingId])
    return result.rows[0]
  }

  async updateMeetingLink(bookingId, meetingLink) {
    const query = `
      UPDATE bookings
      SET meeting_link = $1
      WHERE id = $2
      RETURNING *
    `
    const result = await this.pool.query(query, [meetingLink, bookingId])
    return result.rows[0]
  }

  async markSlotAsFree(slotId, client = this.pool) {
    const query = `
      UPDATE availability_slots
      SET is_booked = false
      WHERE id = $1
      RETURNING *
    `
    const result = await client.query(query, [slotId])
    return result.rows[0]
  }
}

module.exports = BookingRepository
