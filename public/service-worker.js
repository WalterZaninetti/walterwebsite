/*
  A self-destructing service worker. This site does not use one.

  A previous site at walterzaninetti.com registered a Workbox service worker,
  and it is still activated in the browser of anyone who loaded it. It serves
  its precached shell for navigations, so those visitors get an old "This page
  does not exist" screen instead of the site — while curl, which bypasses the
  worker, sees the correct page.

  It cannot expire on its own. A browser only replaces a worker when it can
  re-fetch the script as JavaScript, and once this file stopped existing,
  Hosting's SPA catch-all answered /service-worker.js with index.html. The
  update check fails on the content type, so the old worker stays activated
  forever.

  So this file exists to be that successful update, and then to remove itself:
  it claims the registration, drops every cache the old worker left behind,
  unregisters, and reloads open tabs so they get real content. Once visitors
  have been through it once, it does nothing — but it has to keep shipping,
  because there is no way to know when the last stale client has been.

  Two things here are load-bearing and should not be "tidied":

  - It lives in public/, so Hosting serves it as a real application/javascript
    file *before* the catch-all rewrite. That is the entire mechanism. Moved
    anywhere else, it goes back to being served as HTML and nothing updates.
  - It registers no `fetch` handler. A worker without one is bypassed for
    navigations, so it never stands between a visitor and the network even
    during the moment it is alive.
*/

self.addEventListener('install', () => {
  // Don't wait for every tab of the old worker to close first — the point is
  // to replace it now.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));

      await self.registration.unregister();

      // Reload while the clients are still controlled: the visitor's current
      // paint is whatever the old worker served them, and only a navigation
      // replaces it.
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const client of clients) {
        client.navigate(client.url);
      }
    })(),
  );
});
