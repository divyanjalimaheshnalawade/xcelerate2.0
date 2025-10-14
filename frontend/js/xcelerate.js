const BACKEND_URL = "http://localhost:4000"; // backend is on port 4000

const aspiredRoleDisplay = document.getElementById("aspiredRoleDisplay");

async function loadAspiredRole() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/aspired-role`);
    const data = await res.json();

    if (res.ok && data && data.role) {
      aspiredRoleDisplay.innerHTML = `
        <span class="text-green-400 font-semibold">${data.role}</span><br/>
        <span class="text-sm text-gray-400">
          Goal: ${
            data.timeFrame
          } months | Technologies: ${data.technologies.join(", ")}
        </span><br/>
        <a href="aspiredRole.html" class="text-yellow-400 underline hover:text-yellow-500">
          Edit
        </a>
      `;
    } else {
      aspiredRoleDisplay.innerHTML = `
        Not Set —
        <a href="aspiredRole.html" class="text-yellow-400 underline hover:text-yellow-500">
          Set Now
        </a>
      `;
    }
  } catch (err) {
    console.error("Failed to fetch aspired role:", err);
    if (aspiredRoleDisplay)
      aspiredRoleDisplay.textContent = "❌ Could not load aspired role";
  }
}

// ----------------------------
// Backend health check
// ----------------------------
function checkBackendHealth() {
  fetch(`${BACKEND_URL}/api/health`)
    .then((res) => res.json())
    .then((data) => {
      const statusEl = document.getElementById("backend-status");
      if (statusEl) {
        statusEl.textContent = data.ok
          ? "✅ Backend Connected"
          : "❌ Connection Failed";
      }
    })
    .catch((err) => {
      console.error("Backend not reachable:", err);
      const statusEl = document.getElementById("backend-status");
      if (statusEl) {
        statusEl.textContent = "❌ Backend Offline";
      }
    });
}

// ----------------------------
// Dummy data for dashboard stats
// ----------------------------
function loadDashboardStats() {
  const matchCount = document.getElementById("matchCount");
  const skillProgress = document.getElementById("skillProgress");
  const pendingCourses = document.getElementById("pendingCourses");

  if (matchCount && skillProgress && pendingCourses) {
    matchCount.textContent = Math.floor(Math.random() * 10) + 1;
    skillProgress.textContent = `${Math.floor(Math.random() * 100)}%`;
    pendingCourses.textContent = Math.floor(Math.random() * 5);
  }
}

// ----------------------------
// Initialize on window load
// ----------------------------
window.addEventListener("load", () => {
  loadAspiredRole();
  loadDashboardStats();
  checkBackendHealth();
});
