const express = require("express");
const router = express.Router();
const { AspiredRole, Role, Skill } = require("../models");

// GET Career Insights for user
router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // 1) Get latest Aspired Role
    const latest = await AspiredRole.findOne({
      where: { userId },
      order: [["created_at", "DESC"]],
    });

    if (!latest) {
      return res.json({
        exists: false,
        message: "No aspired role saved yet",
      });
    }

    // 2) Fetch required skills for that role
    const roleRecord = await Role.findOne({
      where: { title: latest.role },
      include: [{ model: Skill, as: "requiredSkills" }],
    });

    if (!roleRecord) {
      return res.json({
        exists: false,
        message: "Role data missing in database",
      });
    }

    const requiredSkills = roleRecord.requiredSkills.map((s) => s.name);

    // 3) Convert selected technologies
    const userSkills = JSON.parse(latest.technologies || "[]");

    // 4) Missing skills
    const missingSkills = requiredSkills.filter((s) => !userSkills.includes(s));

    const matchPercentage = Math.round(
      ((requiredSkills.length - missingSkills.length) / requiredSkills.length) *
        100
    );

    // 5) Build insights list
    const insights = [
      {
        title: "Aspired Role",
        description: latest.role,
      },
      {
        title: "Role Timeframe",
        description: `${latest.timeFrame} months`,
      },
      {
        title: "Your Skills",
        description: userSkills.join(", "),
      },
      {
        title: "Required Skills",
        description: requiredSkills.join(", "),
      },
      {
        title: "Missing Skills",
        description:
          missingSkills.length > 0
            ? missingSkills.join(", ")
            : "You have all required skills!",
      },
      {
        title: "Match Percentage",
        description: matchPercentage + "%",
      },
    ];

    return res.json(insights);
  } catch (err) {
    console.error("Career Insights Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
