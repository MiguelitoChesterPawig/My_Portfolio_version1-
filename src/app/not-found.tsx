import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { Shape } from "@/components/Shapes";

/* Shown for any URL that doesn't exist (a typo, an old link), so visitors always have a way back. */

export const metadata: Metadata = {
  title: `Page not found | ${profile.name}`,
};

export default function NotFound() {
  return (
    <main className="dot-grid grid min-h-dvh place-items-center px-4 py-16 text-center">
      <div className="max-w-md">
        {/* a decision diamond with nowhere to go — on theme with the flowchart site */}
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-coral/50 bg-coral/10 text-coral">
          <Shape name="decision" className="h-8 w-8" />
        </span>
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-coral">error 404 · dead end</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-fg md:text-4xl">This path isn&apos;t in the flowchart</h1>
        <p className="mt-3 text-muted">The page you opened doesn&apos;t exist or was moved. Here are a few ways back:</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link href="/" className="rounded-lg bg-coral px-5 py-2.5 text-white transition hover:bg-coral-deep glow-coral">
            Go to the home page
          </Link>
          <Link href="/#projects" className="rounded-lg border border-edge px-5 py-2.5 text-fg transition hover:border-neon hover:text-neon">
            See my projects
          </Link>
          <Link href="/#contact" className="rounded-lg border border-edge px-5 py-2.5 text-fg transition hover:border-neon hover:text-neon">
            Contact me
          </Link>
        </div>
      </div>
    </main>
  );
}
