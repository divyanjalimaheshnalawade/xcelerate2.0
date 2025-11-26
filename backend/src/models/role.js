const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Role = sequelize.define("Role", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return Role;
};
