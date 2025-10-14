const express = require("express");
const router = express.Router();

const sequelize = require("../config/db"); // your sequelize instance
const AspiredRole = require("../models/aspiredRole")(sequelize); // ✅ call the function

// Save aspired role
router.post("/", async (req, res) => {
  try {
    const { role, timeFrame, technologies } = req.body;
    const saved = await AspiredRole.create({
      role,
      timeFrame,
      technologies: JSON.stringify(technologies),
    });
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error saving aspired role:", error);
    res.status(500).json({ error: "Server error" });
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
