const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "../.env" });

const { sequelize } = require("./models");
const aspiredRoleRoutes = require("./routes/aspiredRoleRoutes");
const careerRoutes = require("./routes/careerRoutes");
const currentOpeningsRoutes = require("./routes/currentOpenings");
const analysisRoutes = require("./routes/analysis");
const skillGapRoutes = require("./routes/skillGapRoutes");

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

// routes
app.use("/api/aspired-role", aspiredRoleRoutes);
app.use("/api/careers", careerRoutes);
app.use("/api/currentOpenings", currentOpeningsRoutes);
app.use("/api/analysis", analysisRoutes);
app.use("/api/skill-gap", skillGapRoutes);

// simple health
app.get("/api/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.sync({ alter: true });

    // ---- 🔽 SEED DATA BLOCK (only runs if DB is empty) ----
    const { User, Skill, Role } = require("./models");

    const skillCount = await Skill.count();
    if (skillCount === 0) {
      const [js, sql, react, node] = await Skill.bulkCreate([
        { name: "JavaScript" },
        { name: "SQL" },
        { name: "React" },
        { name: "Node.js" },
      ]);

      const emp = await User.create({
        name: "Divyanjali",
        email: "divya@example.com",
        password: "password123",
      });

      await emp.addSkills([js, react]); // employee current skills

      const role = await Role.create({
        title: "Full Stack Developer",
        description:
          "Front-end and Back-end development using modern JavaScript frameworks",
      });
      await role.addRequiredSkills([js, react, sql, node]);

      console.log("✅ Sample skills, employee, and role seeded.");
    } else {
      console.log("ℹ️ Seed data already exists — skipping.");
    }
    // ---- 🔼 END SEED BLOCK ----

    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (err) {
    console.error("Failed to start", err);
  }
})();
