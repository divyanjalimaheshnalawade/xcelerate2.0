const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Project",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      domain: { type: DataTypes.STRING },
      complexity: {
        type: DataTypes.ENUM("low", "medium", "high"),
        defaultValue: "medium",
      },
      slots: { type: DataTypes.INTEGER, defaultValue: 1 },
      status: {
        type: DataTypes.ENUM("open", "in-progress", "closed"),
        defaultValue: "open",
      },
    },
    {
      tableName: "projects",
    }
  );
};
