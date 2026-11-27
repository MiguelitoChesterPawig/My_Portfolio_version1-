"use client";

import { useEffect } from "react";

/* Opens the page at the very top, however far down the previous page was scrolled.
   A link to a specific section (e.g. "#results") is still respected. */
export function StartAtTop() {
  useEffect(() => {
    if (window.location.hash) return;
    const top = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    top();
    // once more after the first paint, in case anything nudged the page while it was loading
    const raf = requestAnimationFrame(top);
    return () => cancelAnimationFrame(raf);
  }, []);
  return null;
}
