//src/controllers/matchController.js
const { Project, User, Skill } = require("../models");
const { Op } = require("sequelize");

exports.matchForProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findByPk(projectId, {
      include: [{ model: Skill, as: "requiredSkills" }],
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const skillIds = project.requiredSkills.map((s) => s.id);
    if (!skillIds.length) return res.json([]);

    // naive: find users who have any of required skills, order by count match desc
    const users = await User.findAll({
      include: [
        {
          model: Skill,
          as: "skills",
          where: { id: { [Op.in]: skillIds } },
          through: { attributes: ["proficiency", "years"] },
        },
      ],
    });

    // score users by number of matching skills & avg proficiency
    const results = users
      .map((u) => {
        const matches = u.skills.map((s) =>
          s.user_skill
            ? s.user_skill.proficiency
            : s.UserSkill
            ? s.UserSkill.proficiency
            : 1
        ); // different naming depending on include handling
        const score =
          matches.length *
          (matches.reduce((a, b) => a + b, 0) / (matches.length || 1));
        return {
          user: { id: u.id, name: u.name, email: u.email },
          matchedSkills: u.skills.map((s) => ({ id: s.id, name: s.name })),
          score,
        };
      })
      .sort((a, b) => b.score - a.score);

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
