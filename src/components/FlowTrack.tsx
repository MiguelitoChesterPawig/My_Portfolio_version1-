"use client";

import { createContext, useContext, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";

/* Shared with each FlowSection so its node can "pop" the moment the line's tip reaches it */
type Track = { progress: MotionValue<number>; ref: React.RefObject<HTMLDivElement | null> };
const TrackContext = createContext<Track | null>(null);
export const useFlowTrack = () => useContext(TrackContext);

/* The glowing flowchart line that fills as you scroll, with a moving "data pulse" */
export function FlowTrack({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const top = useTransform(scaleY, (v) => `${v * 100}%`);

  return (
    <TrackContext.Provider value={{ progress: scaleY, ref }}>
      <div ref={ref} className="relative ml-5 md:ml-8">
        <div className="absolute bottom-0 left-0 top-0 w-px -translate-x-1/2 bg-edge" />
        <motion.div
          style={{ scaleY }}
          className="absolute bottom-0 left-0 top-0 w-[2px] origin-top -translate-x-1/2 bg-gradient-to-b from-neon via-neon to-coral shadow-[0_0_12px_rgb(var(--glow)/0.8)]"
        />
        {/* the pulse at the tip of the line */}
        <motion.div
          style={{ top }}
          className="absolute left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-coral shadow-[0_0_16px_4px_rgba(255,122,102,0.7)]"
        />
        {children}
      </div>
    </TrackContext.Provider>
  );
}
