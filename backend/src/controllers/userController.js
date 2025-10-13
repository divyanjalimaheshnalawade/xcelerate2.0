const { User, Skill } = require("../models");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Skill, as: "skills" }],
    });
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    await user.update(req.body);
    return res.json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Admin: list users
exports.listUsers = async (req, res) => {
  const users = await User.findAll({
    attributes: ["id", "name", "email", "role", "aspired_role"],
  });
  res.json(users);
};
