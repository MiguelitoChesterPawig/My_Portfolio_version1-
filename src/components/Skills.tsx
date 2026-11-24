"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { skillGroups } from "@/content/profile";
import { FlowSection } from "./FlowSection";

const AUTO_MS = 3500; // how long each category stays before auto-advancing

/* Plain skill list: pick a category, see the skills as simple tags.
   No percentage bars, just an honest split between what I've used and what I'm still learning.
   Until the visitor clicks, it cycles through the categories so it's obvious they're buttons. */
export function Skills() {
  const [pick, setPick] = useState(0);
  const [auto, setAuto] = useState(true); // turns off for good once the visitor clicks
  const [paused, setPaused] = useState(false); // hover / keyboard focus pauses it
  const boxRef = useRef<HTMLDivElement>(null);
  const inView = useInView(boxRef, { amount: 0.4 });
  const group = skillGroups[pick];
  const running = auto && !paused && inView;

  const used = group.skills.filter((s) => s.level >= 3);
  const learning = group.skills.filter((s) => s.level < 3);

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
      label="Skills"
      title="What I've learned so far"
      intro="These are the tools and skills I've used in school projects and at work. I'm still a student, and I'm eager to keep learning on the job."
    >
      <div className="grid items-start gap-6 lg:grid-cols-[260px_1fr]">
        {/* category buttons */}
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
              className={`relative cursor-pointer overflow-hidden rounded-lg border px-3 py-2.5 text-left text-sm leading-tight transition ${
                pick === i
                  ? "border-neon bg-neon/10 text-neon glow-neon"
                  : "border-edge text-muted hover:border-neon/50 hover:text-fg"
              }`}
            >
              {g.name}
              {/* countdown bar: shows the category will switch by itself */}
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

        {/* result panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={group.name}
            initial={{ opacity: 0, x: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -20, filter: "blur(6px)" }}
            transition={{ duration: 0.3 }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <h3 className="font-display text-2xl font-semibold text-fg">{group.name}</h3>

            {used.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-muted">Have used in projects or work</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {used.map((s) => (
                    <li key={s.name} className="rounded-full border border-neon/40 bg-neon/10 px-3 py-1 text-sm text-fg">
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {learning.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-muted">Know the basics, still learning</p>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {learning.map((s) => (
                    <li key={s.name} className="rounded-full border border-edge px-3 py-1 text-sm text-fg">
                      {s.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </FlowSection>
  );
}
