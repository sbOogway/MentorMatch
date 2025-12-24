const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");
const { jwtSecret, jwtExpiresIn } = require("../config/auth");

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPassword(password) {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
}

class AuthController {
  static async register(req, res) {
    const { full_name, email, password, role } = req.body;

    if (!full_name || !email || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    if (typeof full_name !== "string" || full_name.trim().length < 2) {
      return res.status(400).json({ error: "Invalid full_name" });
    }
    

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: "Password must be at least 8 characters and contain at least one letter and one number"
      });
    }

    if (role !== "mentor" && role !== "mentee") {
      return res.status(403).json({
        error: "Only 'mentor' or 'mentee' role are allowed during registration"
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
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    try {
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
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = AuthController;

