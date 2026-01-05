const pool = require("../config/database")

class MentorProfileRepository {

  static async create(client, userId, sectors = []) {
    const query = `
      INSERT INTO mentor_profiles (user_id, sectors)
      VALUES ($1, $2)
      RETURNING *
    `
    const values = [userId, sectors]

    const result = await client.query(query, values)
    return result.rows[0]
  }
  static async fetchProfile(client, userId){
    const query = `
      SELECT 
        mp.*,
        u.full_name,
        u.email,
        u.role
      FROM mentor_profiles mp
      JOIN users u ON u.id = mp.user_id
      WHERE mp.user_id = $1
    `
    const result = await client.query(query, [userId])

    return result.rows[0]
  }

  static async updateProfile(client, userId, fields) {
    const allowed = ["sectors", "languages", "bio"]
  
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
      return null
    }
  
    values.push(userId)
  
    const query = `
      UPDATE mentor_profiles
      SET ${updates.join(", ")}
      WHERE user_id = $${values.length}
      RETURNING user_id, sectors, languages, bio;
    `
  
    const result = await client.query(query, values)
    return result.rows[0]
  }
  
}

module.exports = MentorProfileRepository
