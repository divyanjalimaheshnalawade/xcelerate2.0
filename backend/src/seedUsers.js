// backend/src/seedUsers.js
const { sequelize, User, Skill } = require("./models");

async function seedUsers() {
  try {
    await sequelize.sync();

    const [user, created] = await User.findOrCreate({
      where: { email: "divya@example.com" },
      defaults: {
        name: "Divyanjali Nalawade",
        password: "password123", // bcrypt will hash automatically
        aspired_role: "Full Stack Developer",
        current_skills: ["HTML", "CSS", "JavaScript", "React"],
      },
    });

    console.log("✅ User seeded:", user.name);
    process.exit(0);
  } catch (err) {
    console.error("❌ seedUsers error:", err);
    process.exit(1);
  }
}

seedUsers();
