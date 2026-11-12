"use client";

import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { ThemeToggle } from "./ThemeToggle";
import { Logo } from "./Logo";

const steps = [
  { id: "start", label: "Start", hint: "Hello there" },
  { id: "about", label: "About", hint: "Who I am" },
  { id: "skills", label: "Skills", hint: "What I use" },
  { id: "projects", label: "Projects", hint: "What I built" },
  { id: "experience", label: "Experience", hint: "Where I worked" },
  { id: "ask", label: "Ask AI", hint: "Ask about me" },
  { id: "contact", label: "Contact", hint: "Let's talk" },
];

/* Menu icon, no box: three left-aligned lines of different lengths with a neon accent line
   in the middle. On hover they even out; when open they fold into an X. */
function Burger({ open }: { open: boolean }) {
  const line = "absolute left-0 h-[2px] rounded-full transition-all duration-300 ease-out";
  return (
    <span aria-hidden="true" className="relative block h-4 w-[22px]">
      <span
        className={`${line} bg-current ${
          open ? "top-1/2 w-[22px] -translate-y-1/2 rotate-45" : "top-0 w-[22px]"
        }`}
      />
      <span
        className={`${line} top-1/2 -translate-y-1/2 bg-neon shadow-[0_0_8px_rgb(var(--glow)/0.8)] ${
          open ? "w-0 opacity-0" : "w-3 group-hover:w-[22px]"
        }`}
      />
      <span
        className={`${line} bg-current ${
          open ? "top-1/2 w-[22px] -translate-y-1/2 -rotate-45" : "top-[14px] w-4 group-hover:w-[22px]"
        }`}
      />
    </span>
  );
}

const iconBtn =
  "group grid h-10 w-10 shrink-0 place-items-center rounded-full text-fg transition hover:text-neon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon/60 active:scale-90";

/* Lock page scroll while the drawer is open (without the page jumping sideways on desktop). */
function lockScroll(on: boolean) {
  const html = document.documentElement;
  if (on) {
    const bar = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    if (bar > 0) html.style.paddingRight = `${bar}px`;
  } else {
    html.style.overflow = "";
    html.style.paddingRight = "";
  }
}

export function Nav() {
  const [active, setActive] = useState("start");
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  // highlight the section currently on screen
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    steps.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // open/close side effects: scroll lock, Esc key, focus handling
  useEffect(() => {
    if (!open) {
      if (wasOpen.current) burgerRef.current?.focus({ preventScroll: true });
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    lockScroll(true);
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
    };
  }, [open]);

  function go(e: React.MouseEvent, id: string) {
    e.preventDefault();
    lockScroll(false); // unlock first so the page can actually scroll
    setOpen(false);
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  }

  const activeIdx = Math.max(
    0,
    steps.findIndex((s) => s.id === active),
  );
  const current = steps[activeIdx];
  const progress = (activeIdx / (steps.length - 1)) * 100;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-edge bg-bg/70 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-5">
          <button
            ref={burgerRef}
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="site-menu"
            className={`${iconBtn} -ml-2.5`}
          >
            <Burger open={open} />
          </button>

          <a
            href="#start"
            onClick={(e) => go(e, "start")}
            aria-label={`${profile.name}: home`}
            className="group flex min-w-0 items-center gap-2.5 font-display font-bold text-fg"
          >
            <Logo className="h-7 w-[30px] shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="hidden truncate sm:inline">
              {profile.shortName}
            </span>
          </a>

          {/* current section, like an app's screen title */}
          <span
            key={current.id}
            className="nav-title min-w-0 truncate font-mono text-xs text-muted"
          >
            <span className="text-neon">/</span> {current.label.toLowerCase()}
          </span>

          <div className="ml-auto shrink-0">
            <ThemeToggle />
          </div>
        </nav>

        {/* thin reading-progress line under the bar */}
        <span
          aria-hidden="true"
          className="absolute bottom-[-1px] left-0 h-[2px] bg-gradient-to-r from-neon to-coral shadow-[0_0_8px_rgb(var(--glow)/0.8)] transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </header>

      {/* backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* slide-in drawer */}
      <aside
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
        className={`fixed inset-y-0 left-0 z-50 flex w-[84vw] max-w-[340px] flex-col border-r border-edge bg-bg/95 shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-edge px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-edge bg-sunken">
              <Logo className="h-6 w-[26px]" />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display font-bold text-fg">
                {profile.shortName}
              </p>
              <p className="font-mono text-[11px] text-muted">
                portfolio · menu
              </p>
            </div>
          </div>
          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className={`${iconBtn} -mr-2.5`}
          >
            <Burger open />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <ol className="relative px-3 py-4">
            {/* flow rail: dim track + glowing fill up to the current step */}
            <span
              aria-hidden="true"
              className="absolute bottom-10 left-[35px] top-10 w-px bg-muted/30"
            />
            <span
              aria-hidden="true"
              className="absolute left-[34.5px] top-10 w-[2px] rounded-full bg-gradient-to-b from-neon to-coral shadow-[0_0_8px_rgb(var(--glow)/0.8)] transition-[height] duration-500"
              style={{ height: `calc((100% - 5rem) * ${progress / 100})` }}
            />
            {steps.map((s, i) => {
              const isActive = s.id === active;
              const passed = i < activeIdx;
              return (
                <li
                  key={s.id}
                  className={`drawer-item ${open ? "drawer-item-in" : ""}`}
                  style={{ transitionDelay: open ? `${80 + i * 35}ms` : "0ms" }}
                >
                  <a
                    href={`#${s.id}`}
                    onClick={(e) => go(e, s.id)}
                    aria-current={isActive ? "location" : undefined}
                    className={`group relative flex items-center gap-4 rounded-xl px-3 py-3 transition ${
                      isActive
                        ? "bg-neon/10 shadow-[inset_0_0_0_1px_rgb(var(--glow)/0.45)]"
                        : "hover:bg-sunken"
                    }`}
                  >
                    <span
                      className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border font-mono text-[10px] transition ${
                        isActive
                          ? "border-neon bg-neon text-bg glow-neon"
                          : passed
                            ? "border-coral bg-bg text-coral"
                            : "border-edge bg-bg text-muted group-hover:border-neon group-hover:text-neon"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block font-display text-base font-semibold ${isActive ? "text-neon" : "text-fg"}`}
                      >
                        {s.label}
                      </span>
                      <span className="block truncate text-xs text-muted">
                        {s.hint}
                      </span>
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 transition ${isActive ? "text-neon" : "text-muted/60 group-hover:translate-x-0.5 group-hover:text-neon"}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 6l6 6-6 6" />
                    </svg>
                  </a>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="border-t border-edge px-5 py-4">
          <a
            href="#contact"
            onClick={(e) => go(e, "contact")}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-neon px-4 py-3 font-display font-semibold text-bg transition hover:brightness-110 active:scale-[0.98]"
          >
            Let&apos;s work together
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
          <p className="mt-3 text-center font-mono text-[11px] text-muted">
            press esc to close
          </p>
        </div>
      </aside>
    </>
  );
}
