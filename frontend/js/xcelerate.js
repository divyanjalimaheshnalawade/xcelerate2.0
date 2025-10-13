// Load saved aspired role from localStorage
const aspiredData = JSON.parse(localStorage.getItem("aspiredRole"));
const aspiredRoleDisplay = document.getElementById("aspiredRoleDisplay");

if (aspiredData) {
  aspiredRoleDisplay.textContent = `${aspiredData.role} (Goal: ${aspiredData.duration})`;
  aspiredRoleDisplay.classList.add("text-green-400");
}

// Dummy data for dashboard stats
const matchCount = document.getElementById("matchCount");
const skillProgress = document.getElementById("skillProgress");
const pendingCourses = document.getElementById("pendingCourses");

// Simulated dashboard update
function loadDashboardStats() {
  const randomMatches = Math.floor(Math.random() * 10) + 1;
  const randomProgress = Math.floor(Math.random() * 100);
  const randomPending = Math.floor(Math.random() * 5);

  matchCount.textContent = randomMatches;
  skillProgress.textContent = `${randomProgress}%`;
  pendingCourses.textContent = randomPending;
}

window.addEventListener("load", loadDashboardStats);
