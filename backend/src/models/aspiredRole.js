const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AspiredRole = sequelize.define("AspiredRole", {
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timeFrame: {
      type: DataTypes.INTEGER,
      allowNull: false, // in weeks or months
    },
    technologies: {
      type: DataTypes.JSON, // ✅ change from TEXT → JSON
      allowNull: false, // e.g., ["React", "Node.js", "MySQL"]
    },
  });

  return AspiredRole;
};
