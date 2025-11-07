// backend/src/utils/syncDB.js
const { sequelize } = require("../models");

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("✅ Database synchronized successfully");
    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error syncing database:", err);
    process.exit(1);
  });
