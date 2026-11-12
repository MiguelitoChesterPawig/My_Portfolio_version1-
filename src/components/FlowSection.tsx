"use client";

import { useRef } from "react";
import { motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { Shape } from "./Shapes";
import { useFlowTrack } from "./FlowTrack";

/* Watches the flow line and briefly turns the node coral + pops it when the line's tip passes it */
function useNodeHit() {
  const track = useFlowTrack();
  const fallback = useMotionValue(0); // used only if a section is rendered outside FlowTrack
  const nodeRef = useRef<HTMLDivElement>(null);
  const last = useRef<number | null>(null);

  useMotionValueEvent(track?.progress ?? fallback, "change", (p) => {
    const node = nodeRef.current;
    const box = track?.ref.current;
    if (!node || !box) return;
    const b = box.getBoundingClientRect();
    const n = node.getBoundingClientRect();
    const at = (n.top + n.height / 2 - b.top) / b.height; // node position along the line, 0..1
    const prev = last.current;
    last.current = p;
    // fire once each time the tip crosses the node — scrolling down or back up
    const crossedDown = prev !== null && prev < at && p >= at;
    const crossedUp = prev !== null && prev >= at && p < at;
    if (crossedDown || crossedUp) {
      node.classList.remove("node-hit");
      void node.offsetWidth; // restart the animation if it's still running
      node.classList.add("node-hit");
    }
  });

  return nodeRef;
}

/* Every section is a "node" on the glowing flowchart line */
export function FlowSection({
  id,
  step,
  shape,
  label,
  title,
  intro,
  children,
}: {
  id: string;
  step: string;
  shape: string;
  label: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
}) {
  const nodeRef = useNodeHit();
  return (
    // negative scroll-margin = skip the top padding when jumping/snapping here,
    // so the heading lands just under the nav (24px gap) instead of 112px of empty space
    <section id={id} className="relative scroll-mt-[-32px] py-14 md:scroll-mt-[-88px] md:py-28">
      {/* phones: the node sits above the heading; md+: it sits on the side flow line */}
      <div className="mb-4 md:absolute md:left-0 md:top-28 md:mb-0 md:-translate-x-1/2">
        <motion.div
          ref={nodeRef}
          onAnimationEnd={(e) => e.animationName === "node-hit" && e.currentTarget.classList.remove("node-hit")}
          initial={{ scale: 0.3, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="relative grid h-10 w-10 place-items-center rounded-full border border-neon/60 bg-bg text-neon glow-neon"
        >
          <span className="absolute inset-0 animate-ping rounded-full border border-neon/40 [animation-duration:2.5s]" />
          <Shape name={shape} className="h-5 w-5" />
        </motion.div>
      </div>

      <div className="md:pl-14">
        <motion.div
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px 0px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-coral">
            <span className="text-muted">[{step}]</span> {label}
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-fg md:text-5xl">{title}</h2>
          {intro && <p className="mt-3 max-w-2xl text-muted">{intro}</p>}
        </motion.div>
        <div className="mt-8 md:mt-10">{children}</div>
      </div>
    </section>
  );
}
