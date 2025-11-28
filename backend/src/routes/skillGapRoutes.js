const express = require("express");
const router = express.Router();
const db = require("../config/db"); // this is Sequelize
const sequelize = require("../config/db");
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

// ======================================================
// 2️⃣ Matching Roles (Auto using user's skills)
// ======================================================
router.get("/matching-roles/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1️⃣ Get user's latest aspired role
    const aspiredRoles = await sequelize.query(
      `SELECT * FROM aspired_roles WHERE user_id = ? ORDER BY id DESC LIMIT 1`,
      {
        replacements: [userId],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (!aspiredRoles.length) {
      return res.json({ message: "No aspired role found", roles: [] });
    }

    const aspired = aspiredRoles[0];

    // Parse user skills safely
    let userSkills = [];
    try {
      userSkills = JSON.parse(aspired.technologies || "[]").map((s) =>
        String(s).toLowerCase()
      );
    } catch (e) {
      userSkills = [];
    }

    // 2️⃣ Fetch all roles from master list
    const roles = await sequelize.query(`SELECT * FROM roles`, {
      type: sequelize.QueryTypes.SELECT,
    });

    // 3️⃣ Calculate match % for each role
    const matches = roles.map((role) => {
      const required = JSON.parse(role.skills || "[]").map((s) =>
        String(s).toLowerCase()
      );

      const missing = required.filter((s) => !userSkills.includes(s));

      const matchPercentage = Math.round(
        ((required.length - missing.length) / required.length) * 100
      );

      return {
        role: role.name,
        requiredSkills: required,
        missingSkills: missing,
        matchPercentage,
      };
    });

    // 4️⃣ Filter roles above 65%
    const filtered = matches.filter((r) => r.matchPercentage >= 65);

    // 5️⃣ Sort by match percentage (highest first)
    filtered.sort((a, b) => b.matchPercentage - a.matchPercentage);

    res.json(filtered);
  } catch (err) {
    console.error("Matching roles error:", err);
    res.status(500).json({ error: "Server error" });
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
