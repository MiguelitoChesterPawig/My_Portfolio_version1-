/* Small flowchart symbols used as icons across the site */
type ShapeName = "terminator" | "process" | "decision" | "io" | "data" | "terminal";

export function Shape({ name, className = "h-5 w-5" }: { name: ShapeName | string; className?: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      {name === "terminator" && <rect x="2" y="7" width="20" height="10" rx="5" {...common} />}
      {name === "process" && <rect x="3" y="6" width="18" height="12" rx="1.5" {...common} />}
      {name === "decision" && <path d="M12 2.5 21.5 12 12 21.5 2.5 12Z" {...common} />}
      {name === "io" && <path d="M6 6h15l-3 12H3Z" {...common} />}
      {name === "data" && (
        <g {...common}>
          <ellipse cx="12" cy="6" rx="8" ry="3" />
          <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
        </g>
      )}
      {name === "terminal" && (
        <g {...common}>
          <rect x="2.5" y="4" width="19" height="16" rx="2" />
          <path d="m7 10 3 2-3 2M12.5 15H17" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}
