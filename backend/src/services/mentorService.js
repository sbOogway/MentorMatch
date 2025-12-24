class MentorService {
    constructor(mentorRepository) {
      this.mentorRepository = mentorRepository;
    
    }
  
    // LIST mentors with filters + pagination
    async listMentors(filters, pagination) {

      // Goals:
      // - validate filters (sector, lang, available, q)
      // - apply defaults (page, limit)
      // - query repository
      // - return { items, meta }
        
            const {sector, lang, available, q} = filters
            const {page, limit} = pagination



            if (sector) {
                sector.forEach(s => {
                    if (typeof s !== "string" || s.length > 30) {
                    const err = new Error("Invalid sector value");
                    err.statusCode = 400;
                    throw err;
                    }
                });
            }

            // check per filtro lingua
            if(lang){
                lang.forEach(language => {
                    if (
                    typeof language !== "string" ||
                    language.length !== 2
                    ) {
                    const err = new Error("Invalid language code");
                    err.statusCode = 400;
                    throw err;
                    }
                })
            }

            if(available !== undefined && typeof available !== "boolean"){
                const err = new Error("Invalid availability type");
                err.statusCode = 400;
                throw err;
            }

            if(q !== undefined && typeof q !== "string"|| q.length > 50){
                const err = new Error("Your search request is either too long or of an invalid type");
                err.statusCode = 400;
                throw err;
            }

            let safePage = 1;
            let safeLimit = 20;

            if (Number.isInteger(page) && page > 0) {
            safePage = page;
            }

            if (Number.isInteger(limit) && limit >= 1 && limit <= 50) {
            safeLimit = limit;
            }

            

            const { items, total } =
            await this.mentorRepository.findMentors(
            {
                sector,
                lang,
                available,
                q
            },
            {
                limit: safeLimit,
                offset
            }
            );

       

            return {
                items,
                meta: {
                page: safePage,
                limit: safeLimit,
                total
                }
            };
}

              
        
        
      

    }
  
    // GET mentor by ID
    async getMentorById(mentorId) {
      // Goals:
      // - check mentor exists
      // - throw 404 if not
      // - return mentor profile
    }
  
    // GET mentor availability
    async getMentorAvailability(mentorId, range) {
      // Goals:
      // - validate mentor exists
      // - parse from/to dates
      // - apply default range (next 7 days)
      // - return availability slots
    }
  
    // UPDATE mentor profile
    async updateMentorProfile(mentorId, profileData) {
      // Goals:
      // - validate mentor exists
      // - validate allowed fields
      // - update profile
      // - return updated profile
    }
  
    // CREATE mentor availability slots
    async createMentorAvailability(mentorId, slots) {
      // Goals:
      // - validate mentor exists
      // - validate slots format
      // - enforce duration rules
      // - detect overlaps
      // - insert slots
      // - return created slots
    }
  }
  
  module.exports = MentorService;
  