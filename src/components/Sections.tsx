import { profile, experience, education, certificates } from "@/content/profile";
import { FlowSection } from "./FlowSection";

export function About() {
  return (
    <FlowSection id="about" step="02" shape="process" label="Process" title="About me">
      <div className="grid gap-8 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4 text-lg leading-relaxed text-fg/80">
          {profile.about.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        <dl className="glass h-fit divide-y divide-edge rounded-xl">
          {profile.quickFacts.map((f) => (
            <div key={f.label} className="flex justify-between gap-4 px-5 py-3.5 text-sm">
              <dt className="font-mono text-xs uppercase tracking-wider text-neon/80">{f.label}</dt>
              <dd className="text-right font-medium text-fg">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </FlowSection>
  );
}

export function Experience() {
  return (
    <FlowSection
      id="experience"
      step="05"
      shape="data"
      label="Data"
      title="Experience & education"
      intro="I'm a working student. My jobs outside IT taught me how to handle clients, solve problems with my hands and stay calm under pressure."
    >
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="mb-5 font-mono text-xs uppercase tracking-widest text-muted">{"// work"}</h3>
          <ol className="space-y-5">
            {experience.map((e) => (
              <li key={e.role + e.org} className="glass glass-hover relative overflow-hidden rounded-xl p-5 pl-6">
                <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-coral shadow-[0_0_12px_rgba(255,122,102,0.8)]" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-display text-lg font-semibold text-fg">{e.role}</h4>
                  <span className="font-mono text-xs text-muted">{e.period}</span>
                </div>
                <p className="text-sm font-medium text-coral">{e.org}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-fg/70 marker:text-neon">
                  {e.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
        <div>
          <h3 className="mb-5 font-mono text-xs uppercase tracking-widest text-muted">{"// education"}</h3>
          <ol className="space-y-5">
            {education.map((e) => (
              <li key={e.school} className="glass glass-hover relative overflow-hidden rounded-xl p-5 pl-6">
                <span className="absolute bottom-0 left-0 top-0 w-[3px] bg-neon shadow-[0_0_12px_rgb(var(--glow)/0.8)]" />
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="font-display text-lg font-semibold text-fg">{e.school}</h4>
                  <span className="font-mono text-xs text-muted">{e.period}</span>
                </div>
                <p className="text-sm text-neon/90">
                  {e.level}
                  {e.detail && ` · ${e.detail}`}
                </p>
                {"honor" in e && e.honor && (
                  <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-coral/40 bg-coral/10 px-3 py-1 font-mono text-[11px] text-coral">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7L12 2z" />
                    </svg>
                    {e.honor}
                  </span>
                )}
              </li>
            ))}
          </ol>

          <h3 className="mb-5 mt-10 font-mono text-xs uppercase tracking-widest text-muted">{"// certificates & seminars"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {certificates.map((c, i) => (
              <a
                key={c.title + i}
                href={c.link || c.image}
                target="_blank"
                rel="noreferrer"
                className="glass glass-hover overflow-hidden rounded-xl"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.title} className="aspect-[4/3] w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm font-semibold text-fg">{c.title}</p>
                  <p className="text-xs text-muted">
                    {c.issuer} · {c.date}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </FlowSection>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-edge">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 py-8 text-sm text-muted md:flex-row">
        <p>© 2026 {profile.name}</p>
        <p className="font-mono text-xs">
          <span className="text-neon">●</span> designed like a flowchart · built with Next.js
        </p>
      </div>
    </footer>
  );
}
