import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';

/**
 * Two-page routing, hand-rolled because two pages do not justify a router.
 *
 * firebase.json already rewrites every path to index.html, and Vite's dev
 * server does the same, so /cookie-policy and /privacy both boot the app and
 * this decides what to render.
 */
export const LEGAL_PATHS = ['/cookie-policy', '/privacy'];

export function useIsLegalPath(): boolean {
  const [path, setPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return LEGAL_PATHS.includes(path.replace(/\/$/, ''));
}

/**
 * Click handler for in-app links: pushes the URL and re-renders without a full
 * page load, while leaving modified clicks (new tab, download) to the browser.
 */
export function navigate(event: MouseEvent<HTMLAnchorElement>) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return;
  }
  event.preventDefault();
  const href = event.currentTarget.getAttribute('href');
  if (!href) return;
  window.history.pushState({}, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}
