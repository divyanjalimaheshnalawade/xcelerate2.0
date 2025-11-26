// backend/src/seedRoles.js
const { sequelize, Role, Skill } = require("./models");

async function seed() {
  try {
    await sequelize.sync(); // safe - won't drop by default
    // create skills (if not exists)
    const [js] = await Skill.findOrCreate({ where: { name: "JavaScript" } });
    const [react] = await Skill.findOrCreate({ where: { name: "React" } });
    const [node] = await Skill.findOrCreate({ where: { name: "Node.js" } });
    const [kube] = await Skill.findOrCreate({ where: { name: "Kubernetes" } });
    // create role
    const [fullstack] = await Role.findOrCreate({
      where: { title: "Full Stack Developer" },
    });
    // associate (through RoleSkills)
    await fullstack.addRequiredSkills([js, react, node, kube]);
    console.log("✅ Seeded Full Stack Developer + skills");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}
seed();
