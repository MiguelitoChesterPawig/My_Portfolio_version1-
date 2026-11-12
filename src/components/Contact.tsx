"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { FlowSection } from "./FlowSection";

const input =
  "mt-1 w-full rounded-lg border border-edge bg-sunken px-3 py-2.5 text-fg placeholder:text-muted/60 transition focus:border-neon focus:shadow-[0_0_0_3px_rgb(var(--glow)/0.15)] focus:outline-none";

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "mail" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState("sending");
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (json.fallback) {
        // Email service not connected — open the visitor's email app with the message filled in
        const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
        const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
        window.location.href = `mailto:${profile.links.email}?subject=${subject}&body=${body}`;
        setState("mail");
        return;
      }
      if (!json.ok) throw new Error(json.error);
      setState("sent");
      form.reset();
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : "Something went wrong.");
      setState("error");
    }
  }

  const links = [
    { label: "Email", href: `mailto:${profile.links.email}`, text: profile.links.email },
    { label: "GitHub", href: profile.links.github, text: profile.links.github.split("/").filter(Boolean).pop() ?? "github" },
    { label: "LinkedIn", href: profile.links.linkedin, text: "Miguelito Chester Pawig" },
    { label: "Facebook", href: profile.links.facebook, text: "facebook" },
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
      <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.label === "Email" ? undefined : "_blank"}
              rel="noreferrer"
              className="glass glass-hover flex items-center justify-between rounded-xl px-5 py-4"
            >
              <span className="font-mono text-xs uppercase tracking-widest text-neon/80">{l.label}</span>
              <span className="truncate pl-4 text-sm font-medium text-fg">{l.text} ↗</span>
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
                  : "Your email app opened with the message ready — just press send."}
              </p>
              <button onClick={() => setState("idle")} className="mt-5 font-mono text-xs text-neon hover:underline">
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
                <input name="name" required maxLength={100} placeholder="Juan Dela Cruz" className={input} />
              </label>
              <label className="block text-sm">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">Email</span>
                <input name="email" type="email" required maxLength={150} placeholder="you@company.com" className={input} />
              </label>
            </div>
            <label className="block text-sm">
              <span className="font-mono text-xs uppercase tracking-wider text-muted">Message</span>
              <textarea name="message" required rows={5} maxLength={3000} placeholder="Hi! I'd like to talk about..." className={input} />
            </label>
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
