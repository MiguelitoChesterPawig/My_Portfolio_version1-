"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { certificates } from "@/content/profile";

// The viewer code only downloads when someone first hovers or clicks a certificate.
const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });
const preloadLightbox = () => void import("./Lightbox");

/* Certificate & seminar cards. Clicking one opens the picture in a modal on this page
   (Esc closes, arrow keys flip through all of them) instead of a new tab. */
export function Certificates() {
  const [zoom, setZoom] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {certificates.map((c, i) => (
          <button
            key={c.title + i}
            type="button"
            onClick={() => {
              setMounted(true);
              setZoom(i);
            }}
            onMouseEnter={preloadLightbox}
            onFocus={preloadLightbox}
            aria-label={`View ${c.title}`}
            className="glass glass-hover group overflow-hidden rounded-xl text-left"
          >
            <span className="relative block overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={c.image}
                alt={c.title}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition duration-300 group-hover:scale-[1.03]"
              />
              <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="rounded-full border border-white/30 bg-black/50 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white">
                  view
                </span>
              </span>
            </span>
            <span className="block p-3">
              <span className="block text-sm font-semibold text-fg">{c.title}</span>
              <span className="block text-xs text-muted">
                {c.issuer} · {c.date}
              </span>
            </span>
          </button>
        ))}
      </div>

      {mounted && (
        <Lightbox
          title="Certificates & Seminars"
          images={certificates.map((c) => c.image)}
          captions={certificates.map((c) => c.title)}
          index={zoom}
          onIndex={setZoom}
          onClose={() => setZoom(null)}
        />
      )}
    </>
  );
}
