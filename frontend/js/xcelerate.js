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

    const role = data.data; // ⭐ important

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
// Load Aspired Role (Dashboard)
// ----------------------------
async function loadDashboardAspiredRole() {
  const userId = 1;

  try {
    const res = await fetch(`${BACKEND_URL}/api/aspired-role/${userId}`);
    const data = await res.json();

    if (!data.exists) return;

    const d = data.data; // ⭐ important

    document.getElementById("dashboardRole").textContent = d.role;
    document.getElementById("dashboardTime").textContent =
      d.timeFrame + " months";
    document.getElementById("dashboardTech").textContent =
      d.technologies.join(", ");

    // match percentage
    if (document.getElementById("matchCount")) {
      document.getElementById("matchCount").textContent = d.matchPercentage;
    }
  } catch (err) {
    console.error("Dashboard error:", err);
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
  loadAspiredRole(); // for aspiredRole.html
  loadDashboardAspiredRole(); // for dashboard
  checkBackendHealth();
});
