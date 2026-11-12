"use client";

import { useEffect, useState } from "react";

/* Round button in the bottom-right corner. It appears once you scroll down
   and takes you back to the top of the page when clicked. */
const SHOW_AFTER = 400; // px scrolled before the button shows up

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <button
      onClick={toTop}
      aria-label="Back to top"
      title="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full border border-neon/50 bg-bg/80 text-neon shadow-[0_0_30px_-8px_rgb(var(--glow)/0.7)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-neon hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neon ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
