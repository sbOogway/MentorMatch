const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }


  const parts = authHeader.split(" ");

  if (parts.length !== 2) {
    return res.status(401).json({ message: "Invalid token format" });
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer") {
    return res.status(401).json({ message: "Token must start with Bearer" });
  }

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

 
    req.user = decoded;

    next();
  });
};
