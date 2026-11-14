import { profile, experience, education } from "@/content/profile";
import { FlowSection } from "./FlowSection";
import { Certificates } from "./Certificates";

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
          <Certificates />
        </div>
      </div>
    </FlowSection>
  );
}

const footerNav = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#experience", label: "Experience" },
  { href: "#contact", label: "Contact" },
];

export function Footer() {
  const { email, github, linkedin, facebook, instagram } = profile.links;
  const socials = [
    { href: github, label: "GitHub", icon: "fi-brands-github" },
    { href: linkedin, label: "LinkedIn", icon: "fi-brands-linkedin" },
    { href: facebook, label: "Facebook", icon: "fi-brands-facebook" },
    { href: instagram, label: "Instagram", icon: "fi-brands-instagram" },
  ].filter((s) => s.href);
  const heading = "font-mono text-xs uppercase tracking-widest text-neon/80";

  return (
    <footer className="relative border-t border-edge">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1.2fr]">
        {/* who */}
        <div className="space-y-3 sm:col-span-2 lg:col-span-1">
          <p className="font-display text-xl font-bold text-fg">{profile.name}</p>
          <p className="text-sm font-medium text-fg/80">{profile.title}</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted">{profile.tagline}</p>
          <p className="inline-flex items-center gap-2 rounded-full border border-edge px-3 py-1 text-xs text-fg/80">
            <span className="h-2 w-2 rounded-full bg-neon" aria-hidden="true" />
            {profile.status}
          </p>
        </div>

        {/* pages */}
        <nav aria-label="Footer">
          <p className={heading}>Navigate</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {footerNav.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-muted transition hover:text-neon">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* contact */}
        <div>
          <p className={heading}>Get in touch</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li className="flex items-center gap-2.5">
              <i className="fi fi-rr-envelope flex text-neon" aria-hidden="true" />
              <a href={`mailto:${email}`} className="break-all transition hover:text-neon">
                {email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <i className="fi fi-rr-marker flex text-neon" aria-hidden="true" />
              {profile.location}
            </li>
            <li className="flex items-center gap-2.5">
              <i className="fi fi-rr-download flex text-neon" aria-hidden="true" />
              <a href={profile.cv} download="Pawig-Curriculum-Vitae.pdf" className="transition hover:text-neon">
                Download CV (PDF)
              </a>
            </li>
          </ul>
          <div className="mt-5 flex gap-2.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                title={s.label}
                className="grid h-9 w-9 place-items-center rounded-lg border border-edge text-muted transition hover:border-neon hover:text-neon"
              >
                <i className={`fi ${s.icon} flex`} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* verse */}
      <figure className="border-t border-edge px-5 py-8 text-center">
        <blockquote className="mx-auto max-w-2xl font-display text-base italic leading-relaxed text-fg/85 sm:text-lg">
          “Commit to the Lord whatever you do, and he will establish your plans.”
        </blockquote>
        <figcaption className="mt-3 font-mono text-xs uppercase tracking-widest text-neon/80">Proverbs 16:3 (NIV)</figcaption>
      </figure>

      <div className="border-t border-edge">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted sm:flex-row">
          <p>© 2026 {profile.name}. All rights reserved.</p>
          <a href="#start" className="transition hover:text-neon">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
