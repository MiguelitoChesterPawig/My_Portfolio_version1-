/* Builds scripts/cv/cv.html (a one page CV).
   Name, links, education and skills come from src/content/profile.ts.
   Projects and work text are written here in short, simple English so the CV fits on one page.
   1. Run:  node scripts/cv/build-cv.mjs
   2. Open scripts/cv/cv.html in Chrome, Ctrl+P, "Save as PDF", Paper A4, Margins "Default",
      tick "Background graphics", save over public/curriculum-vitae.pdf */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as content from "../../src/content/profile.ts";

const here = dirname(fileURLToPath(import.meta.url));
const { profile, skillGroups, education } = content;

// ---- extra CV-only details (not shown on the website) ----
// Fill these in and rebuild; empty ones are simply left out of the CV.
const personal = {
  birthDate: "", // e.g. "March 15, 2003"
  gender: "",
  civilStatus: "",
  nationality: "",
  languages: "",
};

const objective = `4th year BS Information Technology student and full scholar, looking for an internship, OJT or
junior job in IT. I have used PHP and MySQL in school projects and I plan systems with flowcharts, DFDs and ERDs.
I am not limited to back-end work. I am open to front-end, mobile, IT support or other roles, and I love exploring
new things as I learn. As a working student, I am hardworking and always ready to learn.`;

const projects = [
  {
    name: "TechWorld (ETPCP-AI)",
    period: "Jan 2026 - Present",
    role: "Lead Programmer, Systems Analyst, Back-end Developer",
    tech: "PHP, MySQL, JavaScript, HTML/CSS",
    points: [
      "An online store for computer parts with AI product suggestions and QR code order pickup.",
      "Planned the system flow, business rules and DFDs before we started coding.",
      "Added OTP email checking when users sign up.",
      "Nominated for Best Capstone (Oct 2026). Tested by 37 people, including 5 IT experts.",
    ],
  },
  {
    name: "Student Concern Management System",
    period: "2026",
    role: "Team Member (CTRL+ALT+DEFEAT)",
    tech: "PHP, MySQL, Tailwind CSS, Hugging Face API",
    points: [
      "A website where students send concerns and track them with a code.",
      "Uses AI to send each concern to the right office, where staff work on it until it is solved.",
    ],
  },
  {
    name: "Don't Blame The Kids (Apparel Shop App)",
    period: "2025",
    role: "Developer",
    tech: "Flutter, Dart, Firebase",
    points: [
      "A phone shopping app: browse clothes, pick sizes, use a cart and wishlist, and pay with GCash or card.",
      "The admin can add products, update orders and chat with customers live.",
    ],
  },
];

const experience = [
  {
    role: "Computer Shop Attendant (Freelance)",
    org: "M&M Secret Computer Shop",
    period: "Oct 2025 - Jul 2026",
    points: [
      "Fixed common hardware and software problems on my own.",
      "Checked the computers and reported server problems to the owner.",
    ],
  },
  {
    role: "Party Host, Clown and Face Painter (Freelance)",
    org: "PotPot Clowns, Zia's Clown and other agencies",
    period: "2015 - Present",
    points: [
      "Host and perform at kids' parties and events.",
      "Do face and body painting based on what clients want.",
    ],
  },
  {
    role: "Assistant (Freelance)",
    org: "Poor Boiz Auto Repair",
    period: "2020 - 2023",
    points: ["Helped with car painting, bumper and roof repairs.", "Kept materials organized and helped customers."],
  },
];

// Certificates and seminars. "note" shows in normal text after the name.
const training = [
  {
    name: "Python Essentials 1 and 2",
    note: "Cisco Networking Academy and OpenEDG Python Institute",
    period: "Nov 2024",
  },
  {
    name: "ASEAN Data Science Explorers Seminar",
    note: "Break The Fake Movement, at GRC",
    period: "Jul 2026",
  },
];

// References (from the old CV). Leave phone empty to show "Available upon request".
const references = [
  { name: "Mr. Domingo Tanael", role: "IT Head, Global Reciprocal Colleges", phone: "" },
  { name: "Ms. Jean Ysobel Turno", role: "Manager, PotPot Clowns", phone: "+63 926 879 8199" },
];

// ----------------------------------------------------------------
// plain() swaps long dashes and special symbols for simple ones, so the CV has no long dashes.
const plain = (s) =>
  String(s)
    .replace(/\s*[—–]\s*/g, " - ")
    .replace(/\s*·\s*/g, ", ")
    .replace(/→/g, ", ");
const esc = (s) => plain(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const real = (s) => s && !/\[.*\]/.test(s); // skip unfinished [placeholders]
const url = (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// [label, shown text, link]. LinkedIn shows the name (the long URL does not fit beside the photo); it stays clickable in the PDF.
const contact = [
  ["Location", profile.location, ""],
  ["LinkedIn", profile.links.linkedin && profile.name, profile.links.linkedin],
  ["Email", profile.links.email, `mailto:${profile.links.email}`],
  ["GitHub", profile.links.github && url(profile.links.github), profile.links.github],
  ["Phone", profile.links.phone, profile.links.phone && `tel:+63${profile.links.phone.replace(/D/g, "").replace(/^0/, "")}`],
].filter(([, v]) => real(v));

const personalRows = [
  ["Date of Birth", personal.birthDate],
  ["Gender", personal.gender],
  ["Civil Status", personal.civilStatus],
  ["Nationality", personal.nationality],
  ["Language", personal.languages],
].filter(([, v]) => real(v));

const section = (title, body) => `<section><h2>${title}</h2>${body}</section>`;
const entry = ({ left, right, sub, extra = "" }) => `
  <div class="entry">
    <div class="row"><strong>${left}</strong><strong class="date">${right}</strong></div>
    ${sub ? `<div class="sub">${sub}</div>` : ""}
    ${extra}
  </div>`;
const bullets = (items) => `<ul>${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`;

const educationHtml = education
  .map((e) =>
    entry({
      left: esc(e.detail ? `${e.level}: ${e.detail}` : e.level) +
        `<span class="school">, ${esc(e.school)}${e.honor ? ` (<em>Scholar, MLALAF</em>)` : ""}</span>`,
      right: esc(e.period),
    }),
  )
  .join("");

const projectHtml = projects
  .map((p) =>
    entry({
      left: esc(p.name),
      right: esc(p.period),
      sub: `<em>${esc(p.role)}</em> &nbsp;|&nbsp; ${esc(p.tech)}`,
      extra: bullets(p.points),
    }),
  )
  .join("");

const experienceHtml = experience
  .map((x) => entry({ left: esc(x.role), right: esc(x.period), sub: esc(x.org), extra: bullets(x.points) }))
  .join("");

const trainingHtml = training
  .map((t) => entry({ left: `${esc(t.name)}<span class="school">, ${esc(t.note)}</span>`, right: esc(t.period) }))
  .join("");

// signature.png: transparent signature (made from the scanned e-signature)
const signature = "data:image/png;base64," + readFileSync(join(here, "signature.png")).toString("base64");

const referencesHtml = `<div class="refs">${references
  .map((r) => `<div><strong>${esc(r.name)}</strong><br>${esc(r.role)}<br>Phone: ${esc(r.phone || "Available upon request")}</div>`)
  .join("")}<div class="sign"><img class="sig" src="${signature}" alt=""><strong>${esc(profile.name)}</strong>Applicant</div>
<p class="certify">I certify that all the information in this CV is true and correct.</p></div>`;

const skillsHtml = `<table class="skills">${skillGroups
  .map((g) => `<tr><td class="k">${esc(g.name)}:</td><td>${esc(g.skills.map((s) => s.name).join(", "))}</td></tr>`)
  .join("")}</table>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(profile.name)} CV</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/font/Serif/cmun-serif.css">
<style>
  @page { size: A4; margin: 10mm 15mm 9mm; }
  /* on screen, lay out at the same width as the printed page (so the fit script measures right) */
  @media screen { body { width: 180mm; margin: 10mm auto; } }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: "Computer Modern Serif", "CMU Serif", "Latin Modern Roman", Georgia, serif;
         font-size: 10pt; line-height: 1.18; color: #111; }
  /* photo sits inside the header, fully above the line before Objective */
  header { display: flex; justify-content: space-between; align-items: stretch; gap: 6mm;
           padding-bottom: 2mm; border-bottom: 0.6pt solid #222; }
  .head-text { display: flex; flex-direction: column; justify-content: flex-start; } /* contact right under the name */
  a { color: inherit; text-decoration: none; }
  h1 { font-size: 18pt; letter-spacing: 0.06em; margin: 0 0 2mm; font-weight: bold; text-transform: uppercase; }
  .contact { font-size: 9.5pt; display: grid; grid-template-rows: repeat(3, auto); grid-auto-flow: column; gap: 0.3mm 5mm; justify-content: start; white-space: nowrap; }
  .school { font-weight: normal; }
  .photo { width: 38mm; height: 38mm; flex-shrink: 0; object-fit: cover; object-position: center 22%; }
  section { margin-top: 2mm; }
  h2 { font-size: 12pt; font-weight: bold; margin: 0 0 1.2mm; padding-bottom: 0.5mm; border-bottom: 0.5pt solid #222; }
  p { margin: 0; text-align: justify; }
  .entry { margin-bottom: 1.2mm; break-inside: avoid; }
  .row { display: flex; justify-content: space-between; gap: 6mm; }
  .date { white-space: nowrap; }
  .sub { margin-top: 0.2mm; }
  ul { margin: 0.6mm 0 0; padding-left: 5.5mm; }
  li { margin: 0; }
  table { border-collapse: collapse; }
  .info td { padding: 0.3mm 0; vertical-align: top; }
  .info td:first-child { width: 40mm; }
  .skills td { padding: 0.3mm 0; vertical-align: top; }
  .skills .k { width: 42mm; font-weight: bold; padding-right: 3mm; }
  .refs { display: grid; grid-template-columns: 1fr 1fr 68mm; grid-template-rows: auto 1fr; column-gap: 6mm; align-items: start; }
  .certify { grid-column: 1 / 3; grid-row: 2; align-self: end; font-size: 9pt; text-align: left; }
  .end { margin-top: 2.5mm; display: flex; justify-content: space-between; align-items: flex-end; gap: 10mm; break-inside: avoid; }
  .end p { font-size: 9pt; text-align: left; }
  /* signature: spans both rows and starts lower, so it hangs below the reference text */
  .sign { grid-column: 3; grid-row: 1 / 3; text-align: center; padding-top: 9mm; }
  .sig { display: block; height: 14mm; margin: 0 auto -1mm; }
  .sign strong { display: block; white-space: nowrap; letter-spacing: 0.03em; text-transform: uppercase; border-top: 0.5pt solid #222; padding-top: 1mm; }
</style>
<script>
  /* Auto-fit: if the CV is taller than one A4 page (297mm minus the 19mm top+bottom margins),
     shrink everything evenly until it fits. Never shrinks below 85%. */
  addEventListener("load", async () => {
    await document.fonts.ready;
    const mm = 96 / 25.4, avail = (297 - 19 - 6) * mm; // keep ~6mm free at the bottom
    for (let z = 1; z >= 0.85; z -= 0.01) {
      document.body.style.zoom = z.toFixed(2);
      if (document.body.getBoundingClientRect().height <= avail) break; // height already includes the zoom
    }
  });
</script></head>
<body>
<header>
  <div class="head-text">
    <h1>${esc(profile.name)}</h1>
    <div class="contact">${contact.map(([k, v, href]) => `<span>${k}: ${href ? `<a href="${esc(href)}">${esc(v)}</a>` : esc(v)}</span>`).join("")}</div>
  </div>
  <img class="photo" src="../../public${profile.photo}" alt="">
</header>

${section("Objective", `<p>${esc(objective.replace(/\s*\n\s*/g, " "))}</p>`)}
${personalRows.length ? section("Personal Information", `<table class="info">${personalRows.map(([k, v]) => `<tr><td>${k}:</td><td>${esc(v)}</td></tr>`).join("")}</table>`) : ""}
${section("Education", educationHtml)}
${section("Projects", projectHtml)}
${section("Work Experience", experienceHtml)}
${section("Certificates and Seminars", trainingHtml)}
${section("Skills", skillsHtml)}
${section("References", referencesHtml)}

</body></html>`;

writeFileSync(join(here, "cv.html"), html);
console.log("wrote scripts/cv/cv.html");
