const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "UserSkill",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      proficiency: { type: DataTypes.INTEGER, defaultValue: 1 }, // 1-5
      years: { type: DataTypes.FLOAT, defaultValue: 0 },
    },
    {
      tableName: "user_skills",
    }
  );
};
