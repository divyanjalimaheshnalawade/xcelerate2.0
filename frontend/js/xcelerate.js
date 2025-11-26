// ======================================================
// XCELERATE — SHARED FRONTEND SCRIPT
// Loaded on ALL pages
// ======================================================

// ------------------------------------------------------
// Backend URL (adjust for deployment later)
// ------------------------------------------------------
const BACKEND_URL = "http://localhost:4000";

// ------------------------------------------------------
// 1. Active Sidebar Link Highlighting
// ------------------------------------------------------
function activateSidebarLinks() {
  const currentPage = window.location.pathname.split("/").pop(); // e.g. "careerInsights.html"
  const links = document.querySelectorAll(".sidebar a");

  links.forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("bg-gray-700", "text-yellow-300", "font-semibold");
    } else {
      link.classList.remove("bg-gray-700", "text-yellow-300", "font-semibold");
    }
  });
}

// ------------------------------------------------------
// 2. Load Aspired Role (Dashboard Only)
// ------------------------------------------------------
async function loadAspiredRole() {
  const aspiredRoleDisplay = document.getElementById("aspiredRoleDisplay");
  if (!aspiredRoleDisplay) return; // Prevent errors on pages without it

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
    aspiredRoleDisplay.textContent = "❌ Could not load aspired role";
  }
}

// ------------------------------------------------------
// 3. Backend Health Indicator
// ------------------------------------------------------
function checkBackendHealth() {
  const statusEl = document.getElementById("backend-status");
  if (!statusEl) return; // Skip if element does not exist

  fetch(`${BACKEND_URL}/api/health`)
    .then((res) => res.json())
    .then((data) => {
      statusEl.textContent = data.ok
        ? "✅ Backend Connected"
        : "❌ Connection Failed";
    })
    .catch(() => {
      statusEl.textContent = "❌ Backend Offline";
    });
}

// ------------------------------------------------------
// 4. Initialize on page load
// ------------------------------------------------------
window.addEventListener("DOMContentLoaded", () => {
  activateSidebarLinks();
  loadAspiredRole();
  checkBackendHealth();
});
