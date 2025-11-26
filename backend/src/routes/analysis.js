// backend/routes/analysis.js
const express = require("express");
const router = express.Router();
const { Employee, Skill, Role } = require("../models");
const { computeMatch, generateRoadmap } = require("../services/matching");

// GET skill gap & roadmap
router.get("/gap/:employeeId/:roleId", async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.employeeId, {
      include: { model: Skill, as: "skills" },
    });
    const role = await Role.findByPk(req.params.roleId, {
      include: { model: Skill, as: "requiredSkills" },
    });

    if (!employee || !role)
      return res.status(404).json({ message: "Employee or role not found" });

    const empSkills = employee.skills.map((s) => s.name);
    const reqSkills = role.requiredSkills.map((s) => s.name);
    const { matchPct, missing } = computeMatch(empSkills, reqSkills);
    const roadmap = generateRoadmap(missing);

    return res.json({
      employee: employee.name,
      role: role.title,
      matchPct,
      missing,
      roadmap,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
