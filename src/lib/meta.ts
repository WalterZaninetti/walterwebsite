import { useEffect } from 'react';

/**
 * Sets the client-side `<meta name="description">` while a page is mounted and
 * restores whatever `index.html` shipped on unmount. Social scrapers run no JS
 * so they never see this — accepted, and the reason there is no per-route OG
 * card either; Google's renderer does run JS and still benefits.
 *
 * Lived unexported inside `ProjectPage.tsx` until `/dj-tools` grew its own
 * component and needed the same behaviour. Lifted rather than copied: two
 * copies of a `document.head` mutation is two places to get the cleanup wrong.
 */
export function useMetaDescription(description: string) {
  useEffect(() => {
    const meta = document.querySelector('meta[name="description"]');
    if (!meta) return;
    const original = meta.getAttribute('content');
    meta.setAttribute('content', description);
    return () => {
      if (original !== null) meta.setAttribute('content', original);
    };
  }, [description]);
}
