/* One icon: a Flaticon UIcons class ("fi-brands-github", "fi-rr-envelope"), or "viber".
   The icon font has no Viber logo, so "viber" draws it as SVG, traced from the official
   Viber logo (Viber-Icon-Purple-Logo.svg) but in one color like the font icons:
   it uses currentColor, so it turns green / muted / green-on-hover exactly like the others. */

export function Icon({ name, className = "" }: { name: string; className?: string }) {
  if (name === "viber") return <ViberLogo className={className} />;
  return <i className={`fi ${name} flex ${className}`} aria-hidden="true" />;
}

function ViberLogo({ className }: { className: string }) {
  return (
    <svg
      viewBox="40 30 560 640"
      aria-hidden="true"
      className={`-mx-[0.025em] h-[1.1em] w-[1.1em] shrink-0 ${className}`}
    >
      <defs>
        {/* white = keep, black = cut out: the handset and signal waves show through the bubble */}
        <mask id="viber-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="640" height="700">
          <rect x="0" y="0" width="640" height="700" fill="#fff" />
          <g fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="26">
            <path d="M389.471 268.768q-2.46-49.59-50.38-52.09" />
            <path d="M432.721 283.268q1-46.2-27.37-77.2c-19-20.74-45.3-32.16-79.05-34.63" />
            <path d="M477.001 300.588q-.61-80.17-47.91-126.28t-117.65-46.6" />
          </g>
          <path
            fill="#000"
            d="M340.761 381.678s11.85 1 18.23-6.86l12.44-15.65c6-7.76 20.48-12.71 34.66-4.81a366.67 366.67 0 0130.91 19.74c9.41 6.92 28.68 23 28.74 23 9.18 7.75 11.3 19.13 5.05 31.13 0 .07-.05.19-.05.25a129.81 129.81 0 01-25.89 31.88c-.12.06-.12.12-.23.18q-13.38 11.18-26.29 12.71a17.39 17.39 0 01-3.84.24 35 35 0 01-11.18-1.72l-.28-.41c-13.26-3.74-35.4-13.1-72.27-33.44a430.39 430.39 0 01-60.72-40.11 318.31 318.31 0 01-27.31-24.22l-.92-.92-.92-.92-.92-.92c-.31-.3-.61-.61-.92-.92a318.31 318.31 0 01-24.22-27.31 430.83 430.83 0 01-40.11-60.71c-20.34-36.88-29.7-59-33.44-72.28l-.41-.28a35 35 0 01-1.71-11.18 16.87 16.87 0 01.23-3.84q1.61-12.89 12.73-26.31c.06-.11.12-.11.18-.23a129.53 129.53 0 0131.88-25.88c.06 0 .18-.06.25-.06 12-6.25 23.38-4.13 31.12 5 .06.06 16.11 19.33 23 28.74a366.67 366.67 0 0119.74 30.94c7.9 14.17 2.95 28.68-4.81 34.66l-15.65 12.44c-7.9 6.38-6.86 18.23-6.86 18.23s23.18 87.73 109.79 109.84z"
          />
        </mask>
      </defs>
      <path
        fill="currentColor"
        mask="url(#viber-cut)"
        d="M525.881 98.768c-14-12.72-74.43-50.69-200.52-51.24 0 0-149.31-9.81-221.79 55.84-40.34 39.83-53.93 99.06-55.42 171.34-1.49 72.28-9.21 210.36 123 247.09 0 0-.52 102.51-.58 111.52 0 6.3 1 10.61 4.6 11.5 2.59.63 6.47-.71 9.77-4 21.14-21.23 88.82-102.88 88.82-102.88 90.81 5.93 163.06-12 170.83-14.54 18.32-5.89 117.41-14.4 134.18-149.86 17.33-139.63-6.37-234.94-52.89-274.77z"
      />
    </svg>
  );
}
