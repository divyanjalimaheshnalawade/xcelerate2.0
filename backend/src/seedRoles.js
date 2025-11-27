const { sequelize, Role, Skill } = require("./models");

async function seedRoles() {
  try {
    await sequelize.sync();

    const roleData = {
      "Full Stack Developer": ["JavaScript", "React", "Node.js", "SQL"],
      "Frontend Developer": ["HTML", "CSS", "JavaScript", "React"],
      "Cloud Engineer": ["AWS", "Linux", "Docker", "Kubernetes"],
    };

    for (const [roleName, skills] of Object.entries(roleData)) {
      const [role] = await Role.findOrCreate({ where: { title: roleName } });

      const skillRecords = await Promise.all(
        skills.map((name) => Skill.findOrCreate({ where: { name } }))
      );

      await role.addRequiredSkills(skillRecords.map((s) => s[0]));
    }

    console.log("✅ Roles + Required Skills Seeded");
    process.exit(0);
  } catch (err) {
    console.error("❌ seedRoles error:", err);
    process.exit(1);
  }
}

seedRoles();
