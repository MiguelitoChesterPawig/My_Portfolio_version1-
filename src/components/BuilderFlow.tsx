"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Shape } from "./Shapes";

type Step = { shape: string; title: string; text: string };

/* The AI Builder as a flowchart.
   Tablet/desktop: a row of connected nodes, click one to read it (← / → buttons too).
   Phones: a vertical timeline with every step open, nothing to tap. */
export function BuilderFlow({ steps, fallback }: { steps: Step[]; fallback: string }) {
  const [i, setI] = useState(0);
  const step = steps[i];
  const go = (n: number) => setI((n + steps.length) % steps.length);

  return (
    <div>
      {/* ---------- md and up: clickable flow ---------- */}
      <div className="hidden md:block">
        <ol className="relative grid grid-cols-6 gap-2">
          {/* connector line behind the nodes, filled up to the chosen step */}
          <span aria-hidden="true" className="absolute left-[8.33%] right-[8.33%] top-7 h-px bg-edge" />
          <span
            aria-hidden="true"
            className="absolute left-[8.33%] top-7 h-px bg-neon transition-[width] duration-500"
            style={{ width: `${(i / (steps.length - 1)) * 83.34}%` }}
          />
          {steps.map((s, n) => {
            const on = n === i;
            const done = n < i;
            return (
              <li key={s.title} className="relative flex flex-col items-center text-center">
                <button
                  type="button"
                  onClick={() => setI(n)}
                  aria-pressed={on}
                  aria-label={`Step ${n + 1}: ${s.title}`}
                  className={`grid h-14 w-14 place-items-center rounded-2xl border-2 bg-bg transition duration-300 ${
                    on
                      ? "scale-110 border-coral text-coral glow-coral"
                      : done
                        ? "border-neon text-neon"
                        : "border-edge text-muted hover:border-neon/60 hover:text-neon"
                  }`}
                >
                  <Shape name={s.shape} className="h-7 w-7" />
                </button>
                <span className="mt-3 font-mono text-[10px] text-coral">{String(n + 1).padStart(2, "0")}</span>
                <button
                  type="button"
                  onClick={() => setI(n)}
                  tabIndex={-1}
                  className={`mt-0.5 text-sm font-semibold leading-snug transition ${on ? "text-fg" : "text-muted hover:text-fg"}`}
                >
                  {s.title}
                </button>
              </li>
            );
          })}
        </ol>

        <div className="glass relative mt-8 flex items-center gap-4 overflow-hidden rounded-2xl p-6">
          <button
            type="button"
            onClick={() => go(i - 1)}
            aria-label="Previous step"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-edge text-muted transition hover:border-neon hover:text-neon"
          >
            <i className="fi fi-rr-angle-left flex" aria-hidden="true" />
          </button>
          <div className="min-h-[4.5rem] flex-1" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.div key={i} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.2 }}>
                <p className="font-mono text-xs text-coral">
                  step {i + 1} of {steps.length}
                </p>
                <p className="mt-1 font-display text-xl font-semibold text-fg">{step.title}</p>
                <p className="mt-1 max-w-2xl leading-relaxed text-fg/75">{step.text}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={() => go(i + 1)}
            aria-label="Next step"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-neon text-bg transition hover:opacity-85"
          >
            <i className="fi fi-rr-angle-right flex" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* ---------- phones: timeline ---------- */}
      <ol className="md:hidden">
        {steps.map((s, n) => (
          <li key={s.title} className="relative flex gap-4 pb-7 last:pb-0">
            {n < steps.length - 1 && <span aria-hidden="true" className="absolute left-[21px] top-12 h-[calc(100%-3rem)] w-px bg-neon/35" />}
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border-2 border-neon/60 bg-bg text-neon">
              <Shape name={s.shape} className="h-6 w-6" />
            </span>
            <div className="pt-0.5">
              <p className="font-mono text-[10px] text-coral">{String(n + 1).padStart(2, "0")}</p>
              <p className="font-display font-semibold text-fg">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-fg/70">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <p className="mt-6 flex items-start gap-3 text-sm text-fg/80">
        <span className="mt-0.5 shrink-0 rounded-full bg-coral/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-coral">plan b</span>
        <span>{fallback}</span>
      </p>
    </div>
  );
}
