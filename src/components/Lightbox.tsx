"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { captionOf } from "@/lib/caption";
import { useSwipe } from "@/lib/useSwipe";

export { captionOf };

/* Full-screen screenshot viewer.
   Rendered into <body> with a portal: the glass cards use backdrop-filter, which would
   otherwise trap a fixed overlay inside the card. */
export function Lightbox({
  title,
  images,
  captions,
  index,
  onIndex,
  onClose,
}: {
  title: string;
  images: string[];
  captions?: string[]; // optional label per image; otherwise read from the file name
  index: number | null; // null = closed
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const open = index !== null;
  const n = images.length;
  const swipe = useSwipe(
    () => index !== null && onIndex((index - 1 + n) % n),
    () => index !== null && onIndex((index + 1) % n),
  );

  // keyboard: Esc closes, ← / → flip; lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onIndex((index! + 1) % n);
      else if (e.key === "ArrowLeft") onIndex((index! - 1 + n) % n);
      else return;
      e.preventDefault();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, index, n, onClose, onIndex]);

  if (typeof document === "undefined") return null;

  const src = open ? images[index] : "";
  const labelOf = (k: number) =>
    captions?.[k] ?? captionOf(images[k]) ?? `Screenshot ${k + 1}`;
  const caption = open ? labelOf(index) : "";
  const navBtn =
    "absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-2xl text-white backdrop-blur transition hover:border-neon hover:text-neon";

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${title}: ${caption}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-sm md:p-10"
        >
          {/* top bar */}
          <div
            className="mb-3 flex w-full max-w-6xl items-center justify-between gap-4 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="truncate font-display text-base font-semibold md:text-lg">
                {title}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-widest text-neon">
                {caption} · {index + 1}/{n}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              autoFocus
              className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 text-lg transition hover:border-coral hover:text-coral"
            >
              ✕
            </button>
          </div>

          {/* image + arrows */}
          <div
            className="relative flex w-full max-w-6xl flex-1 touch-pan-y touch-pinch-zoom select-none items-center justify-center"
            style={{ minHeight: 0 }}
            {...(n > 1 ? swipe.handlers : {})}
          >
            <div
              className="flex h-full w-full items-center justify-center"
              style={{
                transform: `translateX(${swipe.dx}px)`,
                transition: swipe.dx ? "none" : "transform 0.2s ease-out",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={src}
                  src={src}
                  alt={`${title}: ${caption}`}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                  className="max-h-full max-w-full rounded-lg border border-white/10 object-contain shadow-[0_0_80px_-20px_rgb(var(--glow)/0.6)]"
                />
              </AnimatePresence>
            </div>
            {n > 1 && (
              <>
                <button
                  aria-label="Previous screenshot"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndex((index - 1 + n) % n);
                  }}
                  className={`${navBtn} left-1 md:-left-4`}
                >
                  ‹
                </button>
                <button
                  aria-label="Next screenshot"
                  onClick={(e) => {
                    e.stopPropagation();
                    onIndex((index + 1) % n);
                  }}
                  className={`${navBtn} right-1 md:-right-4`}
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* thumbnails */}
          {n > 1 && (
            <div
              className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((s, k) => (
                <button
                  key={s}
                  onClick={() => onIndex(k)}
                  aria-label={`Show ${labelOf(k)}`}
                  className={`shrink-0 overflow-hidden rounded-md border-2 transition ${
                    k === index
                      ? "border-coral"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={s}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="h-12 w-20 object-cover object-top md:h-14 md:w-24"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
