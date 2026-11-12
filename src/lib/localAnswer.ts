import { profile, skillGroups, projects, experience, education, certificates } from "@/content/profile";

/* Offline answers — used when no AI key is set (or the AI fails).
   It matches keywords in the question to info from profile.ts. */

const real = (s: string) => !/\[.*\]/.test(s); // skip [placeholders]
const list = (items: string[]) => items.filter(real).join(", ");
const n = profile.shortName;

const topics: { keys: string[]; answer: () => string }[] = [
  {
    keys: ["techworld", "etpcp", "capstone", "e-commerce", "ecommerce"],
    answer: () => {
      const p = projects.find((x) => x.featured)!;
      return `${p.name}: ${p.solution} ${n} worked as ${p.role}. Key features: ${list(p.features.slice(0, 4))}. Built with ${list(p.tech)}.`;
    },
  },
  {
    keys: ["project", "built", "build", "portfolio", "work on", "made"],
    answer: () => {
      const names = projects.map((p) => p.name).filter(real);
      return `${n}'s projects include ${names.join(", ")}. The main one is ${names[0]}. Check the Projects section for screenshots and details.`;
    },
  },
  {
    keys: ["skill", "language", "strong", "good at", "know", "stack", "tech", "programming"],
    answer: () => {
      const strong = skillGroups.flatMap((g) => g.skills).filter((s) => s.level >= 3).map((s) => s.name);
      return `${n}'s strongest skills are ${list(strong)}. He focuses on back-end logic and systems analysis, and is still growing in ${list(
        skillGroups.flatMap((g) => g.skills).filter((s) => s.level <= 2).map((s) => s.name).slice(0, 4),
      )}.`;
    },
  },
  {
    keys: ["flowchart", "analys", "diagram", "erd", "dfd", "system flow"],
    answer: () =>
      `Systems analysis is one of ${n}'s favorite parts of IT. He likes to map a system with flowcharts, DFDs and ERDs before coding, which helps catch problems early.`,
  },
  {
    keys: ["intern", "ojt", "hire", "available", "job", "open", "role", "position"],
    answer: () => `${profile.status}. He's interested in back-end development, systems analysis and IT support, and he's also open to front-end, mobile and other roles. Use the contact form below to reach him.`,
  },
  {
    keys: ["experience", "job", "worked", "freelance", "clown", "paint", "car", "auto"],
    answer: () =>
      `${n} is a working student. ${experience.map((e) => `${e.role} at ${e.org} (${e.period})`).join("; ")}. These taught him client handling, creativity and hands-on problem solving.`,
  },
  {
    keys: ["school", "study", "education", "college", "course", "degree", "student"],
    answer: () => `${n} studies at ${education[0].school} (${education[0].period}). Before that: ${education.slice(1).map((e) => e.school).join(" and ")}.`,
  },
  {
    keys: ["certif", "seminar", "training"],
    answer: () => {
      const c = certificates.filter((x) => real(x.title));
      return c.length
        ? `Certificates: ${c.map((x) => `${x.title} (${x.issuer})`).join("; ")}.`
        : `${n} is still adding his certificates here. Ask him through the contact form for the full list.`;
    },
  },
  {
    keys: ["contact", "email", "reach", "message", "talk", "phone", "number", "call"],
    answer: () =>
      `You can email ${n} at ${profile.links.email}${profile.links.phone ? `, call or text ${profile.links.phone}` : ""}, or use the contact form at the end of this page.`,
  },
  {
    keys: ["who", "about", "yourself", "introduce", "tell me"],
    answer: () => `${profile.name} is a ${profile.title}. ${profile.about[0]}`,
  },
];

export function localAnswer(question: string) {
  const q = question.toLowerCase();
  const hit = topics.find((t) => t.keys.some((k) => q.includes(k)));
  if (hit) return hit.answer();
  if (/^(hi|hello|hey|good)/.test(q)) return `Hi! Ask me about ${n}'s projects, skills, experience or availability.`;
  return `I'm not sure about that one. Try asking about ${n}'s projects, skills, experience or availability, or send him a message with the contact form.`;
}
