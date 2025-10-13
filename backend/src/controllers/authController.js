const jwt = require("jsonwebtoken");
const { User } = require("../models");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { name, email, password, aspired_role } = req.body;
    const user = await User.create({ name, email, password, aspired_role });
    return res
      .status(201)
      .json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });
    const valid = await user.validatePassword(password);
    if (!valid) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
