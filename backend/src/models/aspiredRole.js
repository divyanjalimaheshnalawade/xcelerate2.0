const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("AspiredRole", {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeFrame: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    technologies: {
      type: DataTypes.TEXT, // will store JSON string
      allowNull: false,
    },
  });
};
