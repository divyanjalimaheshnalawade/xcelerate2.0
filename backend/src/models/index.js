const Sequelize = require("sequelize");
const sequelize = require("../config/db");

const User = require("./user")(sequelize, Sequelize.DataTypes);
const Project = require("./project")(sequelize, Sequelize.DataTypes);
const UserSkill = require("./userSkill")(sequelize, Sequelize.DataTypes);
const Assignment = require("./assignment")(sequelize, Sequelize.DataTypes);
const AspiredRole = require("./aspiredRole")(sequelize, Sequelize.DataTypes);
const CurrentOpening = require("./currentOpening")(sequelize);
const Role = require("./role")(sequelize, Sequelize.DataTypes);
const Skill = require("./skill")(sequelize, Sequelize.DataTypes);

// ------------------------------------------------------------
// Associations
// ------------------------------------------------------------

// Users ↔ Skills
User.belongsToMany(Skill, { through: UserSkill, as: "skills" });
Skill.belongsToMany(User, { through: UserSkill, as: "users" });
Role.belongsToMany(Skill, { through: "RoleSkills", as: "requiredSkills" });
Skill.belongsToMany(Role, { through: "RoleSkills", as: "roles" });
// Projects ↔ Skills
Project.belongsToMany(Skill, {
  through: "project_skills",
  as: "requiredSkills",
});
Skill.belongsToMany(Project, { through: "project_skills", as: "projects" });

// Users ↔ Projects via Assignments
User.hasMany(Assignment, { as: "assignments", foreignKey: "userId" });
Project.hasMany(Assignment, { as: "assignments", foreignKey: "projectId" });
Assignment.belongsTo(User, { foreignKey: "userId" });
Assignment.belongsTo(Project, { foreignKey: "projectId" });

User.hasMany(AspiredRole, { as: "aspiredRoles", foreignKey: "userId" });
AspiredRole.belongsTo(User, { foreignKey: "userId", as: "user" });

module.exports = {
  sequelize,
  User,
  Project,
  Skill,
  UserSkill,
  Assignment,
  AspiredRole,
  CurrentOpening,
  Role,
};
