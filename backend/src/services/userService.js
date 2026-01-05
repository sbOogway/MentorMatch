const bcrypt = require("bcrypt");
const UserRepository = require("../repositories/UserRepository");
const MentorProfileRepository = require("../repositories/MentorProfileRepository")
const pool = require("../config/database")

class userService {

    async getAllUsers() {
        return await UserRepository.getAllUsers(); 
    }

    async getUserById(id) {
      const client = await pool.connect()
    
      try {
        await client.query("BEGIN")
    
        const user = await UserRepository.findById(client, id)
    
        if (!user) {
          await client.query("COMMIT")
          return null
        }
    
        let sectors = null
        let languages = null
        let bio = null
    
        if (user.role === "mentor") {
          const mentor = await MentorProfileRepository.fetchProfile(client, user.id)
    
          if (mentor) {
            sectors = mentor.sectors
            languages = mentor.languages
            bio = mentor.bio
          }
        }
    
        await client.query("COMMIT")
    
        return {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          role: user.role,
          sectors: sectors,
          languages: languages,
          bio: bio
        }
    
      } catch (err) {
        await client.query("ROLLBACK")
        throw err
      } finally {
        client.release()
      }
    }
    
    
    async registerUser({ full_name, email, password_hash, role, sectors }) {
        const client = await pool.connect()
    
        try {
          await client.query("BEGIN")
    
          const user = await UserRepository.createUser(
            client,
            full_name,
            email,
            password_hash,
            role
          )
    
          if (role === "mentor") {
            await MentorProfileRepository.create(
              client,
              user.id,
              sectors
            )
          }
    
          await client.query("COMMIT")
          return user
    
        } catch (err) {
          await client.query("ROLLBACK")
          throw err
        } finally {
          client.release()
        }
    }

    async updateUser(id, updateData) {
        if (!id) {
            throw new Error("id not provided");
        }

        if (!updateData) {
            throw new Error("Missing update information");
        }

        // Impediamo di assegnare ruolo admin
        if (updateData.role === "admin") {
            throw new Error("can't assign admin role");
        }

        // Hash password SOLO SE fornita
        if (updateData.password) {
            updateData.password_hash = bcrypt.hashSync(updateData.password, 10);
            delete updateData.password;
        }

        const result = await UserRepository.updateUser(id, updateData);

        if (!result) return null;

        delete result.password_hash;

        return result;
    }

    async deleteUser(id) {
        if (!id) {
            throw new Error("No id provided");
        }

        const deleted = await UserRepository.deleteUser(id);
        if (!deleted) {
            throw new Error("User not found");
        }

        return deleted;
    }
}

module.exports = userService;
