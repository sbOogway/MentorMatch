const pool = require("../config/database");

class MentorRepository {
    constructor(db) {
      this.db = db
    }
  
    async findMentorById(mentorId) {
      // query mentor table by primary key
      // return mentor object if found
      // return null if not found

      const query = "SELECT * FROM mentor_profiles WHERE user_id = $1";
      const values = [mentorId];

      const result = await pool.query(query, values);

      return result.rows[0] || null;
    }
  
    async findMentors(filters, pagination) {
      // filters:
      // - sector: array of strings
      // - lang: array of language codes
      // - available: boolean
      // - q: search string
     
      // pagination:
      // - limit
      // - offset
  
      // build base query for mentors
      // conditionally apply filters
      // apply limit and offset
      // execute query to get items
      // execute separate count query for total
  
      // return { items, total }
      const {sector, lang, available, q} = filters
      const {limit, offset} = pagination

      const query = `SELECT * FROM mentor_profiles 
                    JOIN users ON mentor_profiles.user_id = users.id 
                    WHERE `
      const values = []

        // sector filter
    // sector filter
      if (sector && Array.isArray(sector) && sector.length > 0) {
            values.push(sector);
            query += ` AND sectors && $${values.length}`;
        }
      if(lang && Array.isArray(lang) && lang.length > 0){
            values.push(lang);
            query += ` AND lang && $${values.length}`;
      }
      if (available === true) {
       
        query += `
          AND EXISTS (
            SELECT 1
            FROM mentor_availability ma
            WHERE ma.mentor_id = mentor_profiles.user_id
            AND ma.start_time >= NOW()
          )
        `
      }
      if(q){
        values.push(`q`)
        query += `
            AND full_name ILIKE $${values.length}
        `
      }

        values.push(limit);
        values.push(offset);
        
        query += `
            ORDER BY updated_at DESC
            LIMIT $${values.length - 1}
            OFFSET $${values.length}
        `;
        
        const result = await pool.query(query, values);
        return result.rows;

        }
  
        async findMentorAvailability(mentorId, range) {
            const { fromDate, toDate } = range
          
            const query = `
              SELECT id, mentor_id, start_time, end_time, is_booked
              FROM availability_slots
              WHERE mentor_id = $1
              AND start_time < $3
              AND end_time > $2
              AND is_booked = FALSE
              ORDER BY start_time ASC
            `
          
            const values = [mentorId, fromDate, toDate]
          
            const result = await pool.query(query, values)
          
            return result.rows
          }
          
  
    async putMentorProfile(mentorId, fields) {
      // update mentor profile fields
      // only update fields present in safeUpdate
      // do not touch protected columns
      // return updated mentor profile

      const allowed = ["bio", "sectors", "languages", "meeting_link_template"];

        const updates = [];
        const values = [];
        let index = 1;

        for (const key of allowed) {
            if (fields[key] !== undefined) {
                updates.push(`${key} = $${index}`);
                values.push(fields[key]);
                index++;
            }
        }

        if (updates.length === 0) {
            return undefined; 
        }

        // add ID as last placeholder
        values.push(mentorId);

        const query = `
            UPDATE mentor_profiles
            SET ${updates.join(", ")} , updated_at = NOW()
            WHERE user_id = $${values.length}
            RETURNING *
        `;


        const result = await pool.query(query, values)

        return result.rows[0] || null
    }
  
    async insertMentorAvailability(mentorId, slots) {
      // slots: array of { start_time, end_time }
  
      // insert availability slots for mentor
      // use batch insert if possible
      // return inserted slots

      const query = `INSERT INTO`
    }
  }
  
  module.exports = MentorRepository
  