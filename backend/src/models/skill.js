const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Skill = sequelize.define("Skill", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Skill;
};
