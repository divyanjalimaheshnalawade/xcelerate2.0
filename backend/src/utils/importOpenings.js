const xlsx = require("xlsx");
const { sequelize, CurrentOpening } = require("../models");

async function importOpenings() {
  try {
    const workbook = xlsx.readFile("currentOpenings.xlsx");
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    function parseDate(d) {
      if (!d) return null;

      if (d instanceof Date) return d;

      if (typeof d === "number") {
        const excelEpoch = new Date(Date.UTC(1899, 11, 30));
        return new Date(excelEpoch.getTime() + d * 86400000);
      }

      if (typeof d === "string") {
        const parts = d.split(/[-/]/);
        if (parts.length === 3) {
          const [p1, p2, p3] = parts.map((p) => p.padStart(2, "0"));
          if (p1.length === 4) return new Date(`${p1}-${p2}-${p3}`);
          return new Date(`${p3}-${p2}-${p1}`);
        }
        const parsed = new Date(d);
        return isNaN(parsed) ? null : parsed;
      }

      return null;
    }

    const formattedData = data.map((row) => {
      const postedDate = parseDate(row.PostedDate) || new Date();
      const deadline = parseDate(row.ApplicationDeadline);

      return {
        position_id: row.PositionID,
        title: row.Title,
        department: row.Department,
        location: row.Location,
        experience: row.Experience,
        skills_required: row.SkillsRequired,
        description: row.Description,
        posted_date: postedDate.toISOString(),
        application_deadline: deadline ? deadline.toISOString() : null,
      };
    });

    await sequelize.sync();
    await CurrentOpening.destroy({ where: {} });
    await CurrentOpening.bulkCreate(formattedData);

    console.log("✅ Current openings imported successfully!");
    process.exit();
  } catch (err) {
    console.error("❌ Error importing data:", err);
  }
}

importOpenings();
