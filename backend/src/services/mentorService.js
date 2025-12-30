class MentorService {
  constructor(mentorRepository) {
    this.mentorRepository = mentorRepository
  }

  async listMentors(filters, pagination = {}) {
    const { sector, lang, available, q } = filters || {}
    const page =
      Number.isInteger(pagination.page) && pagination.page > 0
        ? pagination.page
        : 1

    const limit =
      Number.isInteger(pagination.limit) &&
      pagination.limit >= 1 &&
      pagination.limit <= 50
        ? pagination.limit
        : 20

    if (sector !== undefined && !Array.isArray(sector)) {
      throw this._badRequest("Invalid sector filter")
    }

    if (lang !== undefined && !Array.isArray(lang)) {
      throw this._badRequest("Invalid language filter")
    }

    if (available !== undefined && typeof available !== "boolean") {
      throw this._badRequest("Invalid availability filter")
    }

    if (q !== undefined && (typeof q !== "string" || q.length > 50)) {
      throw this._badRequest("Invalid search query")
    }

    const offset = (page - 1) * limit

    const { items, total } =
      await this.mentorRepository.findMentors(
        { sector, lang, available, q },
        { limit, offset }
      )

    return {
      items,
      meta: { page, limit, total }
    }
  }

  async getMentorById(id) {
    const mentor = await this.mentorRepository.findMentorById(id)

    if (!mentor) {
      const err = new Error("Mentor not found")
      err.statusCode = 404
      throw err
    }

    return mentor
  }

  async getMentorAvailability(mentorId, range) {
    const mentor =
      await this.mentorRepository.findMentorById(mentorId)

    if (!mentor) {
      const err = new Error("Mentor not found")
      err.statusCode = 404
      throw err
    }

    const now = new Date()
    const fromDate = range.from ? new Date(range.from) : now
    const toDate = range.to
      ? new Date(range.to)
      : new Date(now.getTime() + 7 * 86400000)

    if (
      isNaN(fromDate.getTime()) || isNaN(toDate.getTime()) || fromDate >= toDate) {
      throw this._badRequest("Invalid date range")
    }

    return this.mentorRepository.findMentorAvailability(
      mentorId,
      { fromDate, toDate }
    )
  }

   
  async updateMentorProfile(mentorId, fields) {
    const mentor = await this.mentorRepository.findMentorById(mentorId)
    
    if (!mentor) {
      const err = new Error("Mentor not found")
      err.statusCode = 404
      throw err
    }
  
    const updated = await this.mentorRepository.updateMentorProfile(mentorId, fields)
    return updated
  }
  
  async createMentorAvailability(mentorId, slots) {
    const mentor = await this.mentorRepository.findMentorById(mentorId)
    
    if (!mentor) {
      const err = new Error("Mentor not found")
      err.statusCode = 404
      throw err
    }
  
    return await this.mentorRepository.createMentorAvailability(mentorId, slots)
  }

  _badRequest(message) {
    const err = new Error(message)
    err.statusCode = 400
    return err
  }
}

module.exports = MentorService

