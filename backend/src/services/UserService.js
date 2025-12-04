const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");
const bcrypt = require("bcrypt");

const UserRepository = require("../repositories/UserRepository");

```
id SERIAL PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('client', 'manager', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
```
class UserService {

    async getAllUsers() {
        return await UserRepository.getAllUsers()
    }

    async getUserById(id) {
        const user = await UserRepository.findById(id)
        if (!user) return null

        const {password_hash, ...safeUser} = user
        return safeUser
    }

    async createUser(userData) {
        // skeleton (only if admins can create users manually)
        const {full_name , email, password, role} = userData
        
        if(!full_name || !email || !password || !role){
            throw new Error("Missing field requirement")
        }
        if(role === "admin"){
            throw new Error("can't create admin user")
        }
        
            
        const existing = await UserRepository.findByEmail(email);
        
        if (existing) {
            throw { code: "USER_EXISTS", message: "Email already exists" }

        }
      
      
        const hashed = bcrypt.hashSync(password, 10);
      
           
        const newUser = await UserRepository.createUser(
              full_name,
              email,
              hashed,
              role
            );

        delete newUser.password_hash

        return newUser
         
        
    
    }

    async updateUser(id, updateData) {
        
        const {full_name , email, password, role} = updateData
        
        if(!id){
            throw new Error("id not provided")
        }
        if(updateData == null){
            throw new Error("Missing update information")
        }
        if(role === "admin"){
            throw new Error("can't update admin user")
        }

        updateData.password = bcrypt.hashSync(password, 10);

        const result = await UserRepository.updateUser(id, updateData)

        delete result.password_hash

        return result

        


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

module.exports = UserService;

