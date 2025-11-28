const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      role: { type: DataTypes.STRING, defaultValue: "employee" }, // employee/admin/mentor
      aspired_role: { type: DataTypes.STRING }, // target career goal
      experience_years: { type: DataTypes.FLOAT, defaultValue: 0 },
      bio: { type: DataTypes.TEXT },

      current_skills: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: [], // e.g., ["HTML", "CSS", "JavaScript"]
      },
    },
    {
      tableName: "users",
      hooks: {
        beforeCreate: async (user) => {
          if (user.password) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed("password")) {
            user.password = await bcrypt.hash(user.password, 10);
          }
        },
      },
    }
  );

  // ✅ Password validation helper
  User.prototype.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

  return User;
};
