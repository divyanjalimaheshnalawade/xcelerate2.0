const express = require("express");
const router = express.Router();
const { User, Skill, Role, AspiredRole } = require("../models");
router.post("/", async (req, res) => {
  try {
    console.log("🟢 Save Aspired Role Request:", req.body);

    const timeFrame = req.body.timeFrame || req.body.timeframeMonths;
    const { role, technologies, userId } = req.body;

    if (!role || !timeFrame || !userId) {
      return res.status(400).json({
        message: "role, timeFrame and userId are required",
      });
    }

    const roleRecord = await Role.findOne({
      where: { title: role },
      include: [{ model: Skill, as: "requiredSkills" }],
    });

    if (!roleRecord) {
      return res
        .status(404)
        .json({ message: `Aspired role '${role}' not found` });
    }

    const requiredSkills = roleRecord.requiredSkills.map((s) => s.name);

    const userSkills = ["JavaScript", "React", "HTML", "CSS", "SQL"];

    const missingSkills = requiredSkills.filter((s) => !userSkills.includes(s));

    const matchPercentage = Math.round(
      ((requiredSkills.length - missingSkills.length) / requiredSkills.length) *
        100
    );

    const saved = await AspiredRole.create({
      userId,
      role,
      timeFrame,
      technologies: JSON.stringify(technologies),
      matchPercentage,
    });

    return res.json({
      message: "Aspired role saved successfully",
      exists: true,
      data: saved,
    });
  } catch (error) {
    console.error("❌ Error saving aspired role:", error);
    res.status(500).json({ message: "Server failed to save aspired role" });
  }
});
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Get the most recent aspired role
    const latest = await AspiredRole.findOne({
      where: { userId },
      order: [["created_at", "DESC"]],
    });

    if (!latest) {
      return res.json({ exists: false });
    }

    // Parse technologies safely
    let technologies = latest.technologies;
    try {
      if (typeof technologies === "string") {
        technologies = JSON.parse(technologies);
      }
    } catch {
      technologies = [];
    }

    return res.json({
      exists: true,
      data: {
        id: latest.id,
        userId: latest.userId,
        role: latest.role,
        timeFrame: latest.timeFrame,
        technologies,
        matchPercentage: latest.matchPercentage || 0,
      },
    });
  } catch (err) {
    console.error("GET /aspired-role error:", err);
    res.status(500).json({ exists: false, error: err.message });
  }
});

module.exports = router;
