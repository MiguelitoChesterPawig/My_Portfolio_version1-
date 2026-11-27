"use client";

import { useEffect, useRef, useState } from "react";

/* Case study menu that sticks under the top bar. It highlights the section on screen,
   scrolls that pill into view on phones, and shows a thin reading-progress line. */
export function CaseNav({ items }: { items: readonly (readonly [string, string])[] }) {
  const [active, setActive] = useState<string>(items[0][0]);
  const [progress, setProgress] = useState(0);
  const list = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const sections = items.map(([id]) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    // a section counts as "current" while it crosses a line ~35% down the screen
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-35% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [items]);

  // keep the active pill visible in the sideways-scrolling list (phones)
  useEffect(() => {
    const ul = list.current;
    const pill = ul?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!ul || !pill) return;
    ul.scrollTo({ left: pill.offsetLeft - ul.clientWidth / 2 + pill.clientWidth / 2, behavior: "smooth" });
  }, [active]);

  return (
    <nav aria-label="Case study sections" className="sticky top-16 z-30 -mx-4 mt-8 border-b border-edge bg-bg/85 backdrop-blur sm:-mx-5">
      <ul ref={list} className="no-scrollbar flex gap-1.5 overflow-x-auto px-4 py-2.5 sm:px-5">
        {items.map(([id, label], i) => {
          const on = id === active;
          return (
            <li key={id} data-id={id}>
              <a
                href={`#${id}`}
                aria-current={on ? "true" : undefined}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  on ? "bg-neon text-bg" : "text-muted hover:bg-fg/5 hover:text-fg"
                }`}
              >
                <span className={`font-mono text-[10px] ${on ? "text-bg/70" : "text-coral"}`}>{String(i + 1).padStart(2, "0")}</span>
                {label}
              </a>
            </li>
          );
        })}
      </ul>
      <span aria-hidden="true" className="absolute bottom-0 left-0 h-0.5 origin-left bg-coral transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
    </nav>
  );
}
