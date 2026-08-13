/**
 * Fails the deploy if firebase.json's CSP no longer matches the built index.html.
 *
 * index.html carries one inline script — the pre-paint theme resolver — and the CSP allows it by
 * sha256 hash rather than 'unsafe-inline', so script injection stays blocked. The cost of that is
 * a hash which must be updated whenever the script changes, and firebase.json is strict JSON with
 * nowhere to leave a note saying so.
 *
 * Getting it wrong fails silently in the worst way: the browser refuses the script, the theme is
 * resolved late, and dark-mode visitors get a flash of the light palette — on production only,
 * with nothing in the build output to suggest why. Hence this check, wired into `npm run deploy`.
 */
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const config = JSON.parse(readFileSync(new URL('../firebase.json', import.meta.url), 'utf8'));

const inline = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(
  (match) => match[1],
);

const csp = config.hosting.headers
  .flatMap((entry) => entry.headers)
  .find((header) => header.key === 'Content-Security-Policy')?.value;

if (!csp) {
  console.error('check-csp: no Content-Security-Policy header in firebase.json');
  process.exit(1);
}

let failed = false;

for (const script of inline) {
  const hash = `sha256-${createHash('sha256').update(script).digest('base64')}`;
  if (!csp.includes(hash)) {
    failed = true;
    console.error(
      `check-csp: an inline script in dist/index.html is not allowed by the CSP.\n` +
        `  Add this to script-src in firebase.json:\n\n    '${hash}'\n\n` +
        `  Script begins: ${script.trim().slice(0, 70)}…`,
    );
  }
}

// A stale hash left behind after a script is removed is not fatal, but it is dead config that
// will outlive anyone's memory of what it was for.
const allowed = [...csp.matchAll(/'sha256-[A-Za-z0-9+/=]+'/g)].map((match) => match[0].slice(1, -1));
const live = new Set(
  inline.map((script) => `sha256-${createHash('sha256').update(script).digest('base64')}`),
);
for (const hash of allowed) {
  if (!live.has(hash)) {
    console.warn(`check-csp: '${hash}' in firebase.json matches no script in the build.`);
  }
}

if (failed) process.exit(1);
console.log(`check-csp: ok — ${inline.length} inline script(s) allowed by hash.`);
