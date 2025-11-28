const BACKEND_URL = "http://localhost:4000";

// For aspiredRole.html
const aspiredRoleDisplay = document.getElementById("aspiredRoleDisplay");

// ----------------------------
// Load Aspired Role (General)
// ----------------------------
async function loadAspiredRole() {
  const userId = 1;

  try {
    const res = await fetch(`${BACKEND_URL}/api/aspired-role/${userId}`);
    const data = await res.json();

    if (!data.exists) {
      aspiredRoleDisplay.innerHTML = `
        Not Set —
        <a href="aspiredRole.html" class="text-yellow-400 underline">Set Now</a>
      `;
      return;
    }

    const role = data.data;

    aspiredRoleDisplay.innerHTML = `
      <span class="text-green-400 font-semibold">${role.role}</span><br/>
      <span class="text-sm text-gray-400">
        Goal: ${role.timeFrame} months |
        Technologies: ${role.technologies.join(", ")}
      </span><br/>
      <a href="aspiredRole.html" class="text-yellow-400 underline hover:text-yellow-500">
        Edit
      </a>
    `;
  } catch (err) {
    console.error("Failed to fetch aspired role:", err);
    aspiredRoleDisplay.textContent = "❌ Could not load aspired role";
  }
}

// ----------------------------
// NEW: Compute Match % (Same as careerInsights)
// ----------------------------
function computeMatchPercent(user, required) {
  const u = user.map((s) => s.toLowerCase());
  const r = required.map((s) => s.toLowerCase());

  if (r.length === 0) return 0;

  const matched = r.filter((x) => u.includes(x)).length;
  return Math.round((matched / r.length) * 100);
}

// ----------------------------
// Load Dashboard Data (FIXED)
// ----------------------------
async function loadDashboardAspiredRole() {
  const userId = 1;

  try {
    // 1) Aspired Role
    const aspiredRes = await fetch(`${BACKEND_URL}/api/aspired-role/${userId}`);
    const aspiredData = await aspiredRes.json();
    if (!aspiredData.exists) return;

    const d = aspiredData.data;

    document.getElementById("dashboardRole").textContent = d.role;
    document.getElementById(
      "dashboardTime"
    ).textContent = `${d.timeFrame} months`;
    document.getElementById("dashboardTech").textContent =
      d.technologies.join(", ");

    // ----------------------------------------
    // 2) Insights (same as careerInsights)
    // ----------------------------------------
    const insightsRes = await fetch(
      `${BACKEND_URL}/api/career-insights/${userId}`
    );
    const insights = await insightsRes.json();

    let insightsObj = {};
    if (Array.isArray(insights)) {
      insights.forEach((i) => (insightsObj[i.title] = i.description));
    } else insightsObj = insights;

    const requiredSkills = (insightsObj["Required Skills"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const userSkills = (insightsObj["Your Skills"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const missingSkills = (insightsObj["Missing Skills"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // ----------------------------------------
    // Skill Progress
    // ----------------------------------------
    let skillProgress = 0;
    if (requiredSkills.length > 0) {
      const matched = requiredSkills.filter((rs) =>
        userSkills.map((x) => x.toLowerCase()).includes(rs.toLowerCase())
      ).length;
      skillProgress = Math.round((matched / requiredSkills.length) * 100);
    }
    document.getElementById("skillProgress").textContent = skillProgress + "%";

    // ----------------------------------------
    // Pending Learnings
    // ----------------------------------------
    document.getElementById("pendingCourses").textContent =
      missingSkills.length;

    // ----------------------------------------
    // Matching Projects (≥ 50% match)
    // ----------------------------------------
    const openingsRes = await fetch(`${BACKEND_URL}/api/currentOpenings`);
    const openings = await openingsRes.json();

    let matchingProjects = 0;

    openings.forEach((op) => {
      let req = [];

      // Normalize field names
      if (Array.isArray(op.requiredSkills))
        req = op.requiredSkills.map((s) => s.name || s);
      else if (op.RequiredSkills)
        req = op.RequiredSkills.split(";").map((s) => s.trim());
      else if (op.skills) {
        req = Array.isArray(op.skills)
          ? op.skills.map((s) => s.name || s)
          : op.skills.split(";").map((s) => s.trim());
      } else if (op.skill_list)
        req = op.skill_list.split(",").map((s) => s.trim());

      const pct = computeMatchPercent(userSkills, req);
      if (pct >= 50) matchingProjects++;
    });

    document.getElementById("matchCount").textContent = matchingProjects;
  } catch (err) {
    console.error("Dashboard error:", err);
  }
}
async function loadDashboardStats() {
  const userId = 1;

  try {
    // 1) Load Insights (same data careerInsights uses)
    const insightsRes = await fetch(
      `${BACKEND_URL}/api/career-insights/${userId}`
    );
    const insightsData = await insightsRes.json();

    let map = {};
    if (Array.isArray(insightsData)) {
      insightsData.forEach((i) => (map[i.title] = i.description));
    } else {
      map = insightsData;
    }

    const required = (map["Required Skills"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const userSkills = (map["Your Skills"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const missing = (map["Missing Skills"] || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    // --------------------------------------
    // Skill Progress (same formula in careerInsights)
    // --------------------------------------
    let progress = 0;
    if (required.length > 0) {
      const matched = required.filter((r) =>
        userSkills.map((s) => s.toLowerCase()).includes(r.toLowerCase())
      ).length;
      progress = Math.round((matched / required.length) * 100);
    }

    document.getElementById("skillProgress").textContent = progress + "%";

    // --------------------------------------
    // Pending Learnings = missing skills count
    // --------------------------------------
    document.getElementById("pendingCourses").textContent = missing.length;

    // --------------------------------------
    // Matching Projects (same logic as careerInsights)
    // --------------------------------------
    const openingsRes = await fetch(`${BACKEND_URL}/api/currentOpenings`);
    const openings = await openingsRes.json();

    let count = 0;

    function computeMatch(user, req) {
      const u = user.map((s) => s.toLowerCase());
      const r = req.map((s) => s.toLowerCase());
      if (r.length === 0) return 0;
      const matched = r.filter((x) => u.includes(x)).length;
      return Math.round((matched / r.length) * 100);
    }

    openings.forEach((op) => {
      let req = [];

      if (Array.isArray(op.requiredSkills))
        req = op.requiredSkills.map((s) => s.name || s);
      else if (op.RequiredSkills)
        req = op.RequiredSkills.split(";").map((s) => s.trim());
      else if (op.skills)
        req = Array.isArray(op.skills)
          ? op.skills.map((s) => s.name || s)
          : op.skills.split(";").map((s) => s.trim());

      const pct = computeMatch(userSkills, req);
      if (pct >= 50) count++;
    });

    document.getElementById("matchCount").textContent = count;
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
  }
}

// ----------------------------
// Backend Health Check
// ----------------------------
function checkBackendHealth() {
  fetch(`${BACKEND_URL}/api/health`)
    .then((res) => res.json())
    .then((data) => {
      const el = document.getElementById("backend-status");
      if (el)
        el.textContent = data.ok
          ? "✅ Backend Connected"
          : "❌ Connection Failed";
    })
    .catch(() => {
      const el = document.getElementById("backend-status");
      if (el) el.textContent = "❌ Backend Offline";
    });
}

// ----------------------------
// Initialize
// ----------------------------
window.addEventListener("load", () => {
  loadAspiredRole();
  loadDashboardAspiredRole();
  loadDashboardStats();
  checkBackendHealth();
});
