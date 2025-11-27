const { sequelize, Skill } = require("./models");

async function seedSkills() {
  try {
    await sequelize.sync();

    const skills = [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Node.js",
      "SQL",
      "MongoDB",
      "Docker",
      "Git",
      "Kubernetes",
    ];

    for (let name of skills) {
      await Skill.findOrCreate({ where: { name } });
    }

    console.log("✅ Skills seeded");
    process.exit(0);
  } catch (err) {
    console.error("❌ seedSkills error:", err);
    process.exit(1);
  }
}

seedSkills();
