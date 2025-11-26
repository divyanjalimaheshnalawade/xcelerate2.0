// backend/services/matching.js
function computeMatch(employeeSkills, requiredSkills) {
  const empSet = new Set(employeeSkills.map((s) => s.toLowerCase()));
  const reqLower = requiredSkills.map((s) => s.toLowerCase());
  const matched = reqLower.filter((r) => empSet.has(r));
  const missing = reqLower.filter((r) => !empSet.has(r));
  const matchPct = reqLower.length
    ? Math.round((matched.length / reqLower.length) * 100)
    : 100;
  return { matchPct, matched, missing };
}

function generateRoadmap(missingSkills) {
  const sampleResources = {
    javascript: [
      {
        title: "JavaScript Fundamentals",
        url: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript",
      },
      {
        title: "FreeCodeCamp JS Course",
        url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/",
      },
    ],
    sql: [
      {
        title: "SQL Basics by W3Schools",
        url: "https://www.w3schools.com/sql/",
      },
      {
        title: "Kaggle SQL Tutorial",
        url: "https://www.kaggle.com/learn/intro-to-sql",
      },
    ],
    react: [
      { title: "React Official Docs", url: "https://react.dev/learn" },
      {
        title: "React Crash Course",
        url: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
      },
    ],
    "node.js": [
      {
        title: "Node.js Crash Course",
        url: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
      },
      { title: "Node.js Guide", url: "https://nodejs.dev/en/learn/" },
    ],
  };

  return missingSkills.map((skill) => ({
    skill,
    priority: 3,
    estimatedHours: 10,
    suggestedResources: sampleResources[skill.toLowerCase()] || [
      {
        title: "Google this skill for best resources",
        url: "https://google.com",
      },
    ],
  }));
}

module.exports = { computeMatch, generateRoadmap };
