module.exports = (sequelize, DataTypes) => {
  const AspiredRole = sequelize.define(
    "AspiredRole",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id", // maps to DB
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      timeFrame: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "timeframe", // maps to DB
      },
      technologies: {
        type: DataTypes.TEXT,
      },
      matchPercentage: {
        type: DataTypes.INTEGER,
        field: "match_percentage", // NEW COLUMN NEEDED
      },
    },
    {
      tableName: "aspired_roles",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return AspiredRole;
};
