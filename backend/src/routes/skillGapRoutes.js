const express = require("express");
const router = express.Router();
const db = require("../config/db");

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
    const [roleRows] = await db.query(
      `SELECT * FROM aspired_roles WHERE userId = ? ORDER BY id DESC LIMIT 1`,
      [userId]
    );

    if (roleRows.length === 0) {
      return res.json({ message: "No aspired role found", exists: false });
    }

    const aspired = roleRows[0];
    const userSkills = JSON.parse(aspired.technologies);

    // 2) Fetch required skills from roles table
    const [roleInfo] = await db.query(
      `SELECT * FROM roles WHERE name = ? LIMIT 1`,
      [aspired.role]
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
      [userId, roleInfo[0].id, matchPercentage, JSON.stringify(missingSkills)]
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

    const [roleRows] = await db.query(
      `SELECT * FROM aspired_roles WHERE userId = ? ORDER BY id DESC LIMIT 1`,
      [userId]
    );

    if (roleRows.length === 0) return res.json([]);

    const userSkills = JSON.parse(roleRows[0].technologies).map((s) =>
      s.toLowerCase()
    );

    const [roles] = await db.query(`SELECT * FROM roles`);

    const matches = roles.map((r) => {
      const required = JSON.parse(r.skills).map((s) => s.toLowerCase());
      const missing = required.filter((s) => !userSkills.includes(s));

      const matchPercentage = Math.round(
        ((required.length - missing.length) / required.length) * 100
      );

      return {
        role: r.name,
        requiredSkills: required,
        missingSkills: missing,
        matchPercentage,
      };
    });

    res.json(matches);
  } catch (err) {
    console.log("Matching roles error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================================
// 3️⃣ Latest Skill Gap for Dashboard
// ======================================================
router.get("/latest-gap/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    const [rows] = await db.query(
      `SELECT * FROM skill_gap_analysis
       WHERE userId = ?
       ORDER BY createdAt DESC
       LIMIT 1`,
      [userId]
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
