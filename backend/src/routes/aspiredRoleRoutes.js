const express = require("express");
const router = express.Router();

const sequelize = require("../config/db"); // your sequelize instance
const AspiredRole = require("../models/aspiredRole")(sequelize); // ✅ call the function

// Save aspired role
router.post("/analyze", async (req, res) => {
  try {
    console.log("🟢 Incoming Skill Gap Request:", req.body);

    const { aspiredRole } = req.body;
    if (!aspiredRole)
      return res.status(400).json({ message: "aspiredRole is required" });

    console.log("🔍 Looking up Role for:", aspiredRole);

    // Fetch Role and Skills
    const role = await Role.findOne({
      where: { title: aspiredRole },
      include: [{ model: Skill, as: "requiredSkills" }],
    });

    console.log("📘 Role found:", role ? role.title : "none");

    if (!role)
      return res.status(404).json({ message: "Role not found in database" });

    console.log("🧩 Required skills:", role.requiredSkills);

    const requiredSkillNames = role.requiredSkills.map((s) => s.name);
    console.log("✅ Required skill names:", requiredSkillNames);

    // Static current skills for now
    const userSkills = ["JavaScript", "React", "HTML", "CSS"];
    console.log("🧠 User skills:", userSkills);

    const missingSkills = requiredSkillNames.filter(
      (s) => !userSkills.includes(s)
    );
    const matchPercentage = Math.round(
      ((requiredSkillNames.length - missingSkills.length) /
        requiredSkillNames.length) *
        100
    );

    console.log("📊 Match:", matchPercentage, "%");

    res.json({
      aspiredRole,
      userSkills,
      requiredSkills: requiredSkillNames,
      missingSkills,
      matchPercentage,
    });
  } catch (err) {
    console.error("❌ Skill Gap Analysis Failed:", err);
    res.status(500).json({ message: "Error performing skill gap analysis" });
  }
});

// Fetch aspired role (latest one)
router.get("/", async (req, res) => {
  try {
    const latest = await AspiredRole.findOne({
      order: [["createdAt", "DESC"]],
    });
    if (!latest) return res.json({});
    const data = latest.toJSON();
    data.technologies = JSON.parse(data.technologies);
    res.json(data);
  } catch (error) {
    console.error("Error fetching aspired role:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
