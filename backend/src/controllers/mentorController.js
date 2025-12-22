class mentorController {
    constructor(mentorService) {
        this.mentorService = mentorService;

        this.listMentors = this.listMentors.bind(this);
        this.getMentorAvailability = this.getMentorAvailability.bind(this);
        this.getMentorById = this.getMentorById.bind(this);
        this.updateMentorProfile = this.updateMentorProfile.bind(this);
        this.updateMentorAvailability = this.updateMentorAvailability.bind(this);
    }

    async listMentors(req, res, next){
        try {
            const result = await this.mentorService.listMentors(req.query)
            res.status(201).json(result)
        } catch (error) {
            next(error)
            
        }
    }
    async getMentorAvailability(req, res, next){
        try {
            const { id } = req.params
            const {from, to} = req.query

            const slots = await this.mentorService.getMentorAvailability(
                id,
                {from , to}
            )
            res.status(201).json(slots)
        } catch (error) {
            next(error)
        }
    }
    async getMentorById(req, res, next){
        try {
            const {id} = req.params
            const mentor = await this.mentorService.getMentorById(id)
            res.status(201).json(mentor)
        } catch (error) {
            next(error)
        }
    }
    async updateMentorProfile(req, res, next) {
        try {
          const mentorId = req.user.id; 
          const profileData = req.body;
    
          const updatedProfile =
            await this.mentorService.updateMentorProfile(
              mentorId,
              profileData
            );
    
          res.status(200).json(updatedProfile);
        } catch (err) {
          next(err);
        }
      }
    
      async updateMentorAvailability(req, res, next) {
        try {
          const mentorId = req.user.id;
          const { slots } = req.body;
    
          const created =
            await this.mentorService.createMentorAvailability(
              mentorId,
              slots
            );
    
          res.status(201).json({ created });
        } catch (err) {
          next(err);
        }
      }
}
    
module.exports = MentorController;