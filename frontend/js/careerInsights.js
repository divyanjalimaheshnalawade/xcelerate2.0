const insights = [
  {
    title: "Top In-Demand Roles 2025",
    detail: "AI Engineers, Cloud Architects, Cybersecurity Experts",
  },
  {
    title: "Skills with Highest Growth",
    detail: "Python, React, Data Analytics",
  },
  {
    title: "Recommended Certifications",
    detail: "AWS, Azure, TensorFlow Developer",
  },
];

const container = document.getElementById("insightContainer");
insights.forEach((i) => {
  const div = document.createElement("div");
  div.className = "bg-[#2b2b2b] p-5 rounded-xl shadow-md";
  div.innerHTML = `
    <h3 class="text-yellow-400 text-lg font-semibold">${i.title}</h3>
    <p class="text-gray-300 mt-2">${i.detail}</p>`;
  container.appendChild(div);
});
