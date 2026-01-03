const pool = require("../config/database")
const createError = require("http-errors")

class BookingService {
  constructor(bookingRepository) {
    this.bookingRepository = bookingRepository
  }

  async createBooking({ slotId, menteeId, meetingLink }) {
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      const slot = await this.bookingRepository.lockSlot(slotId, client)

      if (!slot) {
        throw createError(404, "Slot not found")
      }

      if (slot.is_booked) {
        throw createError(409, "Slot already booked")
      }

      const booking = await this.bookingRepository.createBooking({ slotId, menteeId, meetingLink }, client)

      await this.bookingRepository.markSlotBooked(slotId, client)

      await client.query("COMMIT")

      return booking
    } catch (err) {
      await client.query("ROLLBACK")
      throw err
    } finally {
      client.release()
    }
  }

  async getBookingsForUser({ userId, role }) {
    if (!userId) {
      throw createError(401, "No user id provided")
    }

    if (role === "mentor") {
      return this.bookingRepository.getBookingsByMentorId(userId)
    }

    if (role === "mentee") {
      return this.bookingRepository.getBookingsByMenteeId(userId)
    }

    throw createError(401, "Role not allowed")
  }

  async cancelBooking({ bookingId, userId, role }) {
    const client = await pool.connect()

    try {
      await client.query("BEGIN")

      const booking = await this.bookingRepository.findBookingById(bookingId, client)

      if (!booking) {
        throw createError(404, "Booking not found")
      }

      const isMentorOwner = role === "mentor" && booking.mentor_id === userId
      const isMenteeOwner = role === "mentee" && booking.mentee_id === userId

      if (!isMentorOwner && !isMenteeOwner) {
        throw createError(403, "Not authorized")
      }

      await this.bookingRepository.updateBookingStatus(bookingId, "cancelled", client)
      await this.bookingRepository.markSlotAsFree(booking.slot_id, client)

      await client.query("COMMIT")

      return { ok: true, status: "cancelled" }
    } catch (err) {
      await client.query("ROLLBACK")
      throw err
    } finally {
      client.release()
    }
  }

  async completeBooking({ bookingId, mentorId }) {
    const booking = await this.bookingRepository.findBookingById(bookingId)

    if (!booking) {
      throw createError(404, "Booking not found")
    }

    if (booking.mentor_id !== mentorId) {
      throw createError(403, "Not authorized")
    }

    return this.bookingRepository.updateBookingStatus(bookingId, "completed")
  }

  async updateMeetingLink({ bookingId, mentorId, meetingLink }) {
    const booking = await this.bookingRepository.findBookingById(bookingId)

    if (!booking) {
      throw createError(404, "Booking not found")
    }

    if (booking.mentor_id !== mentorId) {
      throw createError(403, "Not authorized")
    }

    return this.bookingRepository.updateMeetingLink(bookingId, meetingLink)
  }
}

module.exports = BookingService
