"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { profile } from "@/content/profile";
import { ScrambleText } from "./Effects";

/* Personal greeting: share links like yoursite.com/?for=Accenture */
function useGreeting() {
  const [greeting, setGreeting] = useState("Hello");
  const [company, setCompany] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const h = new Date().getHours();
    const g = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    const forParam = new URLSearchParams(window.location.search).get("for");
    const clean = forParam ? forParam.replace(/[^\w\s.&-]/g, "").slice(0, 40) : null;
    const device = window.innerWidth < 768 ? "mobile" : "desktop";
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    // eslint-disable-next-line react-hooks/set-state-in-effect -- values only exist in the browser
    setGreeting(g);
    setCompany(clean);
    setLog([
      `visitor connected · ${device} · ${time}`,
      clean ? `loading profile for: ${clean} team` : "loading profile...",
      "status: ready ✓",
    ]);
  }, []);

  return { greeting, company, log };
}

function Corners() {
  const c = "absolute h-5 w-5 border-neon";
  return (
    <>
      <span className={`${c} left-0 top-0 border-l-2 border-t-2`} />
      <span className={`${c} right-0 top-0 border-r-2 border-t-2`} />
      <span className={`${c} bottom-0 left-0 border-b-2 border-l-2`} />
      <span className={`${c} bottom-0 right-0 border-b-2 border-r-2`} />
    </>
  );
}

export function Hero() {
  const { greeting, company, log } = useGreeting();

  return (
    <section id="start" className="relative overflow-hidden">
      {/* background: glow orbs + moving grid floor */}
      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-neon/15 blur-[120px]" />
      <div className="absolute -right-40 top-20 h-[400px] w-[400px] rounded-full bg-coral/10 blur-[120px]" />
      <div className="grid-floor" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pb-24 pt-6 md:grid-cols-[1.25fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-neon/50 bg-neon/5 px-4 py-1.5 font-mono text-xs uppercase tracking-widest text-neon"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-coral" /> Start
          </motion.div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-6 text-lg text-muted">
            {greeting}
            {company ? (
              <>
                , <span className="font-semibold text-coral">{company}</span> team 👋 — thanks for stopping by.
              </>
            ) : (
              <>, I&apos;m</>
            )}
          </motion.p>

          <h1 className="glow-text mt-2 font-display text-5xl font-bold leading-[1.02] tracking-tight text-fg md:text-7xl">
            <ScrambleText text={profile.name} delay={250} repeatEvery={10000} />
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-4 bg-gradient-to-r from-neon to-coral bg-clip-text font-display text-xl font-semibold text-transparent md:text-2xl"
          >
            {profile.title}
          </motion.p>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-4 max-w-xl text-muted">
            {profile.tagline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <a href="#projects" className="rounded-lg bg-neon px-5 py-3 text-sm font-semibold text-bg transition hover:brightness-110 glow-neon">
              View my work
            </a>
            <a href="#ask" className="rounded-lg bg-coral px-5 py-3 text-sm font-semibold text-white transition hover:bg-coral-deep glow-coral">
              Ask my AI assistant
            </a>
            <a
              href={profile.cv}
              download="Pawig-Curriculum-Vitae.pdf"
              className="rounded-lg border border-edge px-5 py-3 text-sm font-semibold text-fg transition hover:border-neon hover:text-neon"
            >
              Download Curriculum Vitae
            </a>
          </motion.div>

          <div className="glass mt-8 max-w-md rounded-lg p-4 font-mono text-xs leading-6 text-fg/80">
            {log.map((line, i) => (
              <motion.p key={line} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.3 + i * 0.45 }}>
                <span className="text-neon">&gt;</span> {line}
              </motion.p>
            ))}
            <span className="blink text-coral">▌</span>
          </div>
        </div>

        {/* photo inside a HUD frame */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="relative mx-auto w-full max-w-sm"
        >
          <div className="absolute -inset-6 rounded-3xl bg-gradient-to-br from-neon/30 via-transparent to-coral/30 blur-2xl" />
          <div className="relative p-3">
            <Corners />
            <div className="relative overflow-hidden rounded-xl border border-edge">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.photo} alt={profile.name} className="aspect-[4/5] w-full object-cover object-top" />
              <div className="scan" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-bg/90 to-transparent px-4 pb-3 pt-10 font-mono text-[11px]">
                <span className="text-fg/80">{profile.location}</span>
                <span className="flex items-center gap-1.5 text-neon">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-neon" /> online
                </span>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-4 -right-2 rotate-2 rounded-md bg-coral px-3 py-2 font-mono text-xs text-white glow-coral">
            {profile.status}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
