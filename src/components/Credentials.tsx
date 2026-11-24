"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { experience, education } from "@/content/profile";
import { captionOf } from "@/lib/caption";
import { useSwipe } from "@/lib/useSwipe";

type Job = (typeof experience)[number];
type School = (typeof education)[number];

/* ---------- shared modal shell ----------
   Portal into <body> (glass cards use backdrop-filter, which would trap a fixed overlay).
   Esc closes, page scroll is locked while open. */
function Modal({ open, onClose, label, children }: { open: boolean; onClose: () => void; label: string; children: ReactNode }) {
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
            className="relative flex max-h-[92svh] w-full max-w-3xl flex-col overflow-hidden rounded-t-2xl border border-edge bg-bg shadow-[0_0_80px_-20px_rgb(var(--glow)/0.5)] sm:rounded-2xl"
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
    <div className="flex items-start justify-between gap-4 border-b border-edge px-5 py-4 sm:px-6">
      <div className="min-w-0">
        <p className={`font-mono text-[11px] uppercase tracking-widest ${accent === "coral" ? "text-coral" : "text-neon"}`}>{kicker}</p>
        <h3 className="mt-1 font-display text-lg font-semibold leading-snug text-fg sm:text-xl">{title}</h3>
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

/* ---------- experience: proof photo gallery ---------- */
function ProofGallery({ title, images }: { title: string; images: string[] }) {
  const [i, setI] = useState(0);
  const n = images.length;
  const go = (d: number) => setI((k) => (k + d + n) % n);
  const swipe = useSwipe(() => go(-1), () => go(1));

  if (n === 0) {
    return (
      <div className="grid place-items-center gap-2 rounded-xl border border-dashed border-edge bg-fg/[0.03] px-6 py-12 text-center">
        <i className="fi fi-rr-picture flex text-2xl text-muted" aria-hidden="true" />
        <p className="text-sm font-medium text-fg/80">Proof photos coming soon</p>
        <p className="max-w-xs text-xs text-muted">Photos from this job are being added. Feel free to ask me about it directly.</p>
      </div>
    );
  }

  const caption = captionOf(images[i]) ?? `Photo ${i + 1}`;
  const arrow =
    "absolute top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/50 text-xl text-white backdrop-blur transition hover:border-neon hover:text-neon";
  return (
    <div>
      <div className="relative overflow-hidden rounded-xl border border-edge bg-black/40 touch-pan-y" {...(n > 1 ? swipe.handlers : {})}>
        <AnimatePresence mode="wait">
          { }
          <motion.img
            key={images[i]}
            src={images[i]}
            alt={`${title}: ${caption}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            draggable={false}
            className="mx-auto max-h-[50svh] w-full select-none object-contain"
            style={{ transform: `translateX(${swipe.dx}px)` }}
          />
        </AnimatePresence>
        {n > 1 && (
          <>
            <button aria-label="Previous photo" onClick={() => go(-1)} className={`${arrow} left-2`}>
              ‹
            </button>
            <button aria-label="Next photo" onClick={() => go(1)} className={`${arrow} right-2`}>
              ›
            </button>
          </>
        )}
      </div>
      <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-neon">
        {caption} · {i + 1}/{n}
      </p>
      {n > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {images.map((s, k) => (
            <button
              key={s}
              onClick={() => setI(k)}
              aria-label={`Show photo ${k + 1}`}
              className={`shrink-0 overflow-hidden rounded-md border-2 transition ${k === i ? "border-coral" : "border-transparent opacity-50 hover:opacity-100"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt="" loading="lazy" className="h-12 w-20 object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function JobModal({ job, onClose }: { job: Job | null; onClose: () => void }) {
  return (
    <Modal open={!!job} onClose={onClose} label={job ? `${job.role}: proof of work` : ""}>
      {job && (
        <>
          <ModalHeader kicker="// proof of work" title={job.role} sub={job.org} period={job.period} accent="coral" onClose={onClose} />
          <div className="space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
            <ProofGallery key={job.role} title={job.role} images={job.proof} />
            <ul className="list-disc space-y-1 pl-5 text-sm text-fg/75 marker:text-neon">
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
          <div className="overflow-y-auto px-5 py-5 sm:px-6">
            {/* screenshot inside a small browser frame; clicking it asks before leaving */}
            <button
              onClick={() => setConfirming(true)}
              aria-label={`Visit ${host}`}
              className="group block w-full overflow-hidden rounded-xl border border-edge text-left transition hover:border-neon"
            >
              <div className="flex items-center gap-2 border-b border-edge bg-fg/[0.04] px-3 py-2">
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
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={school.preview} alt={`${school.school} website`} loading="lazy" className="aspect-[16/10] w-full object-cover object-top" />
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
                  className="mt-4 rounded-xl border border-coral/50 bg-coral/10 p-4"
                >
                  <p className="text-sm font-semibold text-fg">Leave this portfolio?</p>
                  <p className="mt-1 text-sm text-fg/75">
                    You&apos;re about to open <span className="font-mono text-coral">{host}</span>, an external website, in a new tab.
                  </p>
                  <div className="mt-3 flex flex-wrap justify-end gap-2">
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
                <motion.div key="cta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-4 flex justify-end">
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
              <CardHint>{e.proof.length ? `View proof (${e.proof.length})` : "View proof"}</CardHint>
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
