
const pool = require("../config/database");
const bcrypt = require("bcrypt");

class UserRepository {

  static async getAllUsers() {
      try {
          const result = await pool.query(`
              SELECT id, full_name, email, role, created_at 
              FROM users
              ORDER BY id ASC
          `);
          return result.rows;
      } catch (err) {
          console.error("Error in getAllUsers:", err);
          throw err;
      }
  }

  static async findByEmail(email) {
    try {
      const query = "SELECT * FROM users WHERE email = $1 LIMIT 1";
      const values = [email];

      const result = await pool.query(query, values);

      return result.rows[0] || null; // ritorna l’utente o null
    } catch (err) {
      console.error("Errore in findByEmail:", err);
      throw err; // lascia che il controller gestisca l’errore
    }
  }
  static async findById(client = pool, id) {
    try {
      const query = "SELECT * FROM users WHERE id = $1 LIMIT 1";
      const values = [id];

      const result = await client.query(query, values);

      return result.rows[0] || null; // ritorna l’utente o null
    } catch (err) {
      console.error(" Errore in findById:", err);
      throw err; // lascia che il controller gestisca l’errore
    }
  }

  static async createUser(client, full_name, email, password_hash, role) {
    const query = "INSERT INTO users (full_name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *"
    const values = [full_name, email, password_hash, role]
  
    try {
      const result = await client.query(query, values)
      return result.rows[0]
    } catch (err) {
      console.error("Errore in createUser:", err)
      throw err
    }
  }
  

  static async updateUser(client, id, fields) {
    const allowed = ["full_name", "email", "role", "password_hash"]
  
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
  
    values.push(id)
  
    const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = $${values.length}
      RETURNING id, full_name, email, role;
    `
  
    const result = await client.query(query, values)
    return result.rows[0]
  }
  
  static async deleteUser(id) {
      const query = `
          DELETE FROM users
          WHERE id = $1
          RETURNING id, full_name, email, role, created_at;
      `;
      const values = [id];

      try {
          const result = await pool.query(query, values);
          
          return result.rows[0] || null;
      } catch (err) {
          console.error("Error in deleteUser:", err);
          throw err;
      }
  }



}



module.exports = UserRepository;
