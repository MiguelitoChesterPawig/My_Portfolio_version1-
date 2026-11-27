"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { captionOf } from "@/lib/caption";
import { optimized } from "@/lib/optimized";

/* Grid of thumbnails for the case study page. Clicking one opens the shared full-screen
   Lightbox (loaded only on first use). Captions come from the "(...)" part of each file name. */
const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });
const preloadLightbox = () => void import("./Lightbox");

export function CaseGallery({
  title,
  images,
  fit = "cover",
  cols = "sm:grid-cols-2 lg:grid-cols-3",
}: {
  title: string;
  images: string[];
  fit?: "cover" | "contain"; // contain = whole image visible (diagrams), cover = cropped (photos)
  cols?: string;
}) {
  const [zoom, setZoom] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  return (
    <>
      {mounted && <Lightbox title={title} images={images} index={zoom} onIndex={setZoom} onClose={() => setZoom(null)} />}
      <div className={`grid gap-4 ${cols}`}>
        {images.map((src, i) => {
          const caption = captionOf(src) ?? `${title} ${i + 1}`;
          return (
            <button
              key={src}
              type="button"
              onClick={() => {
                setMounted(true);
                setZoom(i);
              }}
              onMouseEnter={preloadLightbox}
              onFocus={preloadLightbox}
              className="glass glass-hover group overflow-hidden rounded-xl text-left"
            >
              <span className={`relative block aspect-[4/3] overflow-hidden ${fit === "contain" ? "bg-white" : "bg-sunken"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  {...optimized(src, "(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw")}
                  alt={caption}
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full transition duration-300 group-hover:scale-[1.03] ${fit === "contain" ? "object-contain p-2" : "object-cover"}`}
                />
                <span className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="rounded-full border border-white/30 bg-black/50 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-white">
                    view
                  </span>
                </span>
              </span>
              <span className="block px-3 py-2.5 font-mono text-xs text-fg/80">{caption}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
