const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/users");
const projectRoutes = require("./routes/projects");
const skillRoutes = require("./routes/skills");
const aspiredRoleRoutes = require("./routes/aspiredRoleRoutes");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/aspired-role", aspiredRoleRoutes);

// simple health
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.sync({ alter: true }); // in dev. use migrations in prod.
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error("Failed to start", err);
  }
})();
