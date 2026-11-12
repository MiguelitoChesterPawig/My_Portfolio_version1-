"use client";

import { useEffect, useRef, useState } from "react";

/* Soft green light that follows the mouse (desktop only) */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const move = (e: PointerEvent) => {
      if (ref.current) ref.current.style.transform = `translate(${e.clientX - 300}px, ${e.clientY - 300}px)`;
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="cursor-glow pointer-events-none fixed left-0 top-0 z-0 hidden h-[600px] w-[600px] rounded-full md:block"
    />
  );
}

/* Desktop only: when you stop scrolling near the start of a section, the page glides
   (slowly, with easing) so that section lines up under the nav. Any wheel/key/touch cancels it. */
const SNAP_OFFSET = 80; // matches scroll-padding-top (nav height)
const SNAP_RANGE = 0.35; // only snap if a section start is within 35% of the screen height
const SNAP_MIN_MS = 700; // glide time for a short distance…
const SNAP_MAX_MS = 1200; // …and for a long one. Raise these to make it even slower.

export function SmoothSnap() {
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px) and (hover: hover)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let idle: number | undefined;
    let raf = 0;
    let gliding = false;

    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // easeInOutCubic

    function cancel() {
      if (gliding) {
        cancelAnimationFrame(raf);
        gliding = false;
      }
    }

    function glide(to: number) {
      const from = window.scrollY;
      const dist = to - from;
      const ms = Math.min(SNAP_MAX_MS, SNAP_MIN_MS + Math.abs(dist) * 1.2);
      const t0 = performance.now();
      gliding = true;
      const step = (now: number) => {
        if (!gliding) return;
        const t = Math.min(1, (now - t0) / ms);
        // "instant" so the CSS scroll-behavior: smooth doesn't fight each frame
        window.scrollTo({ top: from + dist * ease(t), behavior: "instant" });
        if (t < 1) raf = requestAnimationFrame(step);
        else gliding = false;
      };
      raf = requestAnimationFrame(step);
    }

    function settle() {
      if (!desktop.matches || reduced.matches || gliding) return;
      const y = window.scrollY;
      const range = window.innerHeight * SNAP_RANGE;
      let best: number | null = null;
      document.querySelectorAll<HTMLElement>("main section").forEach((s) => {
        // honor the section's scroll-margin-top (negative = skip its top padding), same as nav links
        const margin = parseFloat(getComputedStyle(s).scrollMarginTop) || 0;
        const target = Math.round(s.getBoundingClientRect().top + y - SNAP_OFFSET - margin);
        const d = Math.abs(target - y);
        if (d > 2 && d < range && (best === null || d < Math.abs(best - y))) best = target;
      });
      if (best !== null) glide(Math.max(0, best));
    }

    function onScroll() {
      if (gliding) return;
      clearTimeout(idle);
      idle = window.setTimeout(settle, 180); // wait until the user has stopped scrolling
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel);
    window.addEventListener("mousedown", cancel);
    return () => {
      cancel();
      clearTimeout(idle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
      window.removeEventListener("mousedown", cancel);
    };
  }, []);
  return null;
}

/* Text that "decodes" from random characters into the real text.
   With `repeatEvery` (ms), it plays again on that timer — skipped while the tab is hidden. */
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ01<>/{}#";
export function ScrambleText({
  text,
  delay = 0,
  repeatEvery,
  className,
}: {
  text: string;
  delay?: number;
  repeatEvery?: number;
  className?: string;
}) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let id: number | undefined;
    const total = 28;

    function play() {
      let frame = 0;
      clearTimeout(id);
      (function tick() {
        frame++;
        const done = Math.floor((frame / total) * text.length);
        setOut(
          text
            .split("")
            .map((c, i) => (c === " " || i < done ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
            .join(""),
        );
        if (frame < total) id = window.setTimeout(tick, 35);
        else setOut(text);
      })();
    }

    const start = window.setTimeout(play, delay);
    const loop = repeatEvery
      ? window.setInterval(() => {
          if (!document.hidden) play();
        }, repeatEvery)
      : undefined;
    return () => {
      clearTimeout(start);
      clearTimeout(id);
      clearInterval(loop);
    };
  }, [text, delay, repeatEvery]);
  return (
    <span className={className} aria-label={text}>
      {out}
    </span>
  );
}
