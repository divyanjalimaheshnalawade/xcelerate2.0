const { Project, Skill } = require("../models");

exports.createProject = async (req, res) => {
  try {
    const { title, description, domain, complexity, slots, skillIds } =
      req.body;
    const project = await Project.create({
      title,
      description,
      domain,
      complexity,
      slots,
    });
    if (Array.isArray(skillIds) && skillIds.length) {
      const skills = await Skill.findAll({ where: { id: skillIds } });
      await project.setRequiredSkills(skills);
    }
    return res.status(201).json(project);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.listOpenProjects = async (req, res) => {
  const projects = await Project.findAll({
    where: { status: "open" },
    include: [{ model: Skill, as: "requiredSkills" }],
  });
  res.json(projects);
};
