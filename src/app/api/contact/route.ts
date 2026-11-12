/* Contact form
   1. Saves the message to Supabase (if SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set)
   2. Emails you a formatted notification, with the visitor's picture attached (if RESEND_API_KEY is set)
   3. Sends the visitor an auto-reply (only if CONTACT_AUTO_REPLY=true and your domain is verified in Resend) */

import { profile } from "@/content/profile";

// Keep in sync with MAX_IMAGE_MB in src/components/Contact.tsx
const MAX_IMAGE_MB = 4;
const IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

const fail = (error: string) => Response.json({ ok: false, error }, { status: 400 });

type Fields = Record<string, string>;

async function readRequest(req: Request): Promise<{ fields: Fields; file: File | null } | null> {
  try {
    if ((req.headers.get("content-type") ?? "").includes("multipart/form-data")) {
      const form = await req.formData();
      const fields: Fields = {};
      let file: File | null = null;
      for (const [key, value] of form) {
        if (typeof value === "string") fields[key] = value;
        else if (key === "attachment" && value.size > 0) file = value;
      }
      return { fields, file };
    }
    return { fields: await req.json(), file: null };
  } catch {
    return null;
  }
}

export async function POST(req: Request) {
  const parsed = await readRequest(req);
  if (!parsed) return fail("Invalid request.");
  const { fields: body, file } = parsed;

  // honeypot: bots fill hidden fields, people don't
  if (body.website) return Response.json({ ok: true });

  // captcha: checked with Cloudflare only when TURNSTILE_SECRET_KEY is set
  const captchaSecret = process.env.TURNSTILE_SECRET_KEY;
  if (captchaSecret) {
    const token = String(body["cf-turnstile-response"] ?? "");
    if (!token) return fail("Please complete the captcha first.");
    const check = new URLSearchParams({ secret: captchaSecret, response: token });
    const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0].trim();
    if (ip) check.set("remoteip", ip);
    const verdict = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: check })
      .then((r) => r.json() as Promise<{ success?: boolean }>)
      .catch(() => ({ success: false }));
    if (!verdict.success) return fail("Captcha check failed. Please try again.");
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const email = String(body.email ?? "").trim().slice(0, 150);
  const message = String(body.message ?? "").trim().slice(0, 3000);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return fail("Please fill in your name, a valid email and a message.");
  }

  // optional link: only real http(s) web addresses
  let link = String(body.link ?? "").trim().slice(0, 500);
  if (link) {
    try {
      const u = new URL(link);
      if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
      link = u.toString();
    } catch {
      return fail("The link doesn't look right. It should start with https://");
    }
  }

  // optional picture
  let picture: { filename: string; content: string; type: string } | null = null;
  if (file) {
    if (!IMAGE_TYPES.includes(file.type)) return fail("Please attach an image file (JPG, PNG, WEBP or GIF).");
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) return fail(`The picture is too big. Please use one under ${MAX_IMAGE_MB} MB.`);
    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const base = file.name.replace(/\.[^.]*$/, "").replace(/[^\w.-]+/g, "-").slice(0, 60) || "picture";
    picture = {
      filename: `${base}.${ext}`,
      content: Buffer.from(await file.arrayBuffer()).toString("base64"),
      type: file.type,
    };
  }

  const tasks: Promise<Response>[] = [];

  // 1. Save to Supabase (the link is added to the message text; pictures are only emailed, not saved)
  const sbUrl = process.env.SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (sbUrl && sbKey) {
    const saved = [message, link && `Link: ${link}`, picture && `Picture: ${picture.filename} (sent by email)`]
      .filter(Boolean)
      .join("\n\n");
    tasks.push(
      fetch(`${sbUrl}/rest/v1/messages`, {
        method: "POST",
        headers: {
          apikey: sbKey,
          Authorization: `Bearer ${sbKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ name, email, message: saved }),
      }),
    );
  }

  // 2. Emails through Resend
  const resendKey = process.env.RESEND_API_KEY;
  const owner = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || `${profile.name} Portfolio <onboarding@resend.dev>`;
  if (resendKey && owner) {
    const send = (payload: object) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

    const site = new URL(req.url).origin;
    const sentAt = new Date().toLocaleString("en-US", {
      timeZone: "Asia/Manila",
      dateStyle: "long",
      timeStyle: "short",
    });

    tasks.push(
      send({
        from,
        to: owner,
        reply_to: `${name.replace(/["<>]/g, "")} <${email}>`,
        subject: `New inquiry from ${name} | Portfolio Contact Form`,
        html: ownerEmailHtml({ name, email, message, link, picture, site, sentAt }),
        text: ownerEmailText({ name, email, message, link, picture, site, sentAt }),
        ...(picture && {
          attachments: [{ filename: picture.filename, content: picture.content, content_id: "visitor-picture" }],
        }),
      }),
    );

    // Auto-reply only works after you verify your own domain in Resend
    if (process.env.CONTACT_AUTO_REPLY === "true") {
      tasks.push(
        send({
          from,
          to: email,
          reply_to: owner,
          subject: `Thanks for reaching out, ${name.split(" ")[0]}!`,
          html: autoReplyHtml(name, site),
          text: `Hi ${name},\n\nThank you for your message. I received it and will get back to you as soon as I can.\n\nBest regards,\n${profile.name}\n${site}`,
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

// ---------------------------------------------------------------- email templates
// Emails use tables and inline styles because Gmail and Outlook ignore most modern CSS.

type MailData = {
  name: string;
  email: string;
  message: string;
  link: string;
  picture: { filename: string; type: string } | null;
  site: string;
  sentAt: string;
};

const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const ACCENT = "#0f766e";

function layout(preheader: string, inner: string, site: string) {
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;">
<tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;font-family:${FONT};color:#111827;">
    <tr><td style="background:${ACCENT};padding:22px 32px;">
      <div style="font-size:18px;font-weight:700;color:#ffffff;">${esc(profile.name)}</div>
      <div style="font-size:13px;color:#ccfbf1;margin-top:2px;">Portfolio Contact Form</div>
    </td></tr>
    ${inner}
    <tr><td style="padding:18px 32px;border-top:1px solid #e5e7eb;background:#f9fafb;font-size:12px;line-height:1.5;color:#6b7280;">
      This message was sent through the contact form on <a href="${esc(site)}" style="color:${ACCENT};">${esc(site.replace(/^https?:\/\//, ""))}</a>.
    </td></tr>
  </table>
</td></tr>
</table>
</body></html>`;
}

const row = (label: string, value: string) => `
  <tr>
    <td style="padding:6px 0;width:90px;font-size:13px;color:#6b7280;vertical-align:top;">${label}</td>
    <td style="padding:6px 0;font-size:14px;color:#111827;vertical-align:top;word-break:break-word;">${value}</td>
  </tr>`;

function ownerEmailHtml(d: MailData) {
  const replySubject = encodeURIComponent("Re: Your message on my portfolio");
  const details = [
    row("Name", `<strong>${esc(d.name)}</strong>`),
    row("Email", `<a href="mailto:${esc(d.email)}" style="color:${ACCENT};">${esc(d.email)}</a>`),
    d.link && row("Link", `<a href="${esc(d.link)}" style="color:${ACCENT};">${esc(d.link)}</a>`),
    d.picture && row("Picture", `${esc(d.picture.filename)} <span style="color:#6b7280;">(attached below)</span>`),
    row("Received", esc(d.sentAt)),
  ]
    .filter(Boolean)
    .join("");

  const pictureBlock = d.picture
    ? `<tr><td style="padding:0 32px 8px;">
        <div style="font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#6b7280;margin-bottom:8px;">Attached picture</div>
        <img src="cid:visitor-picture" alt="${esc(d.picture.filename)}" style="display:block;max-width:100%;height:auto;border:1px solid #e5e7eb;border-radius:8px;">
      </td></tr>`
    : "";

  const inner = `
    <tr><td style="padding:28px 32px 8px;">
      <div style="font-size:20px;font-weight:700;">You have a new message</div>
      <div style="font-size:14px;color:#4b5563;margin-top:4px;">${esc(d.name)} contacted you through your portfolio.</div>
    </td></tr>
    <tr><td style="padding:12px 32px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;border-bottom:1px solid #e5e7eb;padding:6px 0;">
        ${details}
      </table>
    </td></tr>
    <tr><td style="padding:12px 32px 20px;">
      <div style="font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#6b7280;margin-bottom:8px;">Message</div>
      <div style="background:#f9fafb;border-left:3px solid ${ACCENT};border-radius:6px;padding:16px 18px;font-size:15px;line-height:1.6;color:#111827;white-space:pre-wrap;word-break:break-word;">${esc(d.message)}</div>
    </td></tr>
    ${pictureBlock}
    <tr><td style="padding:12px 32px 28px;">
      <a href="mailto:${esc(d.email)}?subject=${replySubject}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:8px;">Reply to ${esc(d.name.split(" ")[0])}</a>
      <div style="font-size:12px;color:#6b7280;margin-top:10px;">You can also just press Reply. It goes straight to ${esc(d.email)}.</div>
    </td></tr>`;

  return layout(`${d.name}: ${d.message.slice(0, 90)}`, inner, d.site);
}

function ownerEmailText(d: MailData) {
  return [
    `New message from your portfolio contact form`,
    ``,
    `Name:     ${d.name}`,
    `Email:    ${d.email}`,
    d.link ? `Link:     ${d.link}` : null,
    d.picture ? `Picture:  ${d.picture.filename} (attached)` : null,
    `Received: ${d.sentAt}`,
    ``,
    `Message:`,
    d.message,
    ``,
    `Reply to this email to answer ${d.name} directly.`,
    `Sent from ${d.site}`,
  ]
    .filter((l) => l !== null)
    .join("\n");
}

function autoReplyHtml(name: string, site: string) {
  const inner = `
    <tr><td style="padding:28px 32px;font-size:15px;line-height:1.6;color:#111827;">
      <p style="margin:0 0 14px;">Hi ${esc(name)},</p>
      <p style="margin:0 0 14px;">Thank you for your message. I received it and will get back to you as soon as I can.</p>
      <p style="margin:0;">Best regards,<br><strong>${esc(profile.name)}</strong><br><span style="color:#6b7280;">${esc(profile.title)}</span></p>
    </td></tr>`;
  return layout("Thanks for your message. I'll get back to you soon.", inner, site);
}
