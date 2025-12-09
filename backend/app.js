require("dotenv").config();
const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/users.routes");
const pool = require("./src/config/database");
const swaggerDocs = require("./src/config/swagger");

const app = express();

app.use(cors());
app.use(express.json());

pool.query("SELECT 1")
  .then(() => console.log("PostgreSQL connesso"))
  .catch(err => console.error("Errore PostgreSQL:", err));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MentorMatch Backend attivo!" });
});

swaggerDocs(app);

console.log("Swagger ready");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server avviato su http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});
