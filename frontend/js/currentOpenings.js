const openings = [
  {
    title: "React Developer",
    skills: "React, JS, API Integration",
    duration: "6 Months",
  },
  { title: "Data Engineer", skills: "Python, SQL, ETL", duration: "9 Months" },
  {
    title: "AI Analyst",
    skills: "Machine Learning, Python",
    duration: "12 Months",
  },
];

const container = document.getElementById("openingsContainer");
openings.forEach((job) => {
  const div = document.createElement("div");
  div.className = "bg-[#2b2b2b] p-6 rounded-xl shadow-md hover:bg-[#323232]";
  div.innerHTML = `
    <h3 class="text-lg font-semibold text-yellow-400">${job.title}</h3>
    <p class="text-gray-300 mt-1">Skills: ${job.skills}</p>
    <p class="text-gray-400 text-sm mb-3">Duration: ${job.duration}</p>
    <button class="bg-yellow-400 text-black font-semibold px-3 py-1 rounded hover:bg-yellow-500">
      Apply
    </button>`;
  container.appendChild(div);
});
