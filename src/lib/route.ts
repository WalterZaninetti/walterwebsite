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
export type Route = 'home' | 'legal' | 'magic';

const ROUTES: Record<string, Route> = {
  '/cookie-policy': 'legal',
  '/privacy': 'legal',
  '/magic-tools': 'magic',
};

function resolve(pathname: string): Route {
  return ROUTES[pathname.replace(/\/$/, '') || '/'] ?? 'home';
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
