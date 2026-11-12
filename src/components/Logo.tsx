/* Site logo: three rising bars (analyze → map → build); the tallest one becomes a "P" for Pawig.
   Colors come from --logo-* in globals.css, so it follows the dark/light theme. */
export function Logo({ className = "h-7 w-[30px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 120"
      className={`site-logo block ${className}`}
      aria-hidden="true"
    >
      <rect
        x="6"
        y="64"
        width="22"
        height="50"
        rx="11"
        fill="var(--logo-analyze)"
      />
      <rect
        x="38"
        y="40"
        width="22"
        height="74"
        rx="11"
        fill="var(--logo-map)"
      />
      <rect
        x="70"
        y="14"
        width="22"
        height="100"
        rx="11"
        fill="var(--logo-build)"
      />
      <path
        d="M81 23 H97 A17 17 0 0 1 97 57 H81"
        fill="none"
        stroke="var(--logo-build)"
        strokeWidth="18"
        strokeLinecap="round"
      />
    </svg>
  );
}
