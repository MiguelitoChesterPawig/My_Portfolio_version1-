"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { captionOf } from "@/lib/caption";
import { optimized } from "@/lib/optimized";

const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });

/* One big screenshot in a browser frame, with tabs to switch between portals.
   Clicking the picture opens the full-screen viewer. Tab names come from the "(...)" in each file name. */
export function ScreenTabs({ title, images }: { title: string; images: string[] }) {
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const label = (src: string, n: number) => captionOf(src) ?? `${title} ${n + 1}`;

  return (
    <div>
      {mounted && <Lightbox title={title} images={images} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} />}
      <div role="tablist" aria-label={`${title} screens`} className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
        {images.map((src, n) => (
          <button
            key={src}
            type="button"
            role="tab"
            aria-selected={n === i}
            onClick={() => setI(n)}
            className={`whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
              n === i ? "border-neon bg-neon/10 font-semibold text-neon" : "border-edge text-muted hover:border-neon/50 hover:text-fg"
            }`}
          >
            {label(src, n)}
          </button>
        ))}
      </div>

      <div className="glass overflow-hidden rounded-2xl shadow-[0_30px_80px_-40px_rgb(var(--glow)/0.6)]">
        {/* browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-edge px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-coral/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-fg/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-neon/70" />
          <span className="ml-3 truncate font-mono text-[11px] text-muted">{label(images[i], i)}</span>
        </div>
        <button
          type="button"
          onClick={() => {
            setMounted(true);
            setZoom(i);
          }}
          className="group relative block w-full bg-sunken"
          aria-label={`Open ${label(images[i], i)} full screen`}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={images[i]}
              {...optimized(images[i], "(min-width: 1152px) 1100px, 100vw")}
              alt={label(images[i], i)}
              loading="lazy"
              decoding="async"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="aspect-[16/9] w-full object-cover object-top"
            />
          </AnimatePresence>
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 font-mono text-[11px] text-white opacity-80 transition group-hover:opacity-100">
            <i className="fi fi-rr-expand flex" aria-hidden="true" /> full screen
          </span>
        </button>
      </div>
    </div>
  );
}
