
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const { jwtSecret, jwtExpiresIn } = require("../config/auth");

class AuthController {
 
  static async register(req, res) {
    const { full_name, email, password, role } = req.body;

  
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

  
    if (role !== "client") {
      return res.status(403).json({
        error: "Only 'client' role is allowed during registration"
      });
    }

    try {
      
      const existing = await UserRepository.findByEmail(email);
      if (existing) {
        return res.status(409).json({ error: "Email already exists" });
      }

     
      const hashed = bcrypt.hashSync(password, 10);

     
      const newUser = await UserRepository.createUser(
        full_name,
        email,
        hashed,
        role
      );

      
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

    
      delete newUser.password_hash;

      return res.status(201).json({
        message: "User registered successfully",
        user: newUser,
        token
      });

    } catch (err) {
      console.error("Error in register:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }




  static async login(req, res) {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    try {
      // Find user
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

    
      const valid = bcrypt.compareSync(password, user.password_hash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid password" });
      }

    
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtSecret,
        { expiresIn: jwtExpiresIn }
      );

      delete user.password_hash;

      return res.status(200).json({
        message: "Login successful",
        user,
        token
      });

    } catch (err) {
      console.error("Error in login:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = AuthController;
