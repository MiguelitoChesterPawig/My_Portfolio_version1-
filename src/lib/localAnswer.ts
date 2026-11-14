import { profile, skillGroups, projects, experience, education, certificates } from "@/content/profile";

/* Ready-made answers built from profile.ts.
   - cannedAnswer(): used FIRST for common questions, so they are answered without calling the AI (no tokens used).
   - localAnswer():  fallback when no AI key is set, or the AI fails.
   Every topic has at least 5 different wordings, picked at random, so replies don't look copy-pasted. */

const real = (s: string) => !/\[.*\]/.test(s); // skip [placeholders]
const list = (items: string[]) => items.filter(real).join(", ");
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const n = profile.shortName;

// data used by the answers (computed once)
const allSkills = skillGroups.flatMap((g) => g.skills);
const strong = () => list(allSkills.filter((s) => s.level >= 3).map((s) => s.name));
const growing = () => list(allSkills.filter((s) => s.level <= 2).map((s) => s.name).slice(0, 4));
const featured = () => projects.find((x) => x.featured) ?? projects[0];
const projectNames = () => projects.map((p) => p.name).filter(real);
const jobs = () => experience.map((e) => `${e.role} at ${e.org} (${e.period})`).join("; ");
const certs = () => certificates.filter((x) => real(x.title));
const phone = profile.links.phone;

type Topic = { keys: string[]; answers: (() => string)[] };

const topics: Topic[] = [
  {
    keys: ["techworld", "etpcp", "capstone", "e-commerce", "ecommerce"],
    answers: [
      () => { const p = featured(); return `${p.name}: ${p.solution} ${n} worked as ${p.role}. Key features: ${list(p.features.slice(0, 4))}. Built with ${list(p.tech)}.`; },
      () => { const p = featured(); return `For ${p.name}, ${n} was the ${p.role}. ${p.solution} It was built with ${list(p.tech)}.`; },
      () => { const p = featured(); return `${p.name} is ${n}'s main project. ${p.solution} Some highlights: ${list(p.features.slice(0, 3))}.`; },
      () => { const p = featured(); return `${n} handled the ${p.role} side of ${p.name}. The stack was ${list(p.tech)}, and it includes ${list(p.features.slice(0, 3))}. You can see screenshots in the Projects section.`; },
      () => { const p = featured(); return `In short: ${p.solution} ${n}'s role was ${p.role}, using ${list(p.tech)}.`; },
    ],
  },
  {
    keys: ["project", "built", "portfolio", "work on", "made"],
    answers: [
      () => `${n}'s projects include ${projectNames().join(", ")}. The main one is ${projectNames()[0]}. Check the Projects section for screenshots and details.`,
      () => `He has worked on ${projectNames().length} projects so far: ${projectNames().join(", ")}. ${featured().name} is the one he's most proud of.`,
      () => `Here's what ${n} has built: ${projectNames().join(", ")}. Scroll to the Projects section to see each one up close.`,
      () => `${n}'s featured project is ${featured().name}. ${featured().solution} He also built ${projectNames().slice(1).join(", ")}.`,
      () => `Projects so far: ${projectNames().join(", ")}. They range from web systems to mobile apps, with ${featured().name} as the headline project.`,
    ],
  },
  {
    keys: ["skill", "language", "strong", "good at", "stack", "programming", "tech stack", "technolog"],
    answers: [
      () => `${n}'s strongest skills are ${strong()}. He focuses on back-end logic and systems analysis, and is still growing in ${growing()}.`,
      () => `He's most confident with ${strong()}. Right now he's also building up ${growing()}.`,
      () => `Back-end logic and systems analysis are ${n}'s main focus. His strongest tools are ${strong()}.`,
      () => `Top skills: ${strong()}. He's honest that he's still learning ${growing()}, and he enjoys picking up new things.`,
      () => `${n} works best with ${strong()}. You can see every skill and its level in the Skills section.`,
    ],
  },
  {
    keys: ["flowchart", "analys", "diagram", "erd", "dfd", "system flow"],
    answers: [
      () => `Systems analysis is one of ${n}'s favorite parts of IT. He likes to map a system with flowcharts, DFDs and ERDs before coding, which helps catch problems early.`,
      () => `${n} always plans before he codes. He draws flowcharts, DFDs and ERDs first so the logic is clear before any code is written.`,
      () => `He enjoys the analysis side a lot. Mapping a system with diagrams helps him spot problems early and explain the system to others.`,
      () => `Flowcharts, DFDs and ERDs are part of how ${n} works. Even this portfolio is themed like a flowchart because of it.`,
      () => `${n}'s motto is "map it before you code it." He uses diagrams like DFDs and ERDs to design systems before building them.`,
    ],
  },
  {
    keys: ["intern", "ojt", "hire", "hiring", "available", "open to", "position", "vacancy"],
    answers: [
      () => `${profile.status}. He's interested in back-end development, systems analysis and IT support, and he's also open to front-end, mobile and other roles. Use the contact form below to reach him.`,
      () => `Yes! ${n} is ${profile.status.toLowerCase()}. Feel free to send him a message through the contact form.`,
      () => `He's currently ${profile.status.toLowerCase()}. Back-end and systems analysis are his focus, but he's happy to explore other roles too.`,
      () => `${n} is available and eager to learn. ${profile.status}. You can email him at ${profile.links.email}.`,
      () => `Good news: ${profile.status.toLowerCase()}. He's open to back-end, front-end, mobile, IT support and more. The contact form at the bottom is the fastest way to reach him.`,
    ],
  },
  {
    keys: ["experience", "worked", "freelance", "clown", "paint", "work history"],
    answers: [
      () => `${n} is a working student. ${jobs()}. These taught him client handling, creativity and hands-on problem solving.`,
      () => `Besides school, ${n} has real work experience: ${jobs()}.`,
      () => `His work history: ${jobs()}. Working while studying taught him to manage time and deal with clients.`,
      () => `${n} has been working while studying. ${jobs()}. Check the Experience section for more.`,
      () => `Here's his experience so far: ${jobs()}. Each one built soft skills like communication and problem solving.`,
    ],
  },
  {
    keys: ["school", "study", "education", "college", "course", "degree", "student"],
    answers: [
      () => `${n} studies at ${education[0].school} (${education[0].period}). Before that: ${education.slice(1).map((e) => e.school).join(" and ")}.`,
      () => `He's currently at ${education[0].school}, ${education[0].period}.`,
      () => `${n}'s education: ${education.map((e) => `${e.school} (${e.period})`).join("; ")}.`,
      () => `He's a student at ${education[0].school}. He balances his studies with part-time work.`,
      () => `Right now ${n} is studying at ${education[0].school} (${education[0].period}), and he balances school with work.`,
    ],
  },
  {
    keys: ["certif", "seminar", "training"],
    answers: [
      () => certs().length ? `Certificates: ${certs().map((x) => `${x.title} (${x.issuer})`).join("; ")}.` : `${n} is still adding his certificates here. Ask him through the contact form for the full list.`,
      () => certs().length ? `${n} has ${certs().length} certificates, including ${certs().map((x) => x.title).join(", ")}.` : `His certificates are still being added. Reach out through the contact form for the full list.`,
      () => certs().length ? `He has completed ${certs().map((x) => `${x.title} from ${x.issuer}`).join(", ")}.` : `The certificate list is coming soon.`,
      () => certs().length ? `Some of his certificates: ${certs().map((x) => x.title).join(", ")}. You can view them in the Certificates section.` : `Certificates will be listed here soon.`,
      () => certs().length ? `${n} keeps learning outside class too. His certificates include ${certs().map((x) => x.title).join(", ")}.` : `${n} is still uploading his certificates.`,
    ],
  },
  {
    keys: ["contact", "email", "reach", "phone", "number", "call", "message him"],
    answers: [
      () => `You can email ${n} at ${profile.links.email}${phone ? `, call or text ${phone}` : ""}, or use the contact form at the end of this page.`,
      () => `The easiest way is email: ${profile.links.email}.${phone ? ` You can also call or text ${phone}.` : ""}`,
      () => `Reach ${n} at ${profile.links.email}${phone ? ` or ${phone}` : ""}. The Email and Call buttons at the top of the page work too.`,
      () => `Send him a message through the contact form at the bottom, or email ${profile.links.email} directly.`,
      () => `${n} is easy to reach!${phone ? ` Phone: ${phone}.` : ""} Email: ${profile.links.email}. He's also on LinkedIn.`,
    ],
  },
  {
    keys: ["who is", "about him", "yourself", "introduce", "tell me about"],
    answers: [
      () => `${profile.name} is a ${profile.title}. ${profile.about[0]}`,
      () => `${n} is a ${profile.title} based in ${profile.location}. ${profile.tagline}`,
      () => `Meet ${profile.name}: a ${profile.title} who loves mapping systems before coding them. ${profile.status}.`,
      () => `${profile.name} is a working IT student and a ${profile.title}. His favorite parts are back-end logic and systems analysis.`,
      () => `${n} in one line: "${profile.tagline}" He's a ${profile.title} from ${profile.location}.`,
    ],
  },
];

const greetings = [
  () => `Hi! Ask me about ${n}'s projects, skills, experience or availability.`,
  () => `Hello! I can tell you about ${n}'s projects, skills and experience. What would you like to know?`,
  () => `Hey there! Want to know about ${n}'s work, skills or how to reach him?`,
  () => `Hi, thanks for visiting! Ask me anything about ${n}.`,
  () => `Hello! I'm here to answer questions about ${n}. Try asking about his projects or skills.`,
];

const thanks = [
  () => `You're welcome! Anything else you'd like to know about ${n}?`,
  () => `Happy to help! Feel free to ask more.`,
  () => `No problem! If you want to reach ${n}, the contact form is at the bottom.`,
  () => `Glad I could help!`,
  () => `Anytime! Let me know if you have other questions about ${n}.`,
];

const unknown = [
  () => `I'm not sure about that one. Try asking about ${n}'s projects, skills, experience or availability, or send him a message with the contact form.`,
  () => `I don't have that info. You can ask ${n} directly through the contact form.`,
  () => `Hmm, I can't answer that. I can tell you about ${n}'s projects, skills or experience though.`,
  () => `That's not something I know. Try the contact form, and ${n} will get back to you.`,
  () => `I can only answer questions about ${n}'s work and background. Want to hear about his projects?`,
];

/** A ready-made answer for common, simple questions, or null if the question should go to the AI. */
export function cannedAnswer(question: string): string | null {
  const q = question.toLowerCase().trim();
  const words = q.split(/\s+/).length;
  if (/^(hi|hello|hey|good (morning|afternoon|evening)|yo|kumusta|musta)\b[\s!.?]*$/.test(q)) return pick(greetings)();
  if (/^(thanks|thank you|ty|salamat|ok thanks|okay thanks)\b/.test(q) && words <= 4) return pick(thanks)();
  // long or mixed questions need a real answer from the AI
  if (words > 12) return null;
  // questions that need judgment or specifics (e.g. "does he have experience with React?") go to the AI
  if (/\b(why|how many|how long|compare|difference|would he|could he|can he|does he know|experience (with|in)|fit for|better)\b/.test(q)) return null;
  const hits = topics.filter((t) => t.keys.some((k) => q.includes(k)));
  if (hits.length !== 1) return null;
  return pick(hits[0].answers)();
}

/** Offline fallback: always returns something. */
export function localAnswer(question: string) {
  const q = question.toLowerCase();
  const canned = cannedAnswer(question);
  if (canned) return canned;
  const hit = topics.find((t) => t.keys.some((k) => q.includes(k)));
  if (hit) return pick(hit.answers)();
  if (/^(hi|hello|hey|good)/.test(q)) return pick(greetings)();
  return pick(unknown)();
}
