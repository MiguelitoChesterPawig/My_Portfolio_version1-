"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion, useInView } from "motion/react";
import { projects } from "@/content/profile";
import { captionOf } from "@/lib/caption";
import { useSwipe } from "@/lib/useSwipe";
import { FlowSection } from "./FlowSection";

/* The full-screen viewer is its own chunk: it's only downloaded and mounted once a visitor
   opens a screenshot. Hovering/focusing an image warms the chunk so the first open is instant. */
const Lightbox = dynamic(() => import("./Lightbox").then((m) => m.Lightbox), { ssr: false });
const preloadLightbox = () => void import("./Lightbox");

/* Lightbox state for one gallery. `mounted` flips on at the first open and stays on, so the
   close animation can play and later opens don't re-create anything. */
function useLightbox() {
  const [zoom, setZoom] = useState<number | null>(null); // lightbox index, null = closed
  const [mounted, setMounted] = useState(false);
  const open = (i: number) => {
    setMounted(true);
    setZoom(i);
  };
  return { zoom, setZoom, mounted, open };
}

/* false while the browser tab is in the background */
function useTabVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);
  return visible;
}

/* enter from the side you swiped towards, leave through the other */
const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40 }),
};

type Project = (typeof projects)[number];
const tabs = ["Overview", "Features", "Challenges", "Diagrams"] as const;

function Tags({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <span key={t} className="rounded-md border border-neon/30 bg-neon/5 px-2.5 py-1 font-mono text-xs text-neon">
          {t}
        </span>
      ))}
    </div>
  );
}

function Links({ p }: { p: Project }) {
  if (!p.links.live && !p.links.github) return null;
  return (
    <div className="flex gap-3 text-sm font-semibold">
      {p.links.live && (
        <a href={p.links.live} target="_blank" rel="noreferrer" className="text-coral hover:underline">
          Live site ↗
        </a>
      )}
      {p.links.github && (
        <a href={p.links.github} target="_blank" rel="noreferrer" className="text-neon hover:underline">
          Code ↗
        </a>
      )}
    </div>
  );
}

function Featured({ p }: { p: Project }) {
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const [img, setImg] = useState(0);
  const [dir, setDir] = useState(1);
  const { zoom, setZoom, mounted, open } = useLightbox();
  const [paused, setPaused] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const inView = useInView(galleryRef, { amount: 0.3 });
  const tabVisible = useTabVisible();
  const label = captionOf(p.images[img]);
  const n = p.images.length;
  const go = (k: number, d: number) => {
    setDir(d);
    setImg(((k % n) + n) % n);
  };
  const swipe = useSwipe(() => go(img - 1, -1), () => go(img + 1, 1));

  // auto-advance; restarts after any manual change. Stops on hover, while the lightbox is open,
  // and whenever nobody can see it (scrolled away or tab in the background) — no timer, no image loads.
  useEffect(() => {
    if (n <= 1 || paused || zoom !== null || !inView || !tabVisible) return;
    const t = setTimeout(() => {
      setDir(1);
      setImg((k) => (k + 1) % n);
    }, 4000);
    return () => clearTimeout(t);
  }, [img, n, paused, zoom, inView, tabVisible]);

  const visibleTabs = tabs.filter((t) => (t === "Challenges" ? p.challenges.length : t === "Diagrams" ? p.diagrams.length : true));

  return (
    <article className="glass relative overflow-hidden rounded-2xl shadow-[0_0_60px_-20px_rgb(var(--glow)/0.5)]">
      <span className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent" />
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        {/* gallery */}
        <div ref={galleryRef} className="min-w-0 border-b border-edge bg-sunken p-4 lg:border-b-0 lg:border-r">
          {mounted && (
            <Lightbox title={p.name} images={p.images} index={zoom} onIndex={(k) => { setZoom(k); go(k, k >= img ? 1 : -1); }} onClose={() => setZoom(null)} />
          )}
          <button
            type="button"
            onClick={() => {
              open(img);
            }}
            {...(n > 1 ? swipe.handlers : {})}
            onMouseEnter={() => {
              setPaused(true);
              preloadLightbox();
            }}
            onMouseLeave={() => setPaused(false)}
            onFocus={preloadLightbox}
            title="View full size"
            className="relative block w-full cursor-zoom-in touch-pan-y select-none overflow-hidden rounded-lg border border-edge"
          >
            <div style={{ transform: `translateX(${swipe.dx}px)`, transition: swipe.dx ? "none" : "transform 0.2s ease-out" }}>
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.img
                  key={p.images[img]}
                  src={p.images[img]}
                  alt={`${p.name}: ${label ?? `screenshot ${img + 1}`}`}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="aspect-[21/10] w-full object-cover object-top"
                />
              </AnimatePresence>
            </div>
            {label && (
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-3 pb-2 pt-8 text-left font-mono text-[11px] uppercase tracking-widest text-white/90">
                {label}
              </span>
            )}
          </button>
          {p.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {p.images.map((src, i) => (
                <button
                  key={src}
                  onClick={() => go(i, i >= img ? 1 : -1)}
                  className={`relative h-2 flex-1 rounded-full after:absolute after:-inset-y-3 after:inset-x-0 after:content-[''] ${i === img ? "bg-coral glow-coral" : "bg-fg/20"}`}
                  aria-label={`Show screenshot ${i + 1}`}
                />
              ))}
            </div>
          )}
          <div className="mt-5 space-y-2 font-mono text-xs text-fg/70">
            <p>
              <span className="text-coral">role:</span> {p.role}
            </p>
            <p>
              <span className="text-coral">period:</span> {p.period}
            </p>
          </div>
        </div>

        {/* details */}
        <div className="min-w-0 p-5 md:p-8">
          <span className="rounded-full bg-coral px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white glow-coral">
            Featured project
          </span>
          <h3 className="mt-4 font-display text-2xl font-bold text-fg md:text-3xl">{p.name}</h3>
          <p className="mt-2 text-sm text-muted">{p.subtitle}</p>

          <div className="mt-6 flex gap-1 overflow-x-auto rounded-lg border border-edge bg-sunken p-1">
            {visibleTabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm transition ${
                  tab === t ? "bg-neon/15 text-neon shadow-[inset_0_0_0_1px_rgb(var(--glow)/0.5)]" : "text-muted hover:text-fg"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="mt-5 min-h-[180px] text-sm leading-relaxed text-fg/80"
            >
              {tab === "Overview" && (
                <div className="space-y-4">
                  <p>
                    <b className="text-neon">Problem: </b>
                    {p.problem}
                  </p>
                  <p>
                    <b className="text-neon">Solution: </b>
                    {p.solution}
                  </p>
                  {p.results.length > 0 && (
                    <ul className="space-y-1.5">
                      {p.results.map((r) => (
                        <li key={r} className="flex gap-2">
                          <span className="text-coral">✓</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
              {tab === "Features" && (
                <ul className="grid gap-2 sm:grid-cols-2">
                  {p.features.map((f) => (
                    <li key={f} className="rounded-md border border-edge bg-sunken px-3 py-2">
                      {f}
                    </li>
                  ))}
                </ul>
              )}
              {tab === "Challenges" && (
                <ol className="space-y-3">
                  {p.challenges.map((c, i) => (
                    <li key={c} className="flex gap-3">
                      <span className="shrink-0 font-mono text-xs text-coral">bug#{i + 1}</span>
                      {c}
                    </li>
                  ))}
                </ol>
              )}
              {tab === "Diagrams" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {p.diagrams.map((d) => (
                    <a key={d} href={d} target="_blank" rel="noreferrer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={d} alt="System diagram" loading="lazy" decoding="async" className="w-full rounded-lg border border-edge" />
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 space-y-4">
            <Tags items={p.tech} />
            <Links p={p} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* Screenshot gallery for a project card: arrows + dots, click the image to open it full size */
function CardGallery({ p }: { p: Project }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const { zoom, setZoom, mounted, open } = useLightbox();
  const n = p.images.length;
  const go = (k: number, d: number) => {
    setDir(d);
    setI(((k % n) + n) % n);
  };
  const swipe = useSwipe(() => go(i - 1, -1), () => go(i + 1, 1));
  const src = p.images[i];
  const label = captionOf(src);
  // phone screenshots → phone-shaped frame instead of a wide crop: the whole project (p.mobile),
  // or a single image whose name says "Mobile", e.g. "Portfolio(Mobile Home).jpg"
  const mobile = ("mobile" in p && p.mobile) || /mobile/i.test(src);

  if (n <= 1) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={`${p.name} screenshot`} loading="lazy" decoding="async" className="aspect-video w-full object-cover" />;
  }

  const arrow =
    "absolute top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full border border-edge bg-bg/80 text-fg opacity-0 backdrop-blur transition group-hover:opacity-100 hover:border-neon hover:text-neon focus-visible:opacity-100 [@media(hover:none)]:opacity-80";
  return (
    <div className="group relative touch-pan-y select-none" {...swipe.handlers}>
      {mounted && (
        <Lightbox title={p.name} images={p.images} index={zoom} onIndex={(k) => { setZoom(k); go(k, k >= i ? 1 : -1); }} onClose={() => setZoom(null)} />
      )}
      <button
        type="button"
        onClick={() => {
          open(i);
        }}
        onMouseEnter={preloadLightbox}
        onFocus={preloadLightbox}
        title="View full size"
        className={
          mobile
            ? "flex aspect-video w-full cursor-zoom-in items-center justify-center overflow-hidden bg-sunken py-3"
            : "block w-full cursor-zoom-in overflow-hidden"
        }
      >
        <div
          className={mobile ? "flex h-full w-full items-center justify-center" : undefined}
          style={{ transform: `translateX(${swipe.dx}px)`, transition: swipe.dx ? "none" : "transform 0.2s ease-out" }}
        >
          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <motion.img
              key={src}
              src={src}
              alt={`${p.name}: ${label ?? `screenshot ${i + 1}`}`}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.2 }}
              loading="lazy"
              decoding="async"
              draggable={false}
              className={
                mobile
                  ? "h-full w-auto rounded-[14px] border-[3px] border-fg/15 object-contain shadow-[0_8px_30px_-10px_rgb(var(--glow)/0.5)]"
                  : "aspect-video w-full object-cover object-top"
              }
            />
          </AnimatePresence>
        </div>
      </button>
      <button aria-label="Previous screenshot" onClick={() => go(i - 1, -1)} className={`${arrow} left-2`}>
        ‹
      </button>
      <button aria-label="Next screenshot" onClick={() => go(i + 1, 1)} className={`${arrow} right-2`}>
        ›
      </button>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 bg-gradient-to-t from-black/70 to-transparent px-3 pb-2 pt-6">
        <span className="truncate font-mono text-[10px] uppercase tracking-widest text-white/90">{label}</span>
        <span className="pointer-events-auto flex gap-1">
          {p.images.map((s, k) => (
            <button
              key={s}
              onClick={() => go(k, k >= i ? 1 : -1)}
              aria-label={`Show screenshot ${k + 1}`}
              className={`relative h-1.5 rounded-full transition-all after:absolute after:-inset-2 after:content-[''] ${k === i ? "w-4 bg-coral" : "w-1.5 bg-white/50 hover:bg-white"}`}
            />
          ))}
        </span>
      </div>
    </div>
  );
}

function Card({ p }: { p: Project }) {
  return (
    <article className="glass glass-hover flex flex-col overflow-hidden rounded-xl">
      <CardGallery p={p} />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-lg font-semibold text-fg">{p.name}</h3>
          <span className="font-mono text-xs text-muted">{p.period}</span>
        </div>
        <p className="text-sm text-muted">{p.subtitle}</p>
        <p className="text-sm text-fg/75">{p.solution}</p>
        <div className="mt-auto space-y-3 pt-2">
          <Tags items={p.tech} />
          <Links p={p} />
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  return (
    <FlowSection
      id="projects"
      step="04"
      shape="io"
      label="Output"
      title="Things I've built"
      intro="Every project starts as a flowchart on paper. Here's what came out of them."
    >
      <div className="space-y-10">
        {featured.map((p) => (
          <Featured key={p.name} p={p} />
        ))}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {others.map((p) => (
            <Card key={p.name} p={p} />
          ))}
        </div>
      </div>
    </FlowSection>
  );
}
