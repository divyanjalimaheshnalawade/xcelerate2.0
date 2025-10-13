const streams = [
  { name: "AI & ML", desc: "Deep learning, NLP, data analytics" },
  { name: "Full Stack Development", desc: "Frontend + Backend proficiency" },
  { name: "Cloud Engineering", desc: "AWS, Azure, CI/CD pipelines" },
];

const container = document.getElementById("streamContainer");
streams.forEach((s) => {
  const card = document.createElement("div");
  card.className = "bg-[#2b2b2b] p-6 rounded-xl shadow-md hover:bg-[#323232]";
  card.innerHTML = `
    <h3 class="text-lg font-semibold text-yellow-400">${s.name}</h3>
    <p class="text-gray-300 mt-2">${s.desc}</p>`;
  container.appendChild(card);
});
