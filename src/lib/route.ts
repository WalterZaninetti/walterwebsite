import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Small hand-rolled router — still not enough pages to justify a dependency.
 *
 * firebase.json already rewrites every path to index.html, and Vite's dev
 * server does the same, so any of these paths boots the app and this decides
 * what to render.
 */
export type Route = 'home' | 'legal' | 'magic' | 'notfound';

const ROUTES: Record<string, Route> = {
  '/': 'home',
  '/cookie-policy': 'legal',
  '/privacy': 'legal',
  '/magic-tools': 'magic',
};

/**
 * An unknown path renders the 404 view rather than falling back to the homepage.
 *
 * Static hosting cannot answer with a 404 status — Hosting's catch-all rewrite has already
 * returned 200 and index.html by the time this runs — but silently serving the homepage at every
 * wrong URL is worse than a soft 404: a crawler sees unlimited distinct URLs with identical
 * content. The noindex tag in NotFound is what actually keeps them out of the index.
 */
function resolve(pathname: string): Route {
  return ROUTES[pathname.replace(/\/$/, '') || '/'] ?? 'notfound';
}

export function useRoute(): Route {
  const { t, i18n } = useTranslation();
  const [route, setRoute] = useState(() => resolve(window.location.pathname));

  useEffect(() => {
    const onPop = () => setRoute(resolve(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Client-side navigation doesn't reload the document, so the title is ours
  // to keep in step — and it has to follow the language too.
  useEffect(() => {
    const titles: Record<Route, string> = {
      home: `Walter — ${t('home.hero.headline')} ${t('home.hero.headlineAccent')}`,
      legal: `${t('legal.title')} — Walter`,
      magic: `${t('magic.hero.title')} — Walter`,
      notfound: `${t('notFound.title')} — Walter`,
    };
    document.title = titles[route];
  }, [route, t, i18n.resolvedLanguage]);

  return route;
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
