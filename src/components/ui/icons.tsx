/**
 * Social glyphs for the footer bar, traced from the design doc. All draw in
 * currentColor at 17px so the circular buttons can invert on hover with a
 * single colour change.
 */

const box = { viewBox: '0 0 24 24', width: 17, height: 17, 'aria-hidden': true } as const;

export function GitHubIcon() {
  return (
    <svg {...box} fill="currentColor">
      <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.55v-1.94c-3.2.7-3.88-1.54-3.88-1.54-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.05 0 0 .96-.31 3.14 1.18a10.9 10.9 0 0 1 5.72 0c2.18-1.49 3.14-1.18 3.14-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.8.55A11.5 11.5 0 0 0 23.5 12A11.5 11.5 0 0 0 12 .5Z" />
    </svg>
  );
}

export function TwitchIcon() {
  return (
    <svg {...box} fill="currentColor">
      <path d="M4.3 1 1.6 5.4v13.1h4.6V22h2.9l2.7-3.5h3.6L21.9 12V1H4.3Zm15.4 10.2-3.5 4.6h-3.9l-2.6 3.4v-3.4H6.3V2.9h13.4v8.3Zm-6.8-5.5h1.9v5.5h-1.9V5.7Zm-4.2 0h1.9v5.5H8.7V5.7Z" />
    </svg>
  );
}

export function InstagramIcon() {
  return (
    <svg {...box} fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon() {
  return (
    <svg {...box} fill="currentColor">
      <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM2.9 21h4.15V9.5H2.9V21Zm7.05 0h4.15v-6.1c0-1.6.3-3.15 2.3-3.15 1.97 0 2 1.83 2 3.25V21h4.15v-6.85c0-3.6-.78-6.03-4.98-6.03-2.02 0-3.38 1.11-3.93 2.16h-.06V9.5H9.95V21Z" />
    </svg>
  );
}
