const express = require("express");
const router = express.Router();
const db = require("../config/db"); // this is Sequelize
const sequelize = require("../config/db");
const { SkillGapAnalysis, AspiredRole, CurrentOpening } = require("../models");

// ======================================================
// 1️⃣ AUTO Skill Gap Based On User's Aspired Role
// ======================================================
router.post("/analyze", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    // 1) Get user's aspired role
    const roleRows = await db.query(
      `SELECT * FROM aspired_roles WHERE userId = ? ORDER BY id DESC LIMIT 1`,
      {
        replacements: [userId],
        type: db.QueryTypes.SELECT,
      }
    );

    if (roleRows.length === 0) {
      return res.json({ message: "No aspired role found", exists: false });
    }

    const aspired = roleRows[0];
    const userSkills = JSON.parse(aspired.technologies);

    // 2) Fetch required skills from roles table
    const roleInfo = await db.query(
      `SELECT * FROM roles WHERE name = ? LIMIT 1`,
      {
        replacements: [aspired.role],
        type: db.QueryTypes.SELECT,
      }
    );

    if (roleInfo.length === 0) {
      return res.json({
        message: "Role not found in master table",
        exists: false,
      });
    }

    const requiredSkills = JSON.parse(roleInfo[0].skills);

    // Convert to lowercase
    const userLower = userSkills.map((s) => s.toLowerCase());
    const reqLower = requiredSkills.map((s) => s.toLowerCase());

    // Missing skills
    const missingSkills = reqLower.filter((s) => !userLower.includes(s));

    // Match %
    const matchPercentage = Math.round(
      ((reqLower.length - missingSkills.length) / reqLower.length) * 100
    );

    // Save skill gap record
    await db.query(
      `INSERT INTO skill_gap_analysis (userId, roleId, matchPercentage, missingSkills)
       VALUES (?, ?, ?, ?)`,
      {
        replacements: [
          userId,
          roleInfo[0].id,
          matchPercentage,
          JSON.stringify(missingSkills),
        ],
        type: db.QueryTypes.INSERT,
      }
    );

    return res.json({
      exists: true,
      aspiredRole: aspired.role,
      userSkills,
      requiredSkills,
      missingSkills,
      matchPercentage,
    });
  } catch (err) {
    console.error("Skill analysis error:", err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

//Matchingroles
router.get("/matching-roles/latest", async (req, res) => {
  try {
    // 1️⃣ Get latest aspired role
    const latestAspiredRole = await AspiredRole.findOne({
      order: [["id", "DESC"]],
    });

    if (!latestAspiredRole) {
      return res.status(404).json({ message: "No aspired roles found" });
    }

    // Convert technologies string → array
    const userSkills = JSON.parse(latestAspiredRole.technologies);
    const userLower = userSkills.map((s) => s.toLowerCase());

    // 2️⃣ Load all current openings
    const openings = await CurrentOpening.findAll();

    const results = openings.map((job) => {
      // Convert required skills string → array
      let required = [];

      try {
        if (Array.isArray(job.skills_required)) {
          required = job.skills_required;
        } else if (typeof job.skills_required === "string") {
          required = JSON.parse(job.skills_required);
        }
      } catch (e) {
        // Fallback: split by comma
        required = job.skills_required.split(",").map((s) => s.trim());
      }

      const requiredLower = required.map((s) => s.toLowerCase());

      // Matched skills
      const matched = requiredLower.filter((skill) =>
        userLower.includes(skill)
      );

      // Missing skills
      const missing = requiredLower.filter(
        (skill) => !userLower.includes(skill)
      );

      // Match percentage
      const percentage = Math.round(
        (matched.length / requiredLower.length) * 100
      );

      return {
        jobId: job.id,
        title: job.title,
        requiredSkills: required,
        matchedSkills: matched,
        missingSkills: missing,
        percentage,
      };
    });

    // Sort by best match
    results.sort((a, b) => b.percentage - a.percentage);

    res.json({ data: results });
  } catch (error) {
    console.error("Matching roles error:", error);
    res.status(500).json({ message: "Matching roles error", error });
  }
});

// ======================================================
// 3️⃣ Latest Skill Gap for Dashboard
// ======================================================
router.get("/latest-gap/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const rows = await db.query(
      `SELECT * FROM skill_gap_analysis
       WHERE userId = ?
       ORDER BY createdAt DESC
       LIMIT 1`,
      {
        replacements: [userId],
        type: db.QueryTypes.SELECT,
      }
    );

    if (rows.length === 0) return res.json({ exists: false });

    rows[0].missingSkills = JSON.parse(rows[0].missingSkills);

    res.json({ exists: true, data: rows[0] });
  } catch (err) {
    console.error("Latest gap fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
