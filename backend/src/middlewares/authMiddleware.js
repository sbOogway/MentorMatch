const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");

module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (!scheme || !token) {
    return res.status(401).json({ message: "Malformed authorization header" });
  }

  if (scheme.toLowerCase() !== "bearer") {
    return res.status(401).json({ message: "Authorization scheme must be Bearer" });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        message: "Invalid or expired token",
        error: err.name
      });
    }

    // Validazione minima payload
    if (!decoded || !decoded.id || !decoded.role) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Attach user to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    };

    next();
  });
};
