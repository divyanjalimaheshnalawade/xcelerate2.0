const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const User = require("./user")(sequelize);
const Project = require("./project")(sequelize);
const Skill = require("./skill")(sequelize);
const UserSkill = require("./userSkill")(sequelize);
const Assignment = require("./assignment")(sequelize);
const AspiredRole = require("./aspiredRole")(sequelize, Sequelize.DataTypes); // <-- IMPORT IT
const CurrentOpening = require("./currentOpening")(
  sequelize,
  Sequelize.DataTypes
);
// Associations
User.belongsToMany(Skill, { through: UserSkill, as: "skills" });
Skill.belongsToMany(User, { through: UserSkill, as: "users" });

Project.belongsToMany(Skill, {
  through: "project_skills",
  as: "requiredSkills",
});
Skill.belongsToMany(Project, { through: "project_skills", as: "projects" });

User.hasMany(Assignment, { as: "assignments" });
Project.hasMany(Assignment, { as: "assignments" });
Assignment.belongsTo(User);
Assignment.belongsTo(Project);

module.exports = {
  sequelize,
  User,
  Project,
  Skill,
  UserSkill,
  Assignment,
  AspiredRole,
  CurrentOpening,
};
