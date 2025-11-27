src / controllers / skillController.js;
const { Skill } = require("../models");

exports.createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json(skill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listSkills = async (req, res) => {
  const skills = await Skill.findAll();
  res.json(skills);
};
