"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { experience, education } from "@/content/profile";
import { useSwipe } from "@/lib/useSwipe";

type Job = (typeof experience)[number];
type School = (typeof education)[number];

/* ---------- shared modal shell ----------
   Portal into <body> (glass cards use backdrop-filter, which would trap a fixed overlay).
   Esc closes, page scroll is locked while open. */
function Modal({ open, onClose, label, size = "max-h-[92svh]", children }: { open: boolean; onClose: () => void; label: string; size?: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative flex ${size} w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-edge bg-bg shadow-[0_0_80px_-20px_rgb(var(--glow)/0.5)] sm:rounded-2xl`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ModalHeader({ kicker, title, sub, period, accent, onClose }: { kicker: string; title: string; sub: string; period: string; accent: "coral" | "neon"; onClose: () => void }) {
  return (
    <div className="flex shrink-0 items-start justify-between gap-4 border-b border-edge px-4 py-3 sm:px-6 sm:py-4">
      <div className="min-w-0">
        <p className={`font-mono text-[11px] uppercase tracking-widest ${accent === "coral" ? "text-coral" : "text-neon"}`}>{kicker}</p>
        <h3 className="mt-0.5 font-display text-base font-semibold leading-snug text-fg sm:text-xl">{title}</h3>
        <p className="mt-0.5 text-sm text-muted">
          {sub} <span className="whitespace-nowrap font-mono text-xs">· {period}</span>
        </p>
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        autoFocus
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-edge text-fg transition hover:border-coral hover:text-coral"
      >
        ✕
      </button>
    </div>
  );
}

const isVideo = (src: string) => /\.(mp4|webm|mov)$/i.test(src);

type Slide = { kind: "photos"; srcs: string[] } | { kind: "video"; src: string; n: number };

/* photos -> one collage slide; every video -> its own slide */
function toSlides(proof: string[]): Slide[] {
  const photos = proof.filter((s) => !isVideo(s));
  const videos = proof.filter(isVideo);
  return [
    ...(photos.length ? [{ kind: "photos", srcs: photos } as Slide] : []),
    ...videos.map((src, k) => ({ kind: "video", src, n: k + 1 }) as Slide),
  ];
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/* "1 photo · 2 videos" for the card hint */
function proofSummary(proof: string[]) {
  const v = proof.filter(isVideo).length;
  const p = proof.length - v;
  return [p && plural(p, "photo"), v && plural(v, "video")].filter(Boolean).join(" · ");
}

/* collage layout by photo count, so every photo fits on the one slide */
function collageClass(n: number) {
  if (n === 1) return "grid-cols-1";
  if (n === 2) return "grid-cols-2";
  if (n <= 4) return "grid-cols-2 grid-rows-2";
  return "grid-cols-3 auto-rows-fr";
}

function Collage({ title, srcs, onZoom }: { title: string; srcs: string[]; onZoom: (src: string) => void }) {
  const n = srcs.length;
  return (
    <div className={`grid h-full gap-1.5 p-1.5 ${collageClass(n)}`}>
      {srcs.map((src, k) => (
        <button
          key={src}
          type="button"
          onClick={() => onZoom(src)}
          aria-label={`Enlarge photo ${k + 1}`}
          className={`group/tile relative min-h-0 overflow-hidden rounded-lg bg-black ${n === 3 && k === 0 ? "row-span-2" : ""}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${title}: photo ${k + 1}`}
            loading="lazy"
            draggable={false}
            className={`h-full w-full select-none transition duration-300 group-hover/tile:scale-105 ${n === 1 ? "object-contain" : "object-cover"}`}
          />
          <span className="absolute bottom-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur transition group-hover/tile:opacity-100">
            <i className="fi fi-rr-expand flex text-xs" aria-hidden="true" />
          </span>
        </button>
      ))}
    </div>
  );
}

/* ---------- experience: proof slides (photo collage + autoplaying videos) ---------- */
function ProofSlides({ title, proof }: { title: string; proof: string[] }) {
  const slides = toSlides(proof);
  const n = slides.length;
  const [i, setI] = useState(0);
  const [zoom, setZoom] = useState<string | null>(null);
  const videos = useRef<(HTMLVideoElement | null)[]>([]);
  const go = (k: number) => setI(Math.max(0, Math.min(n - 1, k)));
  const swipe = useSwipe(() => go(i - 1), () => go(i + 1));

  // play the video on the current slide from the start; pause the rest
  useEffect(() => {
    videos.current.forEach((v, k) => {
      if (!v) return;
      if (k === i) {
        v.currentTime = 0;
        v.play().catch(() => {}); // muted autoplay; ignore if the browser still refuses
      } else v.pause();
    });
  }, [i]);

  if (n === 0) {
    return (
      <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-edge bg-fg/[0.03] px-6 py-12 text-center">
        <i className="fi fi-rr-picture flex text-2xl text-muted" aria-hidden="true" />
        <p className="text-sm font-medium text-fg/80">Proof photos coming soon</p>
        <p className="max-w-xs text-xs text-muted">Photos from this job are being added. Feel free to ask me about it directly.</p>
      </div>
    );
  }

  const label = (s: Slide) => (s.kind === "photos" ? `Photos (${s.srcs.length})` : `Video ${s.n}`);
  const side =
    "absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/55 text-xl text-white backdrop-blur transition hover:border-neon hover:text-neon disabled:pointer-events-none disabled:opacity-0";
  const remaining = n - 1 - i;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* viewport: swipe / drag left-right to change slide */}
      <div className="relative min-h-[140px] flex-1 touch-pan-y overflow-hidden rounded-xl border border-edge bg-black" {...(n > 1 ? swipe.handlers : {})}>
        <div
          className="flex h-full"
          style={{
            transform: `translateX(calc(${-i * 100}% + ${swipe.dx}px))`,
            transition: swipe.dx ? "none" : "transform 0.35s cubic-bezier(.2,.8,.2,1)",
          }}
        >
          {slides.map((s, k) => (
            <div key={k} className="h-full w-full shrink-0" aria-hidden={k !== i}>
              {s.kind === "photos" ? (
                <Collage title={title} srcs={s.srcs} onZoom={setZoom} />
              ) : (
                <video
                  ref={(el) => {
                    videos.current[k] = el;
                  }}
                  src={s.src}
                  muted
                  playsInline
                  loop
                  controls
                  preload="metadata"
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          ))}
        </div>

        {n > 1 && (
          <>
            <button aria-label="Previous proof" onClick={() => go(i - 1)} disabled={i === 0} className={`${side} left-2`}>
              ‹
            </button>
            <button aria-label="Next proof" onClick={() => go(i + 1)} disabled={i === n - 1} className={`${side} right-2`}>
              ›
            </button>
          </>
        )}

        {/* tells the visitor there is more after the collage */}
        {remaining > 0 && (
          <button
            onClick={() => go(i + 1)}
            className="absolute right-14 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-neon/60 bg-black/65 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-neon backdrop-blur transition hover:bg-neon hover:text-bg"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-neon opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-neon" />
            </span>
            +{remaining} more
          </button>
        )}

        {/* enlarged photo */}
        <AnimatePresence>
          {zoom && (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setZoom(null)}
              aria-label="Close enlarged photo"
              className="absolute inset-0 z-20 bg-black/95"
            >
              {/* absolute + object-contain: the whole photo always fits inside the box, never cropped */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={zoom} alt={`${title}: enlarged photo`} draggable={false} className="absolute inset-0 h-full w-full select-none object-contain p-2" />
              <span className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-white/25 bg-black/60 text-white">✕</span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* slide controls: prev · labelled dots · next */}
      {n > 1 && (
        <div className="mt-2 flex shrink-0 items-center justify-between gap-2 sm:mt-3 sm:gap-3">
          <button
            onClick={() => go(i - 1)}
            disabled={i === 0}
            className="rounded-lg border border-edge px-3 py-1.5 text-sm font-medium text-fg transition hover:border-fg/50 disabled:opacity-30 sm:py-2"
          >
            ‹ Prev
          </button>
          <div className="flex min-w-0 flex-wrap items-center justify-center gap-1.5">
            {slides.map((s, k) => (
              <button
                key={k}
                onClick={() => go(k)}
                aria-label={`Show ${label(s)}`}
                aria-current={k === i}
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition ${
                  k === i ? "border-coral bg-coral/15 text-coral" : "border-edge text-muted hover:text-fg"
                }`}
              >
                <i className={`fi ${s.kind === "photos" ? "fi-rr-picture" : "fi-rr-play"} flex text-[10px]`} aria-hidden="true" />
                <span className="hidden sm:inline">{label(s)}</span>
                <span className="sm:hidden">{k + 1}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => go(i + 1)}
            disabled={i === n - 1}
            className="rounded-lg bg-neon px-4 py-1.5 text-sm font-semibold text-bg transition hover:brightness-110 sm:py-2 disabled:bg-transparent disabled:text-muted disabled:opacity-40"
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
}

function JobModal({ job, onClose }: { job: Job | null; onClose: () => void }) {
  return (
    <Modal open={!!job} onClose={onClose} size="h-[min(92svh,760px)]" label={job ? `${job.role}: proof of work` : ""}>
      {job && (
        <>
          <ModalHeader kicker="// proof of work" title={job.role} sub={job.org} period={job.period} accent="coral" onClose={onClose} />
          <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden px-4 py-3 sm:gap-4 sm:px-6 sm:py-5">
            <ProofSlides key={job.role} title={job.role} proof={job.proof} />
            <ul className="grid shrink-0 list-disc gap-x-8 gap-y-0.5 pl-4 text-xs leading-snug text-fg/75 marker:text-neon sm:grid-cols-2 sm:gap-y-1 sm:text-sm">
              {job.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </Modal>
  );
}

/* ---------- education: website preview + "leaving this site" confirmation ---------- */
function SchoolModal({ school, onClose }: { school: School | null; onClose: () => void }) {
  const [confirming, setConfirming] = useState(false);
  const close = () => {
    setConfirming(false);
    onClose();
  };
  const host = school ? new URL(school.website).hostname.replace(/^www\./, "") : "";
  const visit = () => {
    if (school) window.open(school.website, "_blank", "noopener,noreferrer");
    close();
  };

  return (
    <Modal open={!!school} onClose={close} label={school ? `${school.school} website` : ""}>
      {school && (
        <>
          <ModalHeader
            kicker="// school website"
            title={school.school}
            sub={school.level + (school.detail ? ` · ${school.detail}` : "")}
            period={school.period}
            accent="neon"
            onClose={close}
          />
          <div className="flex min-h-0 flex-col overflow-hidden px-4 py-3 sm:px-6 sm:py-5">
            {/* screenshot inside a small browser frame; clicking it asks before leaving */}
            <button
              onClick={() => setConfirming(true)}
              aria-label={`Visit ${host}`}
              className="group flex min-h-0 w-full shrink flex-col overflow-hidden rounded-xl border border-edge text-left transition hover:border-neon"
            >
              <div className="flex shrink-0 items-center gap-2 border-b border-edge bg-fg/[0.04] px-3 py-2">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-coral/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-neon/70" />
                </span>
                <span className="ml-2 flex min-w-0 flex-1 items-center gap-1.5 truncate rounded-md bg-bg/70 px-2.5 py-1 font-mono text-[11px] text-muted">
                  <i className="fi fi-rr-lock flex text-[10px] text-neon" aria-hidden="true" />
                  {host}
                </span>
              </div>
              <div className="relative min-h-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={school.preview} alt={`${school.school} website`} loading="lazy" className="aspect-[16/10] max-h-[calc(92svh-17rem)] w-full object-cover object-top" />
                <span className="absolute inset-0 grid place-items-center bg-black/0 transition group-hover:bg-black/45">
                  <span className="translate-y-2 rounded-full bg-neon px-4 py-2 text-sm font-semibold text-bg opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                    Visit website ↗
                  </span>
                </span>
              </div>
            </button>

            <AnimatePresence mode="wait" initial={false}>
              {confirming ? (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="mt-3 shrink-0 rounded-xl border border-coral/50 bg-coral/10 p-3 sm:mt-4 sm:p-4"
                >
                  <p className="text-sm font-semibold text-fg">Leave this portfolio?</p>
                  <p className="mt-1 text-xs text-fg/75 sm:text-sm">
                    You&apos;re about to open <span className="font-mono text-coral">{host}</span>, an external website, in a new tab.
                  </p>
                  <div className="mt-2 flex flex-wrap justify-end gap-2 sm:mt-3">
                    <button
                      onClick={() => setConfirming(false)}
                      className="rounded-lg border border-edge px-4 py-2 text-sm font-medium text-fg transition hover:border-fg/50"
                    >
                      Stay here
                    </button>
                    <button onClick={visit} className="rounded-lg bg-neon px-4 py-2 text-sm font-semibold text-bg transition hover:brightness-110">
                      Continue to {host} ↗
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-3 flex shrink-0 justify-end sm:mt-4">
                  <button
                    onClick={() => setConfirming(true)}
                    className="inline-flex items-center gap-2 rounded-lg border border-neon/60 px-4 py-2 text-sm font-semibold text-neon transition hover:bg-neon hover:text-bg"
                  >
                    <i className="fi fi-rr-globe flex" aria-hidden="true" />
                    Visit school website
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
      )}
    </Modal>
  );
}

/* small "click me" hint shown on every card */
function CardHint({ children }: { children: ReactNode }) {
  return (
    <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-muted transition group-hover:text-neon">
      {children} <span className="transition group-hover:translate-x-1">→</span>
    </span>
  );
}

const card =
  "glass glass-hover group relative block w-full overflow-hidden rounded-xl p-5 pl-6 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon cursor-pointer";

export function WorkList() {
  const [open, setOpen] = useState<Job | null>(null);
  return (
    <>
      <ol className="space-y-5">
        {experience.map((e) => (
          <li key={e.role + e.org}>
            <button type="button" onClick={() => setOpen(e)} aria-haspopup="dialog" className={card}>
              <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-coral shadow-[0_0_12px_rgba(255,122,102,0.8)]" />
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-lg font-semibold text-fg">{e.role}</span>
                <span className="font-mono text-xs text-muted">{e.period}</span>
              </span>
              <span className="block text-sm font-medium text-coral">{e.org}</span>
              <span className="mt-3 block space-y-1 text-sm text-fg/70">
                {e.points.map((p) => (
                  <span key={p} className="flex gap-2">
                    <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-neon" aria-hidden="true" />
                    {p}
                  </span>
                ))}
              </span>
              <CardHint>{e.proof.length ? `View proof · ${proofSummary(e.proof)}` : "View proof"}</CardHint>
            </button>
          </li>
        ))}
      </ol>
      <JobModal job={open} onClose={() => setOpen(null)} />
    </>
  );
}

export function EducationList() {
  const [open, setOpen] = useState<School | null>(null);
  return (
    <>
      <ol className="space-y-5">
        {education.map((e) => (
          <li key={e.school}>
            <button type="button" onClick={() => setOpen(e)} aria-haspopup="dialog" className={card}>
              <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-neon shadow-[0_0_12px_rgb(var(--glow)/0.8)]" />
              <span className="flex flex-wrap items-baseline justify-between gap-2">
                <span className="font-display text-lg font-semibold text-fg">{e.school}</span>
                <span className="font-mono text-xs text-muted">{e.period}</span>
              </span>
              <span className="block text-sm text-neon/90">
                {e.level}
                {e.detail && ` · ${e.detail}`}
              </span>
              {"honor" in e && e.honor && (
                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-coral/40 bg-coral/10 px-3 py-1 font-mono text-[11px] text-coral">
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                    <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                  </svg>
                  {e.honor}
                </span>
              )}
              <span className="block">
                <CardHint>View school website</CardHint>
              </span>
            </button>
          </li>
        ))}
      </ol>
      <SchoolModal school={open} onClose={() => setOpen(null)} />
    </>
  );
}
