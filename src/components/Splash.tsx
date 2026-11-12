"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

/* Intro screen shown before the site on every page load and refresh.
   It's in the server HTML, so it covers the page from
   the very first paint, and all its animation is CSS (app/splash.css). This component only
   decides when it leaves: after the page has loaded AND the intro has had MIN_SHOW ms. */
const MIN_SHOW = 3000; // let the full intro play
const MAX_WAIT = 7000; // never hold the visitor longer than this, even on a slow connection

// [time it appears (ms), text]
const steps: [number, React.ReactNode][] = [
  [0, <>&gt; booting</>],
  [550, <>&gt; <b>analyze</b></>],
  [950, <>&gt; <b>map</b></>],
  [1350, <>&gt; <b>build</b></>],
  [2150, <>&gt; status: <span className="ok">ready ✓</span></>],
];

export function Splash() {
  const [phase, setPhase] = useState<"show" | "out" | "gone">("show");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const minShow = reduced ? 600 : MIN_SHOW;
    let wait: number | undefined;
    // The CSS intro starts when the splash is first painted, not when the request started
    // (a slow server/connection can eat seconds before that). The splash is the first thing
    // painted, so first-contentful-paint is when the intro began.
    const shownFor = () => {
      const paint = performance.getEntriesByName("first-contentful-paint")[0]?.startTime;
      return paint === undefined ? 0 : performance.now() - paint;
    };
    // Start the exit only from "show". This component stays mounted after the splash is gone
    // (it just renders nothing), so whichever timer fires second must not restart the exit —
    // that used to replay the fade-out over the site ~7s in (the "flash after the splash").
    const exit = () => {
      clearTimeout(wait);
      clearTimeout(cap);
      setPhase((p) => (p === "show" ? "out" : p));
    };
    const leave = () => {
      clearTimeout(wait);
      wait = window.setTimeout(exit, Math.max(0, minShow - shownFor()));
    };
    const cap = window.setTimeout(exit, Math.max(0, MAX_WAIT - shownFor()));
    if (document.readyState === "complete") leave();
    else window.addEventListener("load", leave, { once: true });

    return () => {
      clearTimeout(wait);
      clearTimeout(cap);
      window.removeEventListener("load", leave);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      id="splash"
      role="status"
      aria-label={`Loading ${profile.name}'s portfolio`}
      className={phase === "out" ? "sp-out" : undefined}
      // once the exit fade ends, take it out of the page completely (frees its DOM + animations)
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget && e.animationName.startsWith("sp-exit")) setPhase("gone");
      }}
    >
      <div className="sp-stage">
        <div className="sp-halo" />
        <svg className="sp-logo" viewBox="0 0 130 120" aria-hidden="true">
          <rect className="sp-bar sp-b1" x="6" y="64" width="22" height="50" rx="11" />
          <rect className="sp-bar sp-b2" x="38" y="40" width="22" height="74" rx="11" />
          <rect className="sp-bar sp-b3" x="70" y="14" width="22" height="100" rx="11" />
          <path className="sp-bowl" pathLength="100" d="M81 23 H97 A17 17 0 0 1 97 57 H81" />
        </svg>
        <div className="sp-scan" />
      </div>
      <div className="sp-name">{profile.name}</div>
      <div className="sp-status" aria-hidden="true">
        {steps.map(([at, text], i) => (
          <span
            key={at}
            className="sp-line"
            style={{ "--on": `${at}ms`, "--off": `${steps[i + 1]?.[0] ?? 999999}ms` } as React.CSSProperties}
          >
            <span>{text}</span>
            <span className="sp-caret" />
          </span>
        ))}
      </div>
      <div className="sp-track">
        <div className="sp-fill" />
      </div>
    </div>
  );
}
