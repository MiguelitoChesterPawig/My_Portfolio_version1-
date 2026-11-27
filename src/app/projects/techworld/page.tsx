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

/* Case study page for the TechWorld capstone. All text lives in src/content/techworld.ts. */

export const metadata: Metadata = {
  title: `${t.title} case study | ${profile.name}`,
  description: t.summary,
  openGraph: { title: `${t.title} case study | ${profile.name}`, description: t.summary, type: "article" },
  twitter: { card: "summary_large_image", title: `${t.title} case study | ${profile.name}`, description: t.summary },
};

function Section({
  id,
  step,
  shape,
  title,
  children,
}: {
  id: string;
  step: string;
  shape: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-edge py-14 md:py-20">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-neon/40 bg-neon/10 text-neon">
          <Shape name={shape} className="h-5 w-5" />
        </span>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-coral">step {step}</p>
          <h2 className="font-display text-2xl font-bold text-fg md:text-3xl">{title}</h2>
        </div>
      </div>
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

export default function TechWorldCaseStudy() {
  const lowest = 4;
  const pos = (v: number) => `${((v - lowest) / (5 - lowest)) * 100}%`; // place a score on the 4.0–5.0 track

  return (
    <>
      {/* top bar */}
      <header className="sticky top-0 z-40 border-b border-edge bg-bg/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-5">
          <Link href="/#projects" className="group flex items-center gap-3 text-sm font-semibold text-fg">
            <Logo />
            <span className="text-muted transition group-hover:text-neon">← Back to portfolio</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="dot-grid">
        <div className="mx-auto max-w-6xl px-4 sm:px-5">
          {/* hero */}
          <section className="grid items-center gap-10 py-12 md:py-16 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-coral">{t.kicker}</p>
              {/* phones: size follows the screen width so the title stays on one line (fits from 320px up) */}
              <h1 className="mt-3 font-display text-[length:clamp(1.5rem,calc(9.2vw_-_3px),3rem)] font-bold leading-tight text-fg md:text-5xl">{t.title}</h1>
              <p className="mt-3 text-sm text-muted">{t.fullTitle}</p>
              <p className="mt-6 text-lg leading-relaxed text-fg/85">{t.summary}</p>
              <dl className="glass mt-8 divide-y divide-edge rounded-xl">
                {t.meta.map((m) => (
                  <div key={m.label} className="flex flex-col gap-1 px-5 py-3 text-sm sm:flex-row sm:justify-between sm:gap-4">
                    <dt className="font-mono text-xs uppercase tracking-wider text-neon/80">{m.label}</dt>
                    <dd className="font-medium text-fg sm:text-right">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="glass overflow-hidden rounded-2xl p-2 shadow-[0_0_60px_-20px_rgb(var(--glow)/0.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                {...optimized(t.cover, "(min-width: 1024px) 560px, 100vw")}
                alt="TechWorld customer landing page"
                fetchPriority="high"
                className="aspect-[16/10] w-full rounded-xl object-cover object-top"
              />
            </div>
          </section>

          {/* key numbers */}
          <section aria-label="Results at a glance" className="grid grid-cols-2 gap-3 pb-12 md:grid-cols-4">
            {t.stats.map((s) => (
              <div key={s.label} className="glass rounded-xl p-5">
                <p className="font-display text-3xl font-bold text-neon md:text-4xl">{s.value}</p>
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </section>

          {/* in-page menu */}
          <nav aria-label="Case study sections" className="-mx-4 overflow-x-auto px-4 pb-6 sm:mx-0 sm:px-0">
            <ul className="flex gap-2 whitespace-nowrap">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    className="block rounded-full border border-edge px-3.5 py-1.5 font-mono text-xs text-muted transition hover:border-neon hover:text-neon"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <Section id="problem" step="01" shape="terminator" title="The problem">
            <p className="max-w-3xl text-lg leading-relaxed text-fg/80">{t.problem.intro}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.problem.points.map((p, i) => (
                <div key={p.title} className="glass rounded-xl p-5">
                  <p className="font-mono text-xs text-coral">issue#{i + 1}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold text-fg">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg/75">{p.text}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="role" step="02" shape="process" title="My role">
            <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
              <div>
                <p className="text-lg leading-relaxed text-fg/80">{t.role.intro}</p>
                <ul className="mt-6 space-y-3 text-fg/80">
                  {t.role.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-1 text-neon">▸</span>
                      <span className="leading-relaxed">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">{"// the team"}</h3>
                <ul className="glass divide-y divide-edge rounded-xl">
                  {t.team.map((m) => (
                    <li key={m.name} className={`px-5 py-3.5 ${"me" in m ? "bg-neon/10" : ""}`}>
                      <p className="font-semibold text-fg">
                        {m.name}
                        {"me" in m && <span className="ml-2 rounded bg-coral px-1.5 py-0.5 font-mono text-[10px] uppercase text-white">me</span>}
                      </p>
                      <p className="text-sm text-muted">{m.role}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          <Section id="ai-builder" step="03" shape="decision" title="How the AI Builder works">
            <p className="max-w-3xl text-lg leading-relaxed text-fg/80">{t.builder.intro}</p>
            <ol className="mt-8 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
              {t.builder.steps.map((s, i) => (
                <li key={s.title} className="glass relative flex flex-col rounded-xl p-4">
                  <div className="flex items-center gap-2 text-neon">
                    <Shape name={s.shape} className="h-6 w-6" />
                    <span className="font-mono text-[11px] text-coral">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-3 font-display font-semibold text-fg">{s.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg/70">{s.text}</p>
                  {i < t.builder.steps.length - 1 && (
                    <span aria-hidden="true" className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-neon md:hidden">
                      ↓
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <div className="mt-4 flex gap-3 rounded-xl border border-dashed border-coral/50 bg-coral/5 p-4 text-sm text-fg/80">
              <span className="font-mono text-xs uppercase tracking-widest text-coral">fallback</span>
              <p>{t.builder.fallback}</p>
            </div>
          </Section>

          <Section id="engineering" step="04" shape="data" title="Engineering highlights">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {t.highlights.map((h) => (
                <div key={h.title} className="glass glass-hover rounded-xl p-5">
                  <span className="text-neon">
                    <Shape name={h.icon} className="h-6 w-6" />
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-fg">{h.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-fg/75">{h.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {t.stack.map((s) => (
                <span key={s} className="rounded-md border border-neon/30 bg-neon/5 px-2.5 py-1 font-mono text-xs text-neon">
                  {s}
                </span>
              ))}
            </div>
            <h3 className="mb-4 mt-12 font-mono text-xs uppercase tracking-widest text-muted">{"// screens"}</h3>
            <CaseGallery title="TechWorld" images={t.screens} />
          </Section>

          <Section id="diagrams" step="05" shape="io" title="Diagrams & fieldwork">
            <p className="max-w-3xl text-sm text-muted">{t.diagrams.credit}</p>
            <div className="mt-6">
              <CaseGallery title="TechWorld diagrams" images={t.diagrams.images} fit="contain" />
            </div>
            <h3 className="mb-3 mt-12 font-mono text-xs uppercase tracking-widest text-muted">{"// fieldwork with the client"}</h3>
            <p className="mb-6 max-w-3xl text-fg/80">{t.fieldwork.intro}</p>
            <CaseGallery title="TechWorld fieldwork" images={t.fieldwork.images} cols="grid-cols-2 lg:grid-cols-4" />
          </Section>

          <Section id="results" step="06" shape="terminal" title="Results">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
              <figure className="glass rounded-xl p-5 md:p-6">
                <figcaption className="mb-5">
                  <p className="font-display text-lg font-semibold text-fg">ISO/IEC 25010 evaluation</p>
                  <p className="text-sm text-muted">
                    37 respondents, 5-point scale. Overall <b className="text-neon">{t.overall.toFixed(2)}</b>. The track below shows 4.0 to 5.0.
                  </p>
                </figcaption>
                <ul className="space-y-4">
                  {t.scores.map((s) => (
                    <li key={s.name} className="grid grid-cols-[minmax(0,9.5rem)_1fr_2.5rem] items-center gap-3 text-sm sm:grid-cols-[11rem_1fr_2.5rem]">
                      <span className="truncate text-fg/80" title={s.name}>
                        {s.name}
                      </span>
                      <span className="relative h-2 rounded-full bg-fg/10">
                        <span className="absolute inset-y-0 left-0 rounded-full bg-neon/35" style={{ width: pos(s.value) }} />
                        <span
                          className="absolute top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg bg-neon"
                          style={{ left: pos(s.value) }}
                        />
                      </span>
                      <span className="text-right font-mono text-fg">{s.value.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 grid grid-cols-[minmax(0,9.5rem)_1fr_2.5rem] gap-3 font-mono text-[10px] text-muted sm:grid-cols-[11rem_1fr_2.5rem]">
                  <span />
                  <span className="flex justify-between">
                    <span>4.0</span>
                    <span>4.5</span>
                    <span>5.0</span>
                  </span>
                  <span />
                </div>
              </figure>
              <div className="glass rounded-xl p-5 md:p-6">
                <p className="font-display text-lg font-semibold text-fg">Testing: 64 of 64 passed</p>
                <ul className="mt-4 divide-y divide-edge text-sm">
                  {t.testing.map((x) => (
                    <li key={x.label} className="flex justify-between gap-4 py-2.5">
                      <span className="text-fg/80">{x.label}</span>
                      <span className="font-mono text-neon">{x.value}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-sm text-muted">
                  User acceptance: 350 of 350 checklist answers were &quot;Yes&quot; from 30 customers, 2 managers and 5 IT experts.
                </p>
              </div>
            </div>
          </Section>

          <Section id="recognition" step="07" shape="terminator" title={t.recognition.title}>
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
              <div>
                <p className="text-lg leading-relaxed text-fg/80">{t.recognition.text}</p>
                <ol className="mt-8 space-y-0">
                  {t.recognition.journey.map((step, i, all) => {
                    const last = i === all.length - 1;
                    return (
                      <li key={step} className="relative flex gap-4 pb-6 last:pb-0">
                        {!last && <span aria-hidden="true" className="absolute left-[11px] top-6 h-full w-px bg-neon/40" />}
                        <span
                          className={`relative z-10 mt-0.5 h-6 w-6 shrink-0 rounded-full border-2 ${last ? "border-coral bg-coral glow-coral" : "border-neon bg-bg"}`}
                        />
                        <span className={last ? "font-display font-semibold text-coral" : "text-fg/85"}>{step}</span>
                      </li>
                    );
                  })}
                </ol>
                <p className="mt-6 font-mono text-xs text-muted">source: {t.recognition.source}</p>
              </div>
              <FacebookEmbed url={t.recognition.post} title="ETPCP-AI Best Capstone nominee post and journey video" />
            </div>
          </Section>

          <Section id="next" step="08" shape="decision" title="What I'd improve next">
            <p className="max-w-3xl text-lg leading-relaxed text-fg/80">{t.next.intro}</p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {t.next.points.map((p) => (
                <div key={p.item} className="glass rounded-xl p-5">
                  <p className="font-display text-3xl font-bold text-coral">{p.score}</p>
                  <p className="mt-1 text-sm text-muted">{p.item}</p>
                  <p className="mt-3 font-medium text-fg">→ {p.fix}</p>
                </div>
              ))}
            </div>
            <h3 className="mb-3 mt-10 font-mono text-xs uppercase tracking-widest text-muted">{"// later"}</h3>
            <ul className="space-y-2 text-fg/80">
              {t.next.later.map((l) => (
                <li key={l} className="flex gap-3">
                  <span className="text-neon">▸</span>
                  {l}
                </li>
              ))}
            </ul>
          </Section>

          {/* end node */}
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
              <Link href="/#projects" className="text-muted underline-offset-4 hover:text-neon hover:underline">
                See other projects
              </Link>
            </div>
          </section>
        </div>
      </main>
      <BackToTop />
    </>
  );
}
