const express = require("express");
const router = express.Router();

// Static backend data for career streams
const careerStreams = [
  {
    stream: "Software Development",
    description: "Frontend, Backend, Full Stack, Mobile Development",
    roles: [
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Engineer",
      "Mobile Developer",
    ],
    skillsRequired: [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "Git",
      "REST APIs",
    ],
  },
  {
    stream: "Data & Analytics",
    description: "Data Science, Machine Learning, BI, Data Engineering",
    roles: ["Data Scientist", "Data Engineer", "BI Analyst", "ML Engineer"],
    skillsRequired: [
      "Python",
      "SQL",
      "Power BI / Tableau",
      "Pandas",
      "NumPy",
      "TensorFlow",
      "Data Visualization",
    ],
  },
  {
    stream: "Cloud & DevOps",
    description: "AWS, Azure, GCP, CI/CD pipelines, Infrastructure as Code",
    roles: ["Cloud Engineer", "DevOps Engineer", "Site Reliability Engineer"],
    skillsRequired: [
      "AWS / Azure / GCP",
      "Docker",
      "Kubernetes",
      "CI/CD",
      "Terraform",
      "Linux",
      "Monitoring Tools (Prometheus, Grafana)",
    ],
  },
  {
    stream: "Cybersecurity",
    description: "Network Security, Ethical Hacking, Cloud Security",
    roles: ["Security Analyst", "Ethical Hacker", "Cybersecurity Consultant"],
    skillsRequired: [
      "Network Security",
      "Firewalls",
      "Penetration Testing",
      "SIEM Tools",
      "Cryptography",
      "Incident Response",
    ],
  },
  {
    stream: "UI/UX & Design",
    description: "Design Thinking, Prototyping, User Research, Figma",
    roles: ["UX Designer", "UI Designer", "Product Designer"],
    skillsRequired: [
      "Figma",
      "Adobe XD",
      "User Research",
      "Wireframing",
      "Prototyping",
      "Accessibility Design",
    ],
  },
  {
    stream: "Project Management",
    description: "Agile, Scrum, Product Ownership, Leadership Skills",
    roles: ["Project Manager", "Scrum Master", "Product Owner"],
    skillsRequired: [
      "Agile / Scrum",
      "Risk Management",
      "Communication",
      "Leadership",
      "JIRA / Trello",
      "Stakeholder Management",
    ],
  },
  {
    stream: "Quality Assurance & Testing",
    description: "Automation, Manual Testing, Performance Testing, QA Tools",
    roles: ["QA Engineer", "Automation Tester", "Test Lead"],
    skillsRequired: [
      "Selenium",
      "Postman",
      "JMeter",
      "Cypress",
      "Test Planning",
      "Bug Tracking",
    ],
  },
  {
    stream: "Artificial Intelligence",
    description: "Deep Learning, NLP, Computer Vision, AI Research",
    roles: ["AI Engineer", "Research Scientist", "ML Engineer"],
    skillsRequired: [
      "Python",
      "TensorFlow",
      "PyTorch",
      "NLP",
      "Deep Learning",
      "Data Preprocessing",
    ],
  },
  {
    stream: "Business Analysis",
    description:
      "Requirements Gathering, Stakeholder Communication, Documentation",
    roles: ["Business Analyst", "Process Analyst", "Consultant"],
    skillsRequired: [
      "MS Excel",
      "Requirement Analysis",
      "Communication",
      "Documentation",
      "SQL",
      "Analytical Thinking",
    ],
  },
];

// API endpoint
router.get("/", (req, res) => {
  res.json(careerStreams);
});

module.exports = router;
