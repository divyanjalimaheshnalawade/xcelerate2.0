form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const role = document.getElementById("role").value;
  const timeFrame = document.getElementById("timeFrame").value;
  const techSelect = document.getElementById("technologies");
  const selectedTechs = Array.from(techSelect.selectedOptions).map(
    (opt) => opt.value
  );
  const message = document.getElementById("message");

  if (selectedTechs.length < 5 || selectedTechs.length > 7) {
    document.getElementById("techWarning").classList.remove("hidden");
    return;
  } else {
    document.getElementById("techWarning").classList.add("hidden");
  }

  const data = { role, timeFrame, technologies: selectedTechs };

  try {
    const res = await fetch("http://localhost:4000/api/aspired-role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      message.textContent = "Aspired Role saved successfully!";
      form.reset();
    } else {
      message.textContent = result.error || "Failed to save!";
    }
  } catch (err) {
    console.error(err);
    message.textContent = "Server error!";
  }
});
