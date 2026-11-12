/* Contact form
   1. Saves the message to Supabase (if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set)
   2. Emails you a notification and sends the visitor an auto-reply (if RESEND_API_KEY is set) */

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // honeypot: bots fill hidden fields, people don't
  if (body.website) return Response.json({ ok: true });

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 150);
  const message = String(body.message ?? "").trim().slice(0, 3000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }

  const tasks: Promise<Response>[] = [];

  // 1. Save to Supabase
  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (sbUrl && sbKey) {
    tasks.push(
      fetch(`${sbUrl}/rest/v1/messages`, {
        method: "POST",
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ name, email, message }),
      }),
    );
  }

  // 2. Emails through Resend
  const resendKey = process.env.RESEND_API_KEY;
  const owner = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  if (resendKey && owner) {
    const send = (payload: object) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

    tasks.push(
      send({
        from,
        to: owner,
        reply_to: email,
        subject: `New portfolio message from ${name}`,
        html: `<p><b>${esc(name)}</b> (${esc(email)}) wrote:</p><p>${esc(message).replace(/\n/g, "<br>")}</p>`,
      }),
    );
    // Auto-reply only works after you verify your own domain in Resend
    if (process.env.CONTACT_AUTO_REPLY === "true") {
      tasks.push(
        send({
          from,
          to: email,
          subject: "Thanks for reaching out!",
          html: `<p>Hi ${esc(name)},</p><p>Thanks for your message. I got it and will reply as soon as I can.</p><p>— Miguelito</p>`,
        }),
      );
    }
  }

  // Nothing set up yet → tell the page to open the visitor's email app instead
  if (!tasks.length) {
    return Response.json({ ok: false, fallback: true });
  }

  const results = await Promise.allSettled(tasks);
  const okCount = results.filter((r) => r.status === "fulfilled" && r.value.ok).length;
  if (okCount < results.length) {
    for (const r of results) {
      if (r.status === "rejected") console.error("Contact step failed:", r.reason);
      else if (!r.value.ok) console.error("Contact step failed:", r.value.status, await r.value.text());
    }
  }
  // If nothing worked, fall back to email so the message is not lost
  if (okCount === 0) return Response.json({ ok: false, fallback: true });
  return Response.json({ ok: true });
}
