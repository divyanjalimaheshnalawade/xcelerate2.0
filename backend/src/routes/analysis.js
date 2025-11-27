// backend/routes/analysis.js
const express = require("express");
const router = express.Router();
const { User, Skill, Role } = require("../models");
const { computeMatch, generateRoadmap } = require("../services/matching");

// GET skill gap & roadmap for a user (was Employee)
router.get("/gap/:userId/:roleId", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId, {
      include: { model: Skill, as: "skills" },
    });
    const role = await Role.findByPk(req.params.roleId, {
      include: { model: Skill, as: "requiredSkills" },
    });

    if (!user || !role) {
      return res.status(404).json({ message: "User or role not found" });
    }

    const userSkills = (user.skills || []).map((s) => s.name);
    const reqSkills = (role.requiredSkills || []).map((s) => s.name);

    const { matchPct, matched, missing } = computeMatch(userSkills, reqSkills);
    const roadmap = generateRoadmap(missing);

    return res.json({
      user: user.name,
      role: role.title,
      matchPct,
      matched,
      missing,
      roadmap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
router.get("/latest-gap", async (req, res) => {
  try {
    const latest = await AspiredRole.findOne({
      order: [["createdAt", "DESC"]],
    });

    if (!latest)
      return res.status(404).json({ message: "No aspired role saved" });

    const role = await Role.findOne({
      where: { title: latest.role },
      include: { model: Skill, as: "requiredSkills" },
    });

    if (!role) return res.status(404).json({ message: "Role not found in DB" });

    const requiredSkills = role.requiredSkills.map((s) => s.name);
    const userSkills = ["JavaScript", "React", "HTML", "CSS"]; // For now

    const missingSkills = requiredSkills.filter((s) => !userSkills.includes(s));

    const matchPercentage = Math.round(
      ((requiredSkills.length - missingSkills.length) / requiredSkills.length) *
        100
    );

    res.json({
      aspiredRole: latest.role,
      timeFrame: latest.timeFrame,
      selectedTech: JSON.parse(latest.technologies),
      requiredSkills,
      userSkills,
      missingSkills,
      matchPercentage,
    });
  } catch (err) {
    console.error("Error in latest-gap:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
