/** The five mana symbols across the top of the hero, traced from the doc. */
export function ManaPips() {
  return (
    <div className="flex gap-[9px]" aria-hidden="true">
      <Pip title="Plains" className="border border-white/30 bg-mana-plains">
        <svg
          viewBox="0 0 24 24"
          width="18"
          height="18"
          fill="none"
          stroke="var(--color-mana-plains-ink)"
          strokeWidth="1.7"
          strokeLinecap="round"
        >
          <circle cx="12" cy="12" r="4.1" fill="var(--color-mana-plains-fill)" stroke="none" />
          <circle cx="12" cy="12" r="4.1" />
          <path d="M12 3v2.4M12 18.6V21M3 12h2.4M18.6 12H21M5.6 5.6l1.7 1.7M16.7 16.7l1.7 1.7M18.4 5.6l-1.7 1.7M7.3 16.7l-1.7 1.7" />
        </svg>
      </Pip>

      <Pip title="Island" className="bg-mana-island shadow-[0_0_0_3px_rgb(170_224_250/0.24)]">
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="var(--color-mana-island-ink)"
          stroke="var(--color-mana-island-ink)"
          strokeWidth="1.2"
        >
          <path d="M12 3.5c3.4 4 6 7 6 10.1A6 6 0 0 1 6 13.6C6 10.5 8.6 7.5 12 3.5Z" />
          <path
            d="M9.6 12.4c0 2 1.2 3.4 3 3.8"
            fill="none"
            stroke="var(--color-mana-island-pale)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </Pip>

      <Pip title="Swamp" className="border border-white/20 bg-mana-swamp">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="var(--color-mana-swamp-ink)">
          <path d="M12 3.6c-3.7 0-6.4 2.6-6.4 6 0 1.9.9 3.4 2.2 4.4v2.3c0 .8.6 1.4 1.4 1.4h.6l.5 2h3.4l.5-2h.6c.8 0 1.4-.6 1.4-1.4V14c1.3-1 2.2-2.5 2.2-4.4 0-3.4-2.7-6-6.4-6Z" />
          <circle cx="9.6" cy="10.4" r="1.5" fill="var(--color-mana-swamp)" />
          <circle cx="14.4" cy="10.4" r="1.5" fill="var(--color-mana-swamp)" />
          <path d="M10.4 13.8h3.2v1.5h-3.2z" fill="var(--color-mana-swamp)" />
        </svg>
      </Pip>

      <Pip title="Mountain" className="bg-mana-mountain">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="var(--color-mana-mountain-ink)">
          <path d="M13.4 2.6c.6 3-1 4.4-2.5 6-1.7 1.7-3.3 3.4-3.3 6.2A5.9 5.9 0 0 0 18 15.6c.4-3-1.1-5-2.2-6.6.2 1.3-.3 2.2-1 2.6.6-3.1-.6-6.7-1.4-9Z" />
        </svg>
      </Pip>

      <Pip title="Forest" className="bg-mana-forest">
        <svg viewBox="0 0 24 24" width="17" height="17" fill="var(--color-mana-forest-ink)">
          <path d="M12 2.8c2.9 2.3 5.4 5.6 5.4 8.9 0 3.3-2.4 5.7-5.4 5.7s-5.4-2.4-5.4-5.7c0-3.3 2.5-6.6 5.4-8.9Z" />
          <path
            d="M11.3 21.4V12l-2.1-2.2 2.1 1.1V8.4l1.4-1.1v14.1z"
            fill="var(--color-magic-green-darker)"
          />
        </svg>
      </Pip>
    </div>
  );
}

function Pip({
  title,
  className,
  children,
}: {
  title: string;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <span title={title} className={`grid size-[30px] place-items-center rounded-full ${className}`}>
      {children}
    </span>
  );
}
