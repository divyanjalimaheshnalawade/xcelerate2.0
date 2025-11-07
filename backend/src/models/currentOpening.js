const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const CurrentOpening = sequelize.define(
    "CurrentOpening",
    {
      position_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      experience: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      skills_required: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      posted_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      application_deadline: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
    },
    {
      tableName: "current_openings",
      timestamps: false,
    }
  );

  return CurrentOpening;
};
