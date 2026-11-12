"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";

const steps = [
  { id: "start", label: "Start" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "ask", label: "Ask AI" },
  { id: "contact", label: "End" },
];

/* Arrow between two nav steps, styled like the side flow line:
   - filled: you've already passed it → glowing green→coral line
   - next:   it leaves the current step → a glowing dot travels along it
   - otherwise: a dim (but visible) track */
function Connector({ filled, next }: { filled: boolean; next: boolean }) {
  return (
    <span aria-hidden="true" className="relative mx-1 flex h-3 w-5 items-center">
      {/* base track */}
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-muted/40" />
      {/* fill, grows left → right */}
      <span
        className={`absolute inset-x-0 top-1/2 h-[2px] origin-left -translate-y-1/2 rounded-full bg-gradient-to-r from-neon to-coral shadow-[0_0_8px_rgb(var(--glow)/0.8)] transition-transform duration-500 ease-out ${
          filled ? "scale-x-100" : "scale-x-0"
        }`}
      />
      {/* moving data pulse toward the next step */}
      {next && <span className="nav-pulse absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-coral shadow-[0_0_8px_2px_rgba(255,122,102,0.7)]" />}
      {/* arrowhead */}
      <svg viewBox="0 0 6 8" className={`absolute -right-0.5 h-2 w-1.5 transition-colors duration-500 ${filled ? "text-coral" : next ? "text-neon" : "text-muted/60"}`}>
        <path d="M0 0 L6 4 L0 8 Z" fill="currentColor" />
      </svg>
    </span>
  );
}

export function Nav() {
  const [active, setActive] = useState("start");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    steps.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const activeIdx = steps.findIndex((s) => s.id === active);

  return (
    <header className="sticky top-0 z-40 border-b border-edge bg-bg/70 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#start" className="flex items-center gap-2.5 font-display font-bold text-fg">
          <span className="grid h-8 w-12 place-items-center rounded-full border border-neon/60 font-mono text-xs text-neon glow-neon">
            {profile.initials}
          </span>
          <span className="hidden sm:inline">{profile.shortName}</span>
        </a>

        <ol className="ml-auto mr-4 hidden items-center lg:flex">
          {steps.map((s, i) => (
            <li key={s.id} className="flex items-center">
              <a
                href={`#${s.id}`}
                className={`rounded-md px-3 py-1.5 text-sm transition ${
                  active === s.id ? "bg-neon/10 text-neon shadow-[inset_0_0_0_1px_rgb(var(--glow)/0.5)]" : "text-muted hover:text-fg"
                }`}
              >
                {s.label}
              </a>
              {i < steps.length - 1 && <Connector filled={i < activeIdx} next={i === activeIdx} />}
            </li>
          ))}
        </ol>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="rounded-md border border-edge px-3 py-1.5 font-mono text-xs text-neon lg:hidden"
            aria-expanded={open}
          >
            {open ? "close" : "menu"}
          </button>
        </div>
      </nav>

      {open && (
        <ol className="border-t border-edge bg-bg/95 px-5 py-3 lg:hidden">
          {steps.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 py-2.5 ${active === s.id ? "text-neon" : "text-fg"}`}
              >
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      )}
    </header>
  );
}
