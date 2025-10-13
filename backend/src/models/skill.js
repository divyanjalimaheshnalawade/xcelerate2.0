const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Skill",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, unique: true, allowNull: false },
      category: { type: DataTypes.STRING },
      proficiency_examples: { type: DataTypes.TEXT }, // optional notes
    },
    {
      tableName: "skills",
    }
  );
};
