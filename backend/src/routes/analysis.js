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

module.exports = router;
