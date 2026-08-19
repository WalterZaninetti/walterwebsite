/**
 * One-time helper: mints the Spotify refresh token that scripts/fetch-music.mjs runs on.
 *
 * You should need this twice — once at setup, and again only if the token is revoked or the
 * scope changes. It is not part of any build.
 *
 *   1. At developer.spotify.com/dashboard, create an app and add this exact redirect URI:
 *
 *        http://127.0.0.1:8888/callback
 *
 *      It must be the loopback IP, not `localhost` — Spotify rejects that hostname over plain
 *      HTTP. The account that owns the app needs an active Premium subscription: since 9 March
 *      2026 Development Mode apps stop working without one, and there is no way out of
 *      Development Mode for a personal site (Extended Quota requires a registered business with
 *      250k+ monthly actives).
 *
 *   2. Put the app's client ID and secret in .env as SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET.
 *
 *   3. node scripts/spotify-auth.mjs
 *
 *      It opens the consent screen for you. Approve, and the script prints the refresh token —
 *      paste it into .env as SPOTIFY_REFRESH_TOKEN. Refresh tokens are long-lived; the
 *      short-lived access token is derived from it on every build.
 */
import { createServer } from 'node:http';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
/* recently-played is the only thing the site reads. Nothing here writes, and nothing reads the
   library or the profile — keep it that way; the consent screen is the user's, even when the
   user is you. */
const SCOPE = 'user-read-recently-played';

if (existsSync(new URL('../.env', import.meta.url))) {
  process.loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)));
}

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error(
    'spotify-auth: set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env first.\n' +
      'Both come from the app you created at https://developer.spotify.com/dashboard.',
  );
  process.exit(1);
}

/* Guards against a stray request landing on the callback and being treated as the real one. */
const state = crypto.randomUUID();

const authorizeUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  scope: SCOPE,
  state,
})}`;

const server = createServer(async (request, response) => {
  const url = new URL(request.url, `http://127.0.0.1:${PORT}`);

  /* Only the real redirect carries a code or an error. Everything else that hits this port —
     /favicon.ico, a browser preconnect, a stray reload — is ignored rather than treated as the
     callback, which would otherwise close the server before the redirect ever landed. */
  const code = url.searchParams.get('code');
  const failure = url.searchParams.get('error');
  if (url.pathname !== '/callback' || (!code && !failure)) {
    response.writeHead(404).end();
    return;
  }

  const finish = (message) => {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end(message);
    server.close();
  };

  if (failure) {
    console.error(`\nspotify-auth: authorization declined (${failure})`);
    finish('Declined. You can close this tab.');
    process.exitCode = 1;
    return;
  }

  /* A mismatch means this callback is not the one this run started — most often an authorize URL
     that lost its tail when it was copied out of the terminal, since `state` is the last
     parameter. Keep listening rather than exiting, so approving again fixes it without
     restarting the script. */
  const returned = url.searchParams.get('state');
  if (returned !== state) {
    console.error(
      `\nspotify-auth: state mismatch — ignoring this callback.\n` +
        `  expected: ${state}\n` +
        `  received: ${returned ?? '(none)'}\n` +
        `  The authorize URL was probably truncated. Still listening — approve again.`,
    );
    response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('State mismatch — go back to the terminal and open the URL again.');
    return;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const token = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });

  const body = await token.json();

  if (!token.ok || !body.refresh_token) {
    console.error(`\nspotify-auth: token exchange failed —\n${JSON.stringify(body, null, 2)}`);
    finish('Token exchange failed. Check the terminal.');
    process.exitCode = 1;
    return;
  }

  console.log(`\nAdd this to .env:\n\n  SPOTIFY_REFRESH_TOKEN=${body.refresh_token}\n`);
  finish('Done. You can close this tab and go back to the terminal.');
});

server.listen(PORT, '127.0.0.1', () => {
  /* Opened for you rather than printed to be copied: the URL is long enough to wrap in a
     terminal, and a copy that stops at the wrap loses `state` off the end — which arrives here
     as a mismatch with no hint as to why. The printed copy stays as the fallback. */
  const opener = { darwin: 'open', win32: 'start' }[process.platform] ?? 'xdg-open';
  execFile(opener, [authorizeUrl], (error) => {
    if (error) console.log('\nCould not open a browser automatically — use the URL below.');
  });

  console.log(`\nApprove in the browser. If nothing opened, paste this URL whole:\n\n${authorizeUrl}\n`);
});
