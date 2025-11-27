const { sequelize, Project, Skill } = require("./models");

async function seedProjects() {
  try {
    await sequelize.sync();

    const projects = [
      {
        title: "Employee Portal Dashboard",
        required: ["JavaScript", "React", "CSS"],
      },
      {
        title: "Billing Automation",
        required: ["Node.js", "SQL"],
      },
      {
        title: "Cloud Migration",
        required: ["AWS", "Docker", "Kubernetes"],
      },
    ];

    for (const project of projects) {
      const [proj] = await Project.findOrCreate({
        where: { title: project.title },
      });

      const skills = await Promise.all(
        project.required.map((name) => Skill.findOrCreate({ where: { name } }))
      );

      await proj.setRequiredSkills(skills.map((s) => s[0]));
    }

    console.log("✅ Seeded Projects + required skills");
    process.exit(0);
  } catch (err) {
    console.error("❌ seedProjects error:", err);
    process.exit(1);
  }
}

seedProjects();
