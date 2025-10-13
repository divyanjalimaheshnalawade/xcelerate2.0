const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define(
    "Assignment",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      role: { type: DataTypes.STRING },
      start_date: { type: DataTypes.DATE },
      end_date: { type: DataTypes.DATE },
      status: {
        type: DataTypes.ENUM("assigned", "completed", "cancelled"),
        defaultValue: "assigned",
      },
    },
    {
      tableName: "assignments",
    }
  );
};
