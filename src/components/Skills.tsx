"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { skillGroups } from "@/content/profile";
import { FlowSection } from "./FlowSection";
import { Shape } from "./Shapes";

const levelNames = ["", "Learning", "Basic", "Intermediate", "Strong"];
const AUTO_MS = 3500; // how long each branch stays before auto-advancing

/* A real decision node: the visitor picks a branch, the matching skills appear.
   Until they click, it cycles through the branches on its own so it's obvious they're buttons. */
export function Skills() {
  const [pick, setPick] = useState(0);
  const [auto, setAuto] = useState(true); // turns off for good once the visitor clicks
  const [paused, setPaused] = useState(false); // hover / keyboard focus pauses it
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.4 });
  const group = skillGroups[pick];
  const running = auto && !paused && inView;

  // the countdown bar's animation drives the advance, so pausing the bar pauses the cycle too
  function next() {
    setPick((p) => (p + 1) % skillGroups.length);
  }

  function choose(i: number) {
    setAuto(false);
    setPick(i);
  }

  return (
    <FlowSection
      id="skills"
      step="03"
      shape="decision"
      label="Decision"
      title="What does your team need?"
      intro="Choose a branch. The flow will show you what I can bring."
    >
      <div className="grid items-start gap-8 lg:grid-cols-[300px_1fr]">
        {/* decision diamond + branch options */}
        <div className="flex flex-col items-center lg:items-stretch">
          <div className="relative mx-auto grid h-36 w-36 place-items-center">
            <div className="pulse-glow absolute inset-5 rotate-45 rounded-lg border border-neon bg-neon/10" />
            <span className="relative text-center font-mono text-[11px] leading-4 text-neon">
              need
              <br />
              = ?
            </span>
          </div>
          {/* connector down to the options */}
          <svg className="h-8 w-2 self-center text-neon" viewBox="0 0 2 32">
            <line x1="1" y1="0" x2="1" y2="32" stroke="currentColor" strokeWidth="2" className="flow-dash" />
          </svg>
          <div
            ref={boxRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-1"
          >
            {skillGroups.map((g, i) => (
              <button
                key={g.name}
                onClick={() => choose(i)}
                aria-pressed={pick === i}
                className={`relative flex cursor-pointer items-center gap-2 overflow-hidden rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                  pick === i
                    ? "border-neon bg-neon/10 text-neon glow-neon"
                    : "border-edge text-muted hover:border-neon/50 hover:text-fg"
                }`}
              >
                <span className="font-mono text-[10px] opacity-70">{pick === i ? "YES" : "NO"}</span>
                <span className="min-w-0 leading-tight">{g.name}</span>
                {/* countdown bar: shows the branch will switch by itself */}
                {pick === i && auto && (
                  <span
                    key={pick}
                    onAnimationEnd={next}
                    className="skill-timer absolute bottom-0 left-0 h-[2px] w-full origin-left bg-neon"
                    style={{ animationDuration: `${AUTO_MS}ms`, animationPlayState: running ? "running" : "paused" }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* result panel */}
        <div className="relative">
          {/* connector from the diamond's right tip to this panel.
              Diamond's (rounded) tip sits ~82px right of the 300px column's center → 68px + 32px gap ≈ 114px */}
          <svg className="absolute -left-[114px] top-[68px] hidden h-2 w-[114px] text-neon lg:block" viewBox="0 0 114 2">
            <line x1="0" y1="1" x2="114" y2="1" stroke="currentColor" strokeWidth="2" className="flow-dash" />
          </svg>
          <AnimatePresence mode="wait">
            <motion.div
              key={group.name}
              initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, x: -20, filter: "blur(6px)" }}
              transition={{ duration: 0.3 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <div className="flex items-center gap-3 text-neon">
                <Shape name={group.icon} className="h-6 w-6" />
                <h3 className="font-display text-2xl font-semibold text-fg">{group.name}</h3>
              </div>
              <ul className="mt-6 space-y-5">
                {group.skills.map((s, i) => (
                  <li key={s.name}>
                    <div className="flex items-baseline justify-between text-sm">
                      <span className="text-fg">{s.name}</span>
                      <span className="font-mono text-[11px] uppercase text-muted">{levelNames[s.level]}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-edge">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${s.level * 25}%` }}
                        transition={{ delay: 0.15 + i * 0.08, duration: 0.7, ease: "easeOut" }}
                        className="h-full rounded-full bg-gradient-to-r from-neon to-coral shadow-[0_0_10px_rgb(var(--glow)/0.7)]"
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </FlowSection>
  );
}
