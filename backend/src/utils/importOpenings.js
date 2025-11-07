const xlsx = require("xlsx");
const { sequelize } = require("../models");
const CurrentOpening = require("../models/currentOpening")(sequelize);

async function importOpenings() {
  try {
    const workbook = xlsx.readFile("currentOpenings.xlsx");
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const formattedData = data.map((row) => ({
      position_id: row.PositionID,
      title: row.Title,
      department: row.Department,
      location: row.Location,
      experience: row.Experience,
      skills_required: row.SkillsRequired,
      description: row.Description,
      posted_date: new Date(row.PostedDate),
      application_deadline: new Date(row.ApplicationDeadline),
    }));

    await sequelize.sync();
    await CurrentOpening.bulkCreate(formattedData);

    console.log("✅ Current openings imported successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error importing data:", err);
  }
}

importOpenings();
