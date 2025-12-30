const pool = require("../config/database")

class MentorRepository {
  constructor(db) {
    this.db = db
  }

    async findMentorById(mentorId) {
    const query = `
      SELECT
        mp.id,
        mp.user_id,
        u.full_name,
        mp.bio,
        mp.sectors,
        mp.languages,
        mp.rating_avg AS rating,
        mp.meeting_link_template
      FROM mentor_profiles mp
      JOIN users u ON u.id = mp.user_id
      WHERE mp.id = $1
    `;

    const { rows } = await pool.query(query, [mentorId]);
    if (!rows.length) return null;

    const r = rows[0];

    return {
      id: r.id,
      user_id: r.user_id,
      full_name: r.full_name,
      bio: r.bio,
      sectors: r.sectors,
      languages: r.languages,
      rating: Number(r.rating),
      profile: {
        meeting_link_template: r.meeting_link_template
      }
    };
  }
 

  async findMentors(filters, pagination) {
    const { sector, lang, available, q } = filters
    const { limit, offset } = pagination
  
    let baseQuery = `
      FROM mentor_profiles mp
      JOIN users u ON mp.user_id = u.id
      WHERE TRUE
    `
  
    const values = []
  
    if (sector?.length) {
      values.push(sector)
      baseQuery += ` AND mp.sectors && $${values.length}`
    }
  
    if (lang?.length) {
      values.push(lang)
      baseQuery += ` AND mp.languages && $${values.length}`
    }
  
    if (available === true) {
      baseQuery += `
        AND EXISTS (
          SELECT 1
          FROM availability_slots a
          WHERE a.mentor_id = mp.id
          AND a.start_time >= NOW()
        )
      `
    }
  
    if (q) {
      values.push(`%${q}%`)
      baseQuery += ` AND u.full_name ILIKE $${values.length}`
    }
  
    const itemsQuery = `
      SELECT mp.id, u.full_name, mp.bio, mp.sectors, mp.languages, mp.rating_avg AS rating
      ${baseQuery}
      ORDER BY mp.updated_at DESC
      LIMIT $${values.length + 1}
      OFFSET $${values.length + 2}
    `
  
    const countQuery = `
      SELECT COUNT(*) AS total
      ${baseQuery}
    `
  
    const itemsResult = await pool.query(
      itemsQuery,
      [...values, limit, offset]
    )
  
    const countResult = await pool.query(countQuery, values)
  
    return {
      items: itemsResult.rows,
      total: Number(countResult.rows[0].total)
    }

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

  async updateMentorProfile(mentorId, fields) {
    const allowed = ["bio", "sectors", "languages", "meeting_link_template"]

    const updates = []
    const values = []
    let index = 1

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = $${index}`)
        values.push(fields[key])
        index++
      }
    }

    if (updates.length === 0) {
      return undefined
    }

    values.push(mentorId)

    const query = `
      UPDATE mentor_profiles
      SET ${updates.join(", ")}, updated_at = NOW()
      WHERE id = $${values.length}
      RETURNING *
    `

    const result = await pool.query(query, values)

    return result.rows[0] || null
  }

  async createMentorAvailability(mentorId, slots) {
    const values = []
    const placeholders = []

    let index = 1

    for (const slot of slots) {
      placeholders.push(`($${index}, $${index + 1}, $${index + 2})`)
      values.push(mentorId, slot.start_time, slot.end_time)
      index += 3
    }

    const query = `
      INSERT INTO availability_slots (mentor_id, start_time, end_time)
      VALUES ${placeholders.join(", ")}
      RETURNING id, mentor_id, start_time, end_time, is_booked
    `

    const result = await pool.query(query, values)

    return result.rows
  }
}

module.exports = MentorRepository
