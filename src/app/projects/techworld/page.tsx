import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { techworld as t } from "@/content/techworld";
import { optimized } from "@/lib/optimized";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Shape } from "@/components/Shapes";
import { CaseGallery } from "@/components/CaseGallery";
import { BackToTop } from "@/components/BackToTop";
import { FacebookEmbed } from "@/components/FacebookEmbed";
import { AutoVideo } from "@/components/AutoVideo";
import { StartAtTop } from "@/components/StartAtTop";
import { CaseNav } from "@/components/CaseNav";
import { BuilderFlow } from "@/components/BuilderFlow";
import { ScreenTabs } from "@/components/ScreenTabs";
import { Reveal } from "@/components/Reveal";

/* Case study page for the TechWorld capstone. All text lives in src/content/techworld.ts.
   Built to be skimmed: each section opens with a one-line takeaway, then shows it as a visual. */

export const metadata: Metadata = {
  title: `${t.title} case study | ${profile.name}`,
  description: t.summary,
  openGraph: { title: `${t.title} case study | ${profile.name}`, description: t.summary, type: "article" },
  twitter: { card: "summary_large_image", title: `${t.title} case study | ${profile.name}`, description: t.summary },
};

function Section({
  id,
  n,
  title,
  lead,
  children,
}: {
  id: string;
  n: number;
  title: string;
  lead?: string; // the one-line takeaway under the title
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-32 py-16 md:py-24">
      <Reveal>
        <div className="mb-10 md:mb-12">
          <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-coral">
            <span>{String(n).padStart(2, "0")}</span>
            <span className="h-px w-10 bg-coral/50" />
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-fg md:text-4xl">{title}</h2>
          {lead && <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">{lead}</p>}
        </div>
      </Reveal>
      {children}
    </section>
  );
}

// Other ways to reach me, taken from profile.ts (an empty link there hides the button here too)
const contactLinks = [
  { label: "Email", icon: "fi-rr-envelope", href: profile.links.email && `mailto:${profile.links.email}` },
  { label: "WhatsApp", icon: "fi-brands-whatsapp", href: profile.links.whatsapp },
  { label: "LinkedIn", icon: "fi-brands-linkedin", href: profile.links.linkedin },
  { label: "Call", icon: "fi-rr-phone-call", href: profile.links.phone && `tel:+63${profile.links.phone.replace(/\D/g, "").replace(/^0/, "")}` },
].filter((c) => c.href);

const toc = [
  ["problem", "Problem"],
  ["role", "My role"],
  ["ai-builder", "AI Builder"],
  ["engineering", "Engineering"],
  ["diagrams", "Diagrams"],
  ["results", "Results"],
  ["recognition", "Best Capstone"],
  ["next", "What's next"],
] as const;

const initials = (name: string) =>
  name
    .split(" ")
    .filter((w) => /^[A-Z]/.test(w) && !w.endsWith("."))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

export default function TechWorldCaseStudy() {
  const lowest = 4;
  const pos = (v: number) => `${((v - lowest) / (5 - lowest)) * 100}%`; // place a score on the 4.0–5.0 track
  const ring = 2 * Math.PI * 52; // circumference of the overall-score ring
  const totalTests = t.testing.reduce((sum, x) => sum + parseInt(x.value), 0);
  const testShades = ["bg-neon", "bg-neon/75", "bg-neon/55", "bg-neon/40", "bg-coral"];
  const role = t.meta.find((m) => m.label === "My role")?.value;
  const facts = t.meta.filter((m) => m.label !== "My role");

  return (
    <>
      {/* top bar */}
      <StartAtTop />
      <header className="sticky top-0 z-40 border-b border-edge bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <Link href="/" aria-label="Home" className="shrink-0">
              <Logo />
            </Link>
            {/* a real button, so visitors use it instead of the phone's back key (which may leave the site) */}
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-neon/50 bg-neon/10 py-2 pl-3 pr-4 text-sm font-semibold text-neon transition hover:bg-neon hover:text-bg"
            >
              <i className="fi fi-rr-arrow-small-left flex text-base" aria-hidden="true" />
              <span className="sm:hidden">Portfolio</span>
              <span className="hidden sm:inline">Back to portfolio</span>
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="dot-grid">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          {/* ---------- hero ---------- */}
          <section className="grid items-center gap-10 pb-12 pt-10 md:pt-16 lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-coral/40 bg-coral/10 px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-coral">
                <i className="fi fi-rr-graduation-cap flex" aria-hidden="true" />
                {t.kicker}
              </p>
              {/* phones: size follows the screen width so the title stays on one line (fits from 320px up) */}
              <h1 className="mt-4 font-display text-[length:clamp(1.5rem,calc(9.2vw_-_3px),3rem)] font-bold leading-tight text-fg md:text-6xl">
                {t.title}
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-fg/85 md:text-xl">{t.summary}</p>
              {role && (
                <p className="mt-6 flex items-start gap-3 text-sm">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neon text-bg">
                    <i className="fi fi-rr-user flex" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-muted">my role</span>
                    <span className="font-semibold text-fg">{role}</span>
                  </span>
                </p>
              )}
              <ul className="mt-5 flex flex-wrap gap-2 text-xs">
                {facts.map((m) => (
                  <li key={m.label} className="rounded-full border border-edge px-3 py-1 text-fg/80">
                    <span className="text-muted">{m.label}: </span>
                    {m.value}
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3 text-sm font-semibold">
                <a href="#ai-builder" className="rounded-lg bg-coral px-5 py-2.5 text-white transition hover:bg-coral-deep glow-coral">
                  See how the AI works
                </a>
                <a href="#results" className="rounded-lg border border-edge px-5 py-2.5 text-fg transition hover:border-neon hover:text-neon">
                  Jump to results
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative">
                <div aria-hidden="true" className="absolute -inset-6 rounded-[2rem] bg-neon/10 blur-3xl" />
                <div className="glass relative overflow-hidden rounded-2xl shadow-[0_0_60px_-20px_rgb(var(--glow)/0.5)]">
                  <div className="flex items-center gap-1.5 border-b border-edge px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-coral/80" />
                    <span className="h-2.5 w-2.5 rounded-full bg-fg/25" />
                    <span className="h-2.5 w-2.5 rounded-full bg-neon/70" />
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    {...optimized(t.cover, "(min-width: 1024px) 600px, 100vw")}
                    alt="TechWorld customer landing page"
                    fetchPriority="high"
                    className="aspect-[16/10] w-full object-cover object-top"
                  />
                </div>
              </div>
            </Reveal>
          </section>

          {/* ---------- key numbers: one band, no boxes ---------- */}
          <Reveal>
            <section aria-label="Results at a glance" className="grid grid-cols-2 gap-y-6 border-y border-edge py-8 md:grid-cols-4 md:divide-x md:divide-edge">
              {t.stats.map((s) => (
                <div key={s.label} className="px-2 md:px-6">
                  <p className="font-display text-4xl font-bold text-neon glow-text md:text-5xl">{s.value}</p>
                  <p className="mt-1 text-sm leading-snug text-muted">{s.label}</p>
                </div>
              ))}
            </section>
          </Reveal>

          <p className="mt-6 text-sm text-muted">{t.fullTitle}</p>

          {/* ---------- full system walkthrough video ---------- */}
          <Reveal>
            <section aria-label="System walkthrough video" className="pt-12 md:pt-16">
              <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-coral">
                <i className="fi fi-rr-play flex" aria-hidden="true" />
                <span>system demo</span>
                <span className="h-px w-10 bg-coral/50" />
              </p>
              <h2 className="mt-3 font-display text-2xl font-bold text-fg md:text-3xl">A video showing how the whole system works</h2>
              <div className="glass mt-6 overflow-hidden rounded-2xl shadow-[0_0_60px_-20px_rgb(var(--glow)/0.5)]">
                <AutoVideo src={t.video} title="ETPCP-AI full system walkthrough video" />
              </div>
            </section>
          </Reveal>

          {/* must stay a direct child of this wrapper, or it can't stick while scrolling */}
          <CaseNav items={toc} />

          {/* ---------- 01 problem: before → after ---------- */}
          <Section id="problem" n={1} title="The problem" lead={t.problem.intro}>
            <div className="mb-4 hidden grid-cols-[1fr_2.5rem_1fr] gap-4 font-mono text-[11px] uppercase tracking-widest md:grid">
              <span className="text-coral">before · manual</span>
              <span />
              <span className="text-neon">after · ETPCP-AI</span>
            </div>
            {/* phones: one card per problem — what was wrong on top, what fixed it underneath */}
            <ol className="space-y-4 md:hidden">
              {t.problem.points.map((p, i) => (
                <li key={p.title}>
                  <Reveal delay={i * 0.05} className="overflow-hidden rounded-2xl border border-edge">
                    <div className="bg-coral/[0.06] p-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-coral/15 text-coral">
                          <i className={`fi ${p.icon} flex`} aria-hidden="true" />
                        </span>
                        <span className="font-mono text-[10px] uppercase tracking-widest text-coral">
                          problem {i + 1} of {t.problem.points.length}
                        </span>
                      </div>
                      <p className="mt-3 font-display text-lg font-semibold leading-snug text-fg">{p.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-fg/70">{p.text}</p>
                    </div>
                    <div className="flex items-start gap-3 border-t border-neon/25 bg-neon/[0.08] p-4">
                      <i className="fi fi-rr-check-circle mt-0.5 flex shrink-0 text-lg text-neon" aria-hidden="true" />
                      <p>
                        <span className="block font-mono text-[10px] uppercase tracking-widest text-neon">how we fixed it</span>
                        <span className="font-medium text-fg">{p.fix}</span>
                      </p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>

            {/* tablet / desktop: before → after side by side */}
            <ul className="hidden space-y-3 md:block">
              {t.problem.points.map((p, i) => (
                <li key={p.title}>
                  <Reveal delay={i * 0.05} className="grid items-center gap-2 md:grid-cols-[1fr_2.5rem_1fr] md:gap-4">
                    <div className="flex gap-4 rounded-xl border border-coral/20 bg-coral/[0.04] p-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-coral/15 text-coral">
                        <i className={`fi ${p.icon} flex text-lg`} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-display font-semibold text-fg">{p.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-fg/65">{p.text}</p>
                      </div>
                    </div>
                    <span aria-hidden="true" className="grid place-items-center text-neon">
                      <i className="fi fi-rr-arrow-small-right flex rotate-90 text-xl md:rotate-0" />
                    </span>
                    <p className="flex items-center gap-3 rounded-xl border border-neon/25 bg-neon/[0.06] p-4 font-medium text-fg">
                      <i className="fi fi-rr-check-circle flex shrink-0 text-lg text-neon" aria-hidden="true" />
                      {p.fix}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </Section>

          {/* ---------- 02 role ---------- */}
          <Section id="role" n={2} title="My role" lead={t.role.intro}>
            <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {t.role.points.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.05} className="flex gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-neon/40 bg-neon/10 text-neon">
                    <i className={`fi ${p.icon} flex text-xl`} aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-fg">{p.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-fg/70">{p.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-12">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">the team · {t.team.length} people</h3>
              <ul className="flex flex-wrap gap-3">
                {t.team.map((m) => {
                  const me = "me" in m;
                  return (
                    <li
                      key={m.name}
                      className={`flex items-center gap-3 rounded-full border py-1.5 pl-1.5 pr-4 ${me ? "border-coral/60 bg-coral/10" : "border-edge"}`}
                    >
                      <span
                        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-xs font-bold ${
                          me ? "bg-coral text-white" : "bg-fg/10 text-fg/80"
                        }`}
                      >
                        {initials(m.name)}
                      </span>
                      <span className="leading-tight">
                        <span className="block text-sm font-semibold text-fg">
                          {m.name}
                          {me && <span className="ml-1.5 font-mono text-[10px] uppercase text-coral">· me</span>}
                        </span>
                        <span className="block text-xs text-muted">{m.role}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </Section>

          {/* ---------- 03 AI builder ---------- */}
          <Section id="ai-builder" n={3} title="How the AI Builder works" lead={t.builder.intro}>
            <Reveal>
              <BuilderFlow steps={t.builder.steps} fallback={t.builder.fallback} />
            </Reveal>
          </Section>

          {/* ---------- 04 engineering ---------- */}
          <Section id="engineering" n={4} title="Engineering highlights" lead="The hard problems behind a store that sells real stock to many people at once.">
            <Reveal>
              <ScreenTabs title="TechWorld" images={t.screens} />
            </Reveal>

            <div className="mt-14 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {t.highlights.map((h, i) => (
                <Reveal key={h.title} delay={(i % 3) * 0.05} className="border-l-2 border-neon/40 pl-5">
                  <span className="text-neon">
                    <Shape name={h.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-2 font-display text-lg font-semibold text-fg">{h.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-fg/70">{h.text}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-12 flex flex-wrap items-center gap-2">
              <span className="mr-2 font-mono text-xs uppercase tracking-widest text-muted">built with</span>
              {t.stack.map((s) => (
                <span key={s} className="rounded-md border border-neon/30 bg-neon/5 px-2.5 py-1 font-mono text-xs text-neon">
                  {s}
                </span>
              ))}
            </Reveal>
          </Section>

          {/* ---------- 05 diagrams & fieldwork ---------- */}
          <Section id="diagrams" n={5} title="Diagrams & fieldwork" lead={t.fieldwork.intro}>
            <Reveal>
              <CaseGallery title="TechWorld fieldwork" images={t.fieldwork.images} cols="grid-cols-2 lg:grid-cols-4" />
            </Reveal>
            <Reveal className="mt-14">
              <h3 className="font-display text-xl font-semibold text-fg">System diagrams</h3>
              <p className="mb-6 mt-1 max-w-3xl text-sm text-muted">{t.diagrams.credit} Tap any diagram to zoom in.</p>
              <CaseGallery title="TechWorld diagrams" images={t.diagrams.images} fit="contain" />
            </Reveal>
          </Section>

          {/* ---------- 06 results ---------- */}
          <Section
            id="results"
            n={6}
            title="Results"
            lead={`Every test passed, every acceptance answer was "Yes", and ${t.stats[3].value} evaluators rated it ${t.overall.toFixed(2)} out of 5.`}
          >
            <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
              {/* quality scores */}
              <Reveal className="glass rounded-2xl p-6 md:p-8">
                <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
                  <figure className="relative mx-auto h-36 w-36 shrink-0 sm:mx-0" aria-label={`Overall ${t.overall.toFixed(2)} out of 5`}>
                    <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                      <circle cx="60" cy="60" r="52" fill="none" strokeWidth="10" className="stroke-fg/10" />
                      <circle
                        cx="60"
                        cy="60"
                        r="52"
                        fill="none"
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="stroke-neon"
                        strokeDasharray={ring}
                        strokeDashoffset={ring * (1 - t.overall / 5)}
                      />
                    </svg>
                    <figcaption className="absolute inset-0 grid place-content-center text-center">
                      <span className="font-display text-3xl font-bold text-fg">{t.overall.toFixed(2)}</span>
                      <span className="font-mono text-[10px] text-muted">out of 5</span>
                    </figcaption>
                  </figure>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold text-fg">ISO/IEC 25010 quality rating</p>
                    <p className="mb-5 text-xs text-muted">{t.stats[3].value} respondents · bars show the 4.0 to 5.0 range</p>
                    <ul className="space-y-3">
                      {t.scores.map((s) => (
                        <li key={s.name} className="text-sm">
                          <div className="mb-1 flex justify-between gap-3">
                            <span className="text-fg/80">{s.name}</span>
                            <span className="font-mono text-fg">{s.value.toFixed(2)}</span>
                          </div>
                          <span className="relative block h-2 rounded-full bg-fg/10">
                            <span className="absolute inset-y-0 left-0 rounded-full bg-neon" style={{ width: pos(s.value) }} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>

              {/* testing */}
              <Reveal delay={0.08} className="glass flex flex-col rounded-2xl p-6 md:p-8">
                <p className="font-display text-5xl font-bold text-neon glow-text">
                  {totalTests}/{totalTests}
                </p>
                <p className="mt-1 font-display text-lg font-semibold text-fg">tests passed</p>
                <div className="mt-6 flex h-3 overflow-hidden rounded-full" aria-hidden="true">
                  {t.testing.map((x, i) => (
                    <span key={x.label} className={`${testShades[i % testShades.length]} border-r-2 border-bg last:border-r-0`} style={{ width: `${(parseInt(x.value) / totalTests) * 100}%` }} />
                  ))}
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {t.testing.map((x, i) => (
                    <li key={x.label} className="flex items-center gap-3">
                      <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${testShades[i % testShades.length]}`} />
                      <span className="flex-1 text-fg/80">{x.label}</span>
                      <span className="font-mono text-xs text-muted">{x.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto flex items-start gap-3 border-t border-edge pt-5 text-sm text-fg/80">
                  <i className="fi fi-rr-check-circle mt-0.5 flex shrink-0 text-neon" aria-hidden="true" />
                  <span>
                    <b className="text-fg">User acceptance: 350 of 350 &quot;Yes&quot;</b> from 30 customers, 2 managers and 5 IT experts.
                  </span>
                </p>
              </Reveal>
            </div>
          </Section>

          {/* ---------- 07 recognition ---------- */}
          <Section id="recognition" n={7} title={t.recognition.title} lead={t.recognition.text}>
            {/* the journey as a horizontal track */}
            <Reveal>
              <ol className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-5 sm:gap-0">
                {t.recognition.journey.map((step, i, all) => {
                  const last = i === all.length - 1;
                  return (
                    <li key={step} className="relative flex items-center gap-3 sm:flex-col sm:gap-3 sm:text-center">
                      {!last && <span aria-hidden="true" className="absolute left-1/2 top-3 hidden h-px w-full bg-neon/40 sm:block" />}
                      <span
                        className={`relative z-10 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${
                          last ? "border-coral bg-coral text-white glow-coral" : "border-neon bg-bg"
                        }`}
                      >
                        {last && <i className="fi fi-rr-trophy flex text-[10px]" aria-hidden="true" />}
                      </span>
                      <span className={`text-sm ${last ? "font-display font-semibold text-coral" : "text-fg/85"}`}>{step}</span>
                    </li>
                  );
                })}
              </ol>
            </Reveal>
            <Reveal>
              <FacebookEmbed url={t.recognition.post} title="ETPCP-AI Best Capstone nominee post and journey video" />
              <p className="mt-4 text-center font-mono text-xs text-muted">source: {t.recognition.source}</p>
            </Reveal>
          </Section>

          {/* ---------- 08 next ---------- */}
          <Section id="next" n={8} title="What I'd improve next" lead={t.next.intro}>
            <Reveal>
              <ul className="glass divide-y divide-edge rounded-2xl">
                {t.next.points.map((p) => (
                  <li key={p.item} className="grid items-center gap-3 p-5 md:grid-cols-[5rem_1fr_auto_1fr] md:gap-6 md:p-6">
                    <span className="font-display text-3xl font-bold text-coral">{p.score}</span>
                    <span className="text-sm italic text-muted">{p.item}</span>
                    <i className="fi fi-rr-arrow-small-right hidden text-xl text-neon md:flex" aria-hidden="true" />
                    <span className="font-medium text-fg">{p.fix}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="mt-10">
              <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">and later</h3>
              <ul className="grid gap-3 md:grid-cols-3">
                {t.next.later.map((l) => (
                  <li key={l} className="flex gap-3 text-sm leading-relaxed text-fg/80">
                    <i className="fi fi-rr-flask mt-0.5 flex shrink-0 text-neon" aria-hidden="true" />
                    {l}
                  </li>
                ))}
              </ul>
            </Reveal>
          </Section>

          {/* ---------- end node ---------- */}
          <section className="border-t border-edge py-16 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-coral/50 text-coral">
              <Shape name="terminator" className="h-6 w-6" />
            </span>
            <h2 className="mt-4 font-display text-2xl font-bold text-fg md:text-3xl">Want to know more about this project?</h2>
            <p className="mx-auto mt-2 max-w-xl text-muted">
              I&apos;d be glad to tell you how we planned it with the client, how we tested it, and show you a live demo of the system.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
              <Link href="/#contact" className="rounded-lg bg-coral px-5 py-2.5 text-white transition hover:bg-coral-deep glow-coral">
                Send me a message
              </Link>
              {contactLinks.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  {...(c.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="inline-flex items-center gap-2 rounded-lg border border-edge px-5 py-2.5 text-fg transition hover:border-neon hover:text-neon"
                >
                  <i className={`fi ${c.icon} flex`} aria-hidden="true" />
                  {c.label}
                </a>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm">
              <a href={profile.cv} target="_blank" rel="noreferrer" className="text-muted underline-offset-4 hover:text-neon hover:underline">
                Download CV
              </a>
            </div>
            <Link
              href="/#projects"
              className="mt-10 inline-flex items-center gap-2 rounded-full border border-neon/50 bg-neon/10 px-5 py-2.5 text-sm font-semibold text-neon transition hover:bg-neon hover:text-bg"
            >
              <i className="fi fi-rr-arrow-small-left flex text-base" aria-hidden="true" />
              Back to portfolio · see other projects
            </Link>
          </section>
        </div>
      </main>
      <BackToTop />
    </>
  );
}
