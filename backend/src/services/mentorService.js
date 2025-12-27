class MentorService {
  constructor(mentorRepository) {
    this.mentorRepository = mentorRepository
  }

  async listMentors(filters, pagination) {
    const { sector, lang, available, q } = filters
    const { page, limit } = pagination

    if (sector !== undefined) {
      if (!Array.isArray(sector)) {
        const err = new Error("Invalid sector value")
        err.statusCode = 400
        throw err
      }

      sector.forEach(s => {
        if (typeof s !== "string" || s.length > 30) {
          const err = new Error("Invalid sector value")
          err.statusCode = 400
          throw err
        }
      })
    }

    if (lang !== undefined) {
      if (!Array.isArray(lang)) {
        const err = new Error("Invalid language code")
        err.statusCode = 400
        throw err
      }

      lang.forEach(language => {
        if (typeof language !== "string" || language.length !== 2) {
          const err = new Error("Invalid language code")
          err.statusCode = 400
          throw err
        }
      })
    }

    if (available !== undefined && typeof available !== "boolean") {
      const err = new Error("Invalid availability type")
      err.statusCode = 400
      throw err
    }

    if (
      q !== undefined &&
      (typeof q !== "string" || q.length > 50)
    ) {
      const err = new Error("Your search request is either too long or of an invalid type")
      err.statusCode = 400
      throw err
    }

    let safePage = 1
    let safeLimit = 20

    if (Number.isInteger(page) && page > 0) {
      safePage = page
    }

    if (Number.isInteger(limit) && limit >= 1 && limit <= 50) {
      safeLimit = limit
    }

    const offset = (safePage - 1) * safeLimit

    const { items, total } =
      await this.mentorRepository.findMentors(
        { sector, lang, available, q },
        { limit: safeLimit, offset }
      )

    return {
      items,
      meta: {
        page: safePage,
        limit: safeLimit,
        total
      }
    }
  }

  async getMentorById(mentorId) {
    const mentor = await this.mentorRepository.findMentorById(mentorId)
    if (!mentor) {
      const error = new Error("Mentor not found")
      error.statusCode = 404
      throw error
    }
    return mentor
  }

  async getMentorAvailability(mentorId, range) {
    const { from, to } = range

    const mentor = await this.mentorRepository.findMentorById(mentorId)
    if (!mentor) {
      const error = new Error("Mentor not found")
      error.statusCode = 404
      throw error
    }

    const now = new Date()
    const defaultFrom = now
    const defaultTo = new Date(now)
    defaultTo.setDate(defaultTo.getDate() + 7)

    let fromDate = defaultFrom
    let toDate = defaultTo

    if (from) {
      fromDate = new Date(from)
    }

    if (to) {
      toDate = new Date(to)
    }

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      const err = new Error("Invalid date format")
      err.statusCode = 400
      throw err
    }

    if (fromDate >= toDate) {
      const err = new Error("'from' must be before 'to'")
      err.statusCode = 400
      throw err
    }

    const availability =
      await this.mentorRepository.findMentorAvailability(
        mentorId,
        { fromDate, toDate }
      )

    return availability
  }

  async updateMentorProfile(mentorId, profileData) {
    const mentor = await this.mentorRepository.findMentorById(mentorId)
    if (!mentor) {
      const error = new Error("Mentor not found")
      error.statusCode = 404
      throw error
    }

    const {
      id,
      user_id,
      rating_avg,
      rating_count,
      updated_at,
      ...safeUpdate
    } = profileData

    const { bio, sectors, languages, meeting_link_template } = safeUpdate

    if (bio !== undefined) {
      if (typeof bio !== "string") {
        const err = new Error("Bio must be a string")
        err.statusCode = 400
        throw err
      }

      if (bio.length > 1000) {
        const err = new Error("Bio too long")
        err.statusCode = 400
        throw err
      }
    }

    if (sectors !== undefined) {
      if (!Array.isArray(sectors)) {
        const err = new Error("Sectors must be an array")
        err.statusCode = 400
        throw err
      }

      for (const sector of sectors) {
        if (typeof sector !== "string") {
          const err = new Error("Each sector must be a string")
          err.statusCode = 400
          throw err
        }
      }
    }

    if (languages !== undefined) {
      if (!Array.isArray(languages)) {
        const err = new Error("Languages must be an array")
        err.statusCode = 400
        throw err
      }

      for (const lang of languages) {
        if (typeof lang !== "string") {
          const err = new Error("Each language must be a string")
          err.statusCode = 400
          throw err
        }

        if (lang.length !== 2) {
          const err = new Error("Each language must be 2 characters long")
          err.statusCode = 400
          throw err
        }
      }
    }

    if (meeting_link_template !== undefined) {
      if (typeof meeting_link_template !== "string") {
        const err = new Error("Meeting link must be a string")
        err.statusCode = 400
        throw err
      }

      if (meeting_link_template.length > 100) {
        const err = new Error("Meeting link too long")
        err.statusCode = 400
        throw err
      }
    }

    const updatedProfile =
      await this.mentorRepository.putMentorProfile(
        mentorId,
        safeUpdate
      )

    return updatedProfile
  }

  async createMentorAvailability(mentorId, slots) {
    const mentor = await this.mentorRepository.findMentorById(mentorId)
    if (!mentor) {
      const error = new Error("Mentor not found")
      error.statusCode = 404
      throw error
    }

    if (!slots) {
      const error = new Error("Slots not provided")
      error.statusCode = 400
      throw error
    }

    if (!Array.isArray(slots)) {
      const err = new Error("Slots must be an array")
      err.statusCode = 400
      throw err
    }

    for (const slot of slots) {
      const { start_time, end_time } = slot

      if (!start_time || !end_time) {
        const err = new Error("Slot must include start_time and end_time")
        err.statusCode = 400
        throw err
      }

      const fromDate = new Date(start_time)
      const toDate = new Date(end_time)

      if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
        const err = new Error("Invalid date format")
        err.statusCode = 400
        throw err
      }

      if (fromDate >= toDate) {
        const err = new Error("start_time must be before end_time")
        err.statusCode = 400
        throw err
      }

      const now = new Date()

      if (fromDate.getTime() < now.getTime()) {
        const err = new Error("start_time cannot be in the past")
        err.statusCode = 400
        throw err
      }
    }
  }
}

module.exports = MentorService
