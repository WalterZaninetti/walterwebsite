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
 *      Open the printed URL, approve, and the script prints the refresh token. Paste it into
 *      .env as SPOTIFY_REFRESH_TOKEN. Refresh tokens are long-lived; the short-lived access
 *      token is derived from it on every build.
 */
import { createServer } from 'node:http';
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
  if (url.pathname !== '/callback') {
    response.writeHead(404).end();
    return;
  }

  const finish = (message) => {
    response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }).end(message);
    server.close();
  };

  if (url.searchParams.get('error')) {
    console.error(`\nspotify-auth: authorization declined (${url.searchParams.get('error')})`);
    finish('Declined. You can close this tab.');
    process.exitCode = 1;
    return;
  }

  if (url.searchParams.get('state') !== state) {
    console.error('\nspotify-auth: state mismatch — ignoring this callback.');
    finish('State mismatch. You can close this tab.');
    process.exitCode = 1;
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
      code: url.searchParams.get('code'),
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
  console.log(`\nOpen this URL, then approve:\n\n${authorizeUrl}\n`);
});
