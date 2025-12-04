require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const locationRoutes = require("./src/routes/locations.routes");
const userRoutes = require("./src/routes/users.routes");
const pool = require("./src/config/database");
const swaggerDocs = require("./src/config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// Test connection
// ==========================================
pool.query("SELECT 1")
  .then(() => console.log("✅ PostgreSQL connesso"))
  .catch(err => console.error("❌ Errore PostgreSQL:", err));

// ==========================================
// ROUTES
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "CoWorkSpace Backend attivo!" });
});

// ==========================================
// SWAGGER
// ==========================================
swaggerDocs(app);
console.log("📘 Swagger disponibile su /api-docs");

// ==========================================
// Start server
// ==========================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
});

// ==========================================
// Error Handler (optional but recommended)
// ==========================================
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});
