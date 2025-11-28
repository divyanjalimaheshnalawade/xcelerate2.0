async function loadInsights() {
  const container = document.getElementById("insightsContainer");
  const userId = localStorage.getItem("userId") || 1;

  try {
    const res = await fetch(
      `http://localhost:4000/api/career-insights/${userId}`
    );
    const data = await res.json();

    container.innerHTML = "";

    if (!data || data.exists === false) {
      container.innerHTML = "<p class='text-red-400'>No insights available</p>";
      return;
    }

    data.forEach((insight) => {
      const div = document.createElement("div");
      div.className = "bg-[#2b2b2b] p-4 rounded-lg shadow-md";

      div.innerHTML = `
        <h2 class="font-semibold text-lg mb-2">${insight.title}</h2>
        <p class="text-gray-400 text-sm">${insight.description}</p>
      `;

      container.appendChild(div);
    });
  } catch (err) {
    console.error("Failed to load insights:", err);
    container.innerHTML = "<p class='text-red-400'>Unable to load insights</p>";
  }
}

window.addEventListener("load", loadInsights);
