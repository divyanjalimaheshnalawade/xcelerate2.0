document.getElementById("aspireForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const role = document.getElementById("role").value.trim();
  const duration = document.getElementById("duration").value.trim();

  if (!role || !duration) {
    alert("Please fill in all fields.");
    return;
  }

  localStorage.setItem("aspiredRole", JSON.stringify({ role, duration }));

  const msg = document.getElementById("saveMsg");
  msg.classList.remove("hidden");
  setTimeout(() => msg.classList.add("hidden"), 3000);
});
