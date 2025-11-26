const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// ✅ Fixed user skills (for now)
const userSkills = ["JavaScript", "React", "HTML", "CSS"];

// ✅ Path to your CSV file
const csvPath = path.join(__dirname, "roles_skills.csv");

// ✅ Helper: Read CSV into memory
const readCSV = async () => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

// ✅ POST /api/skill-gap/analyze
router.post("/analyze", async (req, res) => {
  try {
    const { aspiredRole } = req.body;

    if (!aspiredRole) {
      return res.status(400).json({ message: "aspiredRole is required" });
    }

    console.log(`🧠 Skill Gap Analysis for role: ${aspiredRole}`);

    // Step 1: Read CSV
    const rolesData = await readCSV();

    // Step 2: Find matching role (case-insensitive)
    const roleRow = rolesData.find(
      (row) =>
        row.Role &&
        row.Role.toLowerCase().trim() === aspiredRole.toLowerCase().trim()
    );

    if (!roleRow) {
      return res
        .status(404)
        .json({ message: `Role "${aspiredRole}" not found in CSV` });
    }

    // Step 3: Parse skills separated by semicolons
    const requiredSkills = roleRow.RequiredSkills
      ? roleRow.RequiredSkills.split(";").map((s) => s.trim())
      : [];

    console.log("✅ Required Skills from CSV:", requiredSkills);

    if (!requiredSkills.length) {
      return res.status(404).json({
        message: `No required skills listed for role "${aspiredRole}" in CSV`,
      });
    }

    // Step 4: Compare with user skills
    const missingSkills = requiredSkills.filter(
      (skill) =>
        !userSkills.some(
          (userSkill) =>
            userSkill.toLowerCase().trim() === skill.toLowerCase().trim()
        )
    );

    const total = requiredSkills.length;
    const matchPercentage = total
      ? Math.round(((total - missingSkills.length) / total) * 100)
      : 0;

    // Step 5: Respond
    return res.json({
      aspiredRole,
      totalRequired: total,
      requiredSkills,
      userSkills,
      missingSkills,
      matchPercentage,
    });
  } catch (err) {
    console.error("❌ Error performing skill gap analysis:", err);
    res.status(500).json({
      message: "Error performing skill gap analysis",
      error: err.message,
    });
  }
});
// ✅ GET /api/skill-gap/matching-roles
router.get("/matching-roles", async (req, res) => {
  try {
    const rolesData = await readCSV();

    // Compute match percentage for each role
    const rolesWithMatch = rolesData.map((row) => {
      const requiredSkills = row.RequiredSkills
        ? row.RequiredSkills.split(";").map((s) => s.trim())
        : [];

      const missingSkills = requiredSkills.filter(
        (skill) =>
          !userSkills.some(
            (userSkill) =>
              userSkill.toLowerCase().trim() === skill.toLowerCase().trim()
          )
      );

      const total = requiredSkills.length;
      const matchPercentage = total
        ? Math.round(((total - missingSkills.length) / total) * 100)
        : 0;

      return {
        role: row.Role,
        matchPercentage,
        totalRequired: total,
        requiredSkills,
        userSkills,
        missingSkills,
      };
    });

    // ✅ Sort roles by match percentage (highest first)
    const sortedRoles = rolesWithMatch.sort(
      (a, b) => b.matchPercentage - a.matchPercentage
    );

    res.json(sortedRoles);
  } catch (err) {
    console.error("❌ Error fetching matching roles:", err);
    res.status(500).json({
      message: "Error fetching matching roles",
      error: err.message,
    });
  }
});

module.exports = router;
