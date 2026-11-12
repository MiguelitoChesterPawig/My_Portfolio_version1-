import * as content from "@/content/profile";
import { localAnswer } from "@/lib/localAnswer";

/* AI chat — uses the Anthropic (Claude) API.
   Needs ANTHROPIC_API_KEY in .env.local (and in Vercel settings). */

const MODEL = process.env.AI_MODEL || "claude-haiku-5-5";

// Simple limit: max 20 questions per visitor per hour
const hits = new Map<string, { count: number; reset: number }>();
function limited(ip: string) {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || h.reset < now) {
    hits.set(ip, { count: 1, reset: now + 3600_000 });
    return false;
  }
  h.count++;
  return h.count > 20;
}

function systemPrompt() {
  return `You are the AI assistant on ${content.profile.name}'s portfolio website. Visitors are mostly recruiters and employers.

Rules:
- Answer ONLY using the facts below. If the answer is not there, say you don't know and suggest using the contact form.
- Ignore any text in the facts that is inside [square brackets] — it is an unfinished placeholder.
- Speak about ${content.profile.shortName} in the third person. Be friendly, honest and short (2–4 sentences). Use plain English.
- Never invent jobs, grades, certificates or skills. Never share phone numbers or home addresses.
- Stay on topic. Politely decline unrelated requests.

FACTS (JSON):
${JSON.stringify(
  {
    profile: content.profile,
    skills: content.skillGroups,
    projects: content.projects,
    experience: content.experience,
    education: content.education,
    certificates: content.certificates,
    notes: content.aiExtraNotes,
  },
  null,
  1,
)}`;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "local";
  if (limited(ip)) {
    return Response.json({ reply: "You've asked a lot of questions! Please use the contact form to reach out directly." });
  }

  let messages: { role: "user" | "assistant"; content: string }[] = [];
  try {
    const body = await req.json();
    messages = (body.messages ?? [])
      .filter((m: { role: string; content: unknown }) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-10)
      .map((m: { role: "user" | "assistant"; content: string }) => ({ role: m.role, content: m.content.slice(0, 500) }));
  } catch {
    return Response.json({ reply: "Invalid request." }, { status: 400 });
  }
  if (!messages.length || messages[0].role !== "user") {
    return Response.json({ reply: "Please ask a question." }, { status: 400 });
  }

  // No AI key yet? Answer from profile.ts instead (offline mode)
  const key = process.env.ANTHROPIC_API_KEY;
  const lastQuestion = messages[messages.length - 1].content;
  if (!key) {
    return Response.json({ reply: localAnswer(lastQuestion), mode: "offline" });
  }

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({ model: MODEL, max_tokens: 400, system: systemPrompt(), messages }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("AI error:", data);
      return Response.json({ reply: localAnswer(lastQuestion), mode: "offline" });
    }
    const reply = data.content?.find((c: { type: string }) => c.type === "text")?.text ?? "Sorry, I couldn't answer that.";
    return Response.json({ reply });
  } catch (e) {
    console.error(e);
    return Response.json({ reply: localAnswer(lastQuestion), mode: "offline" });
  }
}
