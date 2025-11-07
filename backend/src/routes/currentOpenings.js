const express = require("express");
const router = express.Router();
const { CurrentOpening } = require("../models");

router.get("/", async (req, res) => {
  try {
    const openings = await CurrentOpening.findAll({
      order: [["posted_date", "DESC"]],
    });
    res.json(openings);
  } catch (err) {
    console.error("Error fetching openings:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
