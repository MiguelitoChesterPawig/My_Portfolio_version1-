"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { FlowSection } from "./FlowSection";
import { cleanField, fieldHint, type FieldName } from "@/lib/formRules";

const input =
  "mt-1 w-full rounded-lg border border-edge bg-sunken px-3 py-2.5 text-fg placeholder:text-muted/60 transition focus:border-neon focus:shadow-[0_0_0_3px_rgb(var(--glow)/0.15)] focus:outline-none";

// Keep in sync with MAX_IMAGE_MB in src/app/api/contact/route.ts (hosts like Vercel cap uploads at about 4.5 MB)
const MAX_IMAGE_MB = 4;

// Cloudflare Turnstile captcha. Stays off until NEXT_PUBLIC_TURNSTILE_SITE_KEY is set.
const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Turnstile = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mail" | "error">("idle");
  const [error, setError] = useState("");
  const [captchaReady, setCaptchaReady] = useState(false);
  const [fileName, setFileName] = useState("");
  const [hint, setHint] = useState<{ field: FieldName; text: string } | null>(null);
  const captchaBox = useRef<HTMLDivElement>(null);
  const captchaId = useRef<string | null>(null);
  const showForm = state !== "sent" && state !== "mail";

  // Draw the captcha inside the form. The widget adds a hidden "cf-turnstile-response" field to the form.
  useEffect(() => {
    const el = captchaBox.current;
    if (!siteKey || !captchaReady || !showForm || !el || !window.turnstile) return;
    const id = window.turnstile.render(el, {
      sitekey: siteKey,
      theme: "auto",
      // always the wide 300x65 rectangle; on very narrow phones it is scaled down (see captchaScale)
      size: "normal",
    });
    captchaId.current = id;
    return () => {
      window.turnstile?.remove(id);
      captchaId.current = null;
    };
  }, [captchaReady, showForm]);

  // Shrink the 300px-wide captcha to fit phones narrower than that, instead of the square "compact" one.
  const captchaFrame = useRef<HTMLDivElement>(null);
  const [captchaScale, setCaptchaScale] = useState(1);
  useEffect(() => {
    const frame = captchaFrame.current;
    if (!frame) return;
    const fit = () => setCaptchaScale(Math.min(1, frame.clientWidth / 300));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    return () => ro.disconnect();
  }, [showForm]);

  // hide the "symbol not allowed" note after a few seconds
  useEffect(() => {
    if (!hint) return;
    const t = setTimeout(() => setHint(null), 4000);
    return () => clearTimeout(t);
  }, [hint]);

  // removes characters a field doesn't allow, right as they're typed or pasted
  function guard(field: FieldName) {
    return (e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      const { clean, changed } = cleanField(field, el.value);
      if (!changed) return;
      const removed = el.value.length - clean.length;
      const pos = Math.max(0, (el.selectionStart ?? clean.length) - removed);
      el.value = clean;
      try {
        el.setSelectionRange(pos, pos); // keep the cursor in place (not supported on email/url inputs)
      } catch {}
      setHint({ field, text: fieldHint[field] });
    };
  }

  const note = (field: FieldName) =>
    hint?.field === field && <span className="mt-1 block text-xs text-coral" role="status">{hint.text}</span>;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(
      [...formData].filter(([, v]) => typeof v === "string"),
    ) as Record<string, string>;

    // check the picture here too, so big files fail fast without uploading
    const file = formData.get("attachment");
    if (file instanceof File && file.size > 0) {
      if (!file.type.startsWith("image/")) {
        setError("Please attach an image file (JPG, PNG, WEBP or GIF).");
        setState("error");
        return;
      }
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        setError(`The picture is too big. Please use one under ${MAX_IMAGE_MB} MB.`);
        setState("error");
        return;
      }
    } else {
      formData.delete("attachment"); // nothing picked
    }

    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: formData });
      const json = await res.json();
      if (json.fallback) {
        // Email service not connected — open the visitor's email app with the message filled in
        const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
        const extra = data.link ? `\n\nLink: ${data.link}` : "";
        const body = encodeURIComponent(`${data.message}${extra}\n\nFrom: ${data.name} (${data.email})`);
        window.location.href = `mailto:${profile.links.email}?subject=${subject}&body=${body}`;
        setState("mail");
        return;
      }
      if (!json.ok) throw new Error(json.error);
      setState("sent");
      form.reset();
      setFileName("");
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong.");
      setState("error");
      // a captcha token works only once, so get a fresh one for the next try
      if (captchaId.current) window.turnstile?.reset(captchaId.current);
    }
  }

  const { email, phone, github, linkedin, instagram, facebook, whatsapp, telegram, viber } = profile.links;
  const handle = (url: string) => url.split("/").filter(Boolean).pop() ?? "";
  // icon = Flaticon UIcons class (fi-brands-* for logos, fi-rr-* for regular rounded)
  const links = [
    { label: "Email", icon: "fi-rr-envelope", href: `mailto:${email}`, text: email, external: false },
    {
      label: "Phone",
      icon: "fi-rr-phone-call",
      href: phone && `tel:+63${phone.replace(/\D/g, "").replace(/^0/, "")}`,
      text: phone,
      external: false,
    },
    { label: "WhatsApp", icon: "fi-brands-whatsapp", href: whatsapp, text: phone, external: true },
    { label: "Telegram", icon: "fi-brands-telegram", href: telegram, text: `@${handle(telegram)}`, external: true },
    { label: "Viber", icon: "fi-rr-comment-alt-dots", href: viber, text: phone, external: false },
    { label: "GitHub", icon: "fi-brands-github", href: github, text: handle(github), external: true },
    { label: "LinkedIn", icon: "fi-brands-linkedin", href: linkedin, text: profile.name, external: true },
    { label: "Instagram", icon: "fi-brands-instagram", href: instagram, text: `@${handle(instagram)}`, external: true },
    { label: "Facebook", icon: "fi-brands-facebook", href: facebook, text: profile.name, external: true },
  ].filter((l) => l.href);

  return (
    <FlowSection
      id="contact"
      step="07"
      shape="terminator"
      label="End"
      title="Let's work together"
      intro="Every flowchart needs an end. This one ends with you sending a message."
    >
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="lazyOnload"
          onReady={() => setCaptchaReady(true)}
        />
      )}
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr] [&>*]:min-w-0">
        <div className="space-y-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel="noreferrer"
              className="glass glass-hover flex items-center justify-between rounded-xl px-5 py-4"
            >
              <span className="flex shrink-0 items-center gap-3 font-mono text-xs uppercase tracking-widest text-neon/80">
                <i className={`fi ${l.icon} flex text-base text-neon`} aria-hidden="true" />
                {l.label}
              </span>
              <span className="min-w-0 truncate pl-4 text-sm font-medium text-fg">
                {l.text} {l.external ? "↗" : ""}
              </span>
            </a>
          ))}
          <a
            href={profile.cv}
            download="Pawig-Curriculum-Vitae.pdf"
            className="block rounded-xl bg-neon px-5 py-4 text-center text-sm font-semibold text-bg transition hover:brightness-110 glow-neon"
          >
            Download my Curriculum Vitae (PDF)
          </a>
        </div>

        {state === "sent" || state === "mail" ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="grid place-items-center rounded-full border border-neon bg-neon/10 px-8 py-16 text-center glow-neon"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-coral">end</p>
              <p className="mt-2 font-display text-2xl font-bold text-fg">
                {state === "sent" ? "Message sent!" : "Almost done!"}
              </p>
              <p className="mt-2 text-sm text-fg/70">
                {state === "sent"
                  ? "Thank you. I'll get back to you soon."
                  : "Your email app opened with the message ready. Just press send."}
              </p>
              <button onClick={() => { setState("idle"); setFileName(""); }} className="mt-5 font-mono text-xs text-neon hover:underline">
                ← send another
              </button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={submit} className="glass space-y-4 rounded-2xl p-6">
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">Name</span>
                <input name="name" required maxLength={100} placeholder="Juan Dela Cruz" onInput={guard("name")} className={input} />
                {note("name")}
              </label>
              <label className="block text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">Email</span>
                <input name="email" type="email" required maxLength={150} placeholder="you@company.com" onInput={guard("email")} className={input} />
                {note("email")}
              </label>
            </div>
            <label className="block text-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">Message</span>
              <textarea name="message" required rows={5} maxLength={3000} placeholder="Hi! I'd like to talk about..." onInput={guard("message")} className={input} />
              {note("message")}
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  Link <span className="normal-case tracking-normal text-muted/70">(optional)</span>
                </span>
                <input name="link" type="url" maxLength={500} placeholder="https://..." onInput={guard("link")} className={input} />
                {note("link")}
              </label>
              <label className="block text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">
                  Picture <span className="normal-case tracking-normal text-muted/70">(optional, max {MAX_IMAGE_MB} MB)</span>
                </span>
                <span className={`${input} flex cursor-pointer items-center gap-2 overflow-hidden`}>
                  <i className="fi fi-rr-picture flex text-neon" aria-hidden="true" />
                  <span className={`truncate ${fileName ? "text-fg" : "text-muted/60"}`}>
                    {fileName || "Choose an image..."}
                  </span>
                </span>
                <input
                  name="attachment"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="sr-only"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                />
              </label>
            </div>
            {siteKey && (
              <div ref={captchaFrame} className="flex w-full justify-center py-2" style={{ height: 65 * captchaScale + 16 }}>
                <div
                  ref={captchaBox}
                  className="h-[65px] w-[300px] shrink-0 origin-top"
                  style={{ transform: `scale(${captchaScale})` }}
                />
              </div>
            )}
            {state === "error" && <p className="text-sm text-coral">{error}</p>}
            <button
              disabled={state === "sending"}
              className="w-full rounded-lg bg-coral py-3 font-semibold text-white transition hover:bg-coral-deep disabled:opacity-60 glow-coral"
            >
              {state === "sending" ? "Sending..." : "Send message →"}
            </button>
          </form>
        )}
      </div>
    </FlowSection>
  );
}
