class MentorController {
  constructor(mentorService) {
    this.mentorService = mentorService

    this.listMentors = this.listMentors.bind(this)
    this.getMentorById = this.getMentorById.bind(this)
    this.getMentorAvailability = this.getMentorAvailability.bind(this)
    this.updateMentorProfile = this.updateMentorProfile.bind(this)
    this.updateMentorAvailability = this.updateMentorAvailability.bind(this)
    this.getMyAvailability = this.getMyAvailability.bind(this)
  }

  async listMentors(req, res, next) {
    try {
      const filters = {
        sector: req.query.sector
          ? [].concat(req.query.sector)
          : undefined,
        lang: req.query.lang
          ? [].concat(req.query.lang)
          : undefined,
        available:
          req.query.available === undefined
            ? undefined
            : req.query.available === "true",
        q: req.query.q
      }

      const pagination = {
        page: Number(req.query.page),
        limit: Number(req.query.limit)
      }

      const result =
        await this.mentorService.listMentors(filters, pagination)

      res.json(result)
    } catch (err) {
      next(err)
    }
  }

  async getMentorById(req, res, next) {
    try {
      
      const mentor =
        await this.mentorService.getMentorById(req.params.id)
      res.json(mentor)
    } catch (err) {
      next(err)
    }
  }

  async getMentorAvailability(req, res, next) {
    try {
      const mentorId = req.params.id
       if (!mentorId || mentorId === "null") {
           return res.status(400).json({ error: "mentorId required" });
         }

      const slots =
        await this.mentorService.getMentorAvailability(
          req.params.id,
          { from: req.query.from, to: req.query.to }
        )
        

      res.json(slots)
    } catch (err) {
      next(err)
    }
  }

  async updateMentorProfile(req, res, next) {
    try {
      const updated =
        await this.mentorService.updateMentorProfile(
          req.user.id,
          req.body
        )

      res.json(updated)
    } catch (err) {
      next(err)
    }
  }

  async updateMentorAvailability(req, res, next) {
    try {
      const created =
        await this.mentorService.createMentorAvailability(
          req.user.id,
          req.body.slots
        )

      res.status(201).json({ created })
    } catch (err) {
      next(err)
    }
  }

  async getMyAvailability(req, res, next) {
    try {
      const mentorId = req.user.id
  
      const slots =
        await this.mentorService.getMentorAvailability(
          mentorId,
          { from: req.query.from, to: req.query.to }
        )
  
      res.json(slots)
    } catch (err) {
      next(err)
    }
  }
  

}

module.exports = MentorController
