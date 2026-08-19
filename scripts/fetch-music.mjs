/**
 * Snapshots the two music sources into src/content/music.generated.json, and their cover art into
 * public/images/music/, so the site can show real listening data without ever calling an API from
 * the browser.
 *
 * Runs as the first step of `npm run build`. Everything it produces is committed, which is what
 * makes the build deterministic: a clone with no credentials, a Spotify outage and a Bandcamp
 * schema change all fall back to the last good snapshot instead of shipping an empty card.
 *
 * WHY BUILD-TIME AND NOT RUNTIME
 * Both sources are off-origin, and the CSP is `connect-src 'self'; img-src 'self' data:` — a
 * runtime fetch would need both relaxed plus a service to hold the Spotify refresh token, which
 * is a secret a public bundle cannot carry. Fetching here costs one script and keeps the site a
 * static artifact with no new attack surface. The trade is staleness: the data is as old as the
 * last deploy, and the relative timestamps are computed at render so they stay honest about it.
 *
 * THE TWO SOURCES ARE NOT THE SAME THING
 * Spotify reports plays. Bandcamp reports purchases — there is no listening history in its API at
 * all. The cards are worded to say so; don't merge them into one list.
 *
 * SPOTIFY
 * The app is stuck in Development Mode forever (Extended Quota went orgs-only, 250k+ MAU, in May
 * 2025), which since 9 March 2026 means the app owner must hold an active Premium subscription.
 * If that lapses the API stops answering and this script starts warning. `recently-played`
 * survived the February 2026 endpoint cull; `preview_url` and `popularity` did not, so there is
 * no audio preview to show.
 *
 * ALBUM OF THE MONTH
 * Spotify has no description, review or editorial text on an album — not under any scope, not on
 * any endpoint. So the pick's note stays hand-written in the locale files; what comes from the
 * API is the sleeve, the title, the artist, the label, the year, the length and the genres.
 * `label` and `popularity` are both listed as removed in the February 2026 changelog yet still
 * answer, so everything here is read defensively and degrades to null.
 *
 * BANDCAMP
 * There is no official API for a fan collection — bandcamp.com/developer is sales reporting for
 * labels, and the old /api/band/3/ endpoints need a dev key Bandcamp stopped issuing years ago.
 * This uses the undocumented endpoint the fan page itself calls. It needs no key and no cookie
 * for a public collection, and it can change shape or start refusing requests without notice,
 * which is exactly why the committed fallback exists. The `tracklists` object it also returns
 * carries mp3-128 URLs, but they are signed with an expiring timestamp — useless here, ignored.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const SNAPSHOT = new URL('../src/content/music.generated.json', import.meta.url);
/** Hand-edited: the one file to change when the monthly pick changes. */
const ALBUM_INPUT = new URL('../src/content/album-of-the-month.json', import.meta.url);
const ART_DIR = new URL('../public/images/music/', import.meta.url);

/** Rows per card. */
const COUNT = 5;
/**
 * One artwork file per row, at 128px. The row renders it at 44–48px, so a single file covers
 * every pixel ratio up to ~2.9x and there is no srcset to thread through `LazyImage`.
 */
const ART_PX = 128;
/** The sleeve is its own size: 158px on desktop, near-full-width on a phone. 640 covers 2x. */
const SLEEVE_PX = 640;
/**
 * The archive tiles. They sit two-across in the section's narrow column, which is ~210 CSS px
 * each on a wide desktop — so ART_PX's 128 would upscale even at 1x. 420 covers 2x there and
 * still costs a fraction of a full sleeve.
 */
const PICK_PX = 420;
const TIMEOUT_MS = 10_000;

if (existsSync(new URL('../.env', import.meta.url))) {
  process.loadEnvFile(fileURLToPath(new URL('../.env', import.meta.url)));
}

const note = (source, message) => console.log(`fetch-music [${source}] ${message}`);
const warn = (source, message) => console.warn(`fetch-music [${source}] ⚠ ${message}`);

async function fetchJson(url, init = {}) {
  const response = await fetch(url, { ...init, signal: AbortSignal.timeout(TIMEOUT_MS) });
  const body = await response.text();

  if (!response.ok) {
    const error = new Error(`HTTP ${response.status} — ${body.slice(0, 200)}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return JSON.parse(body);
}

/* ---------------------------------------------------------------- Spotify */

async function spotifyToken(id, secret, refresh) {
  const auth = Buffer.from(`${id}:${secret}`).toString('base64');
  const token = await fetchJson('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  });
  return token.access_token;
}

/** One token for both Spotify readers. Null when the credentials are absent. */
async function spotifyHeaders() {
  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  const refresh = process.env.SPOTIFY_REFRESH_TOKEN;

  if (!id || !secret || !refresh) {
    note('spotify', 'no credentials in .env — keeping the committed snapshot');
    return null;
  }
  return { Authorization: `Bearer ${await spotifyToken(id, secret, refresh)}` };
}

async function fetchSpotify(headers) {

  /* limit=20, not 5: the endpoint returns one entry per play, so a track on repeat would
     otherwise fill the whole card. Dedupe by track id and keep the first (most recent) five. */
  const [profile, played] = await Promise.all([
    /* The card's footer links to the profile, and the only honest way to know its URL is to ask
       — the public /users/{id} endpoint was removed in February 2026, so it cannot be guessed
       from a username either. */
    fetchJson('https://api.spotify.com/v1/me', { headers }),
    fetchJson('https://api.spotify.com/v1/me/player/recently-played?limit=20', { headers }),
  ]);

  const seen = new Set();
  const items = [];

  for (const entry of played.items ?? []) {
    const track = entry.track;
    if (!track?.id || seen.has(track.id)) continue;
    seen.add(track.id);

    /* Smallest image at or above the render size — the 640px master is 20x more than a 48px
       row needs, and sharp is downscaling it anyway. */
    const images = [...(track.album?.images ?? [])].sort((a, b) => a.width - b.width);
    const art = images.find((image) => image.width >= ART_PX) ?? images.at(-1);

    items.push({
      id: track.id,
      title: track.name,
      artist: (track.artists ?? []).map((artist) => artist.name).join(', '),
      url: track.external_urls?.spotify ?? null,
      artSource: art?.url ?? null,
      at: entry.played_at ?? null,
    });

    if (items.length === COUNT) break;
  }

  if (items.length === 0) throw new Error('no tracks in the response');
  return { items, profileUrl: profile.external_urls?.spotify ?? null };
}

/**
 * The monthly pick. Shares the Spotify token with the feed above, so it takes one rather than
 * minting a second.
 */
async function fetchAlbum(headers) {
  let input;
  try {
    input = JSON.parse(readFileSync(ALBUM_INPUT, 'utf8'));
  } catch {
    note('album', 'no album-of-the-month.json — keeping the committed snapshot');
    return null;
  }
  if (!input.spotifyId) return null;

  const album = await fetchJson(`https://api.spotify.com/v1/albums/${input.spotifyId}`, { headers });

  /* Album `genres` is present in the response but empty for essentially every record, so the
     tags come from the primary artist instead — the only place Spotify actually populates them. */
  let genres = album.genres?.length ? album.genres : [];
  const artistId = album.artists?.[0]?.id;
  if (!genres.length && artistId) {
    try {
      const artist = await fetchJson(`https://api.spotify.com/v1/artists/${artistId}`, { headers });
      genres = artist.genres ?? [];
    } catch {
      /* Tags are a nice-to-have; a missing artist lookup must not lose the album. */
    }
  }

  /* `tracks` is paginated at 50. Every album that fits the card fits one page, so the rare box
     set simply lists its first fifty rather than costing a second request. */
  const trackItems = album.tracks?.items ?? [];
  const runtimeMs = trackItems.reduce((sum, t) => sum + (t.duration_ms ?? 0), 0);

  const tracks = trackItems.map((track, index) => ({
    /* Fall back to position: track_number is per-disc, so a two-disc release restarts at 1. */
    n: track.track_number ?? index + 1,
    title: track.name,
    sec: track.duration_ms ? Math.round(track.duration_ms / 1000) : null,
  }));

  const sleeve = [...(album.images ?? [])].sort((a, b) => b.width - a.width)[0];

  return {
    previousInput: Array.isArray(input.previous) ? input.previous : [],
    id: album.id,
    title: album.name,
    artist: (album.artists ?? []).map((a) => a.name).join(', '),
    /* Slated for removal in the February 2026 changelog but still answering — null-safe so the
       credit line simply drops it the day it goes. */
    label: album.label ?? null,
    /* release_date is '1978' | '1978-04' | '1978-04-21' depending on precision; the card only
       ever shows the year. */
    year: album.release_date ? album.release_date.slice(0, 4) : null,
    url: album.external_urls?.spotify ?? null,
    trackCount: album.total_tracks ?? null,
    runtimeMin: runtimeMs ? Math.round(runtimeMs / 60000) : null,
    tracks,
    tags: genres.slice(0, 3),
    pick: input.pick ?? null,
    month: input.month ?? null,
    artSource: sleeve?.url ?? null,
  };
}

/**
 * The two picks before this one. Deliberately thinner than `fetchAlbum`: the archive renders a
 * sleeve and a month, so it asks for one album each and keeps the four fields the tile shows.
 * No tracklist, no genre lookup, no label — none of it is drawn, and each would cost a request.
 *
 * A pick that fails to fetch is dropped rather than rendered bare: unlike the monthly card, which
 * degrades field by field, a sleeve tile with no sleeve is just a hole in the grid.
 */
async function fetchPreviousPicks(headers, entries) {
  const picks = [];

  for (const [index, entry] of entries.entries()) {
    if (!entry?.spotifyId) continue;
    try {
      const album = await fetchJson(`https://api.spotify.com/v1/albums/${entry.spotifyId}`, {
        headers,
      });
      const sleeve = [...(album.images ?? [])].sort((a, b) => b.width - a.width)[0];
      picks.push({
        id: album.id,
        title: album.name,
        artist: (album.artists ?? []).map((a) => a.name).join(', '),
        url: album.external_urls?.spotify ?? null,
        pick: entry.pick ?? null,
        month: entry.month ?? null,
        artSource: sleeve?.url ?? null,
        /* Positional, so a re-ordered list rewrites the same files rather than orphaning them. */
        artName: `album-prev-${index}.webp`,
      });
    } catch (error) {
      warn('album', `previous pick ${entry.spotifyId} failed (${error.message}) — dropped`);
    }
  }

  return picks;
}

/* --------------------------------------------------------------- Bandcamp */

async function fetchBandcamp() {
  const fanId = Number(process.env.BANDCAMP_FAN_ID);
  if (!fanId) {
    note('bandcamp', 'no BANDCAMP_FAN_ID in .env — keeping the committed snapshot');
    return null;
  }

  /* older_than_token is `timestamp:id:type:index:`. Only the type (non-empty) and the index
     matter; a far-future timestamp with an empty index means "start from the newest". */
  const collection = await fetchJson('https://bandcamp.com/api/fancollection/1/collection_items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    /* count is 8, not 5: hidden and private items come back in the list and get filtered out
       below, so ask for a few spare. */
    body: JSON.stringify({ fan_id: fanId, older_than_token: '9999999999::a::', count: 8 }),
  });

  const items = (collection.items ?? [])
    .filter((item) => !item.hidden && !item.is_private)
    .slice(0, COUNT)
    .map((item) => ({
      id: `${item.tralbum_type ?? 'a'}${item.item_id}`,
      title: item.item_title,
      artist: item.band_name,
      url: item.item_url ?? null,
      artSource: item.item_art_id ? `https://f4.bcbits.com/img/a${item.item_art_id}_16.jpg` : null,
      /* "03 May 2026 11:22:25 GMT" — parseable, but normalise to ISO so the component only ever
         handles one date format. */
      at: item.purchased ? new Date(item.purchased).toISOString() : null,
      kind: item.item_type === 'track' ? 'track' : 'album',
    }));

  if (items.length === 0) throw new Error('no items in the response');
  /* The response carries no link back to the fan page — only the numeric fan_id, and the
     username is not derivable from it. The collection URL is hand-written in content/site.ts,
     where it already was. */
  return { items, profileUrl: null };
}

/* ---------------------------------------------------------------- Artwork */

/**
 * Downloads each cover and writes a square WebP. Cover art is never cropped, overlaid or
 * recoloured — Spotify's design guidelines forbid modifying it, and `fit: 'cover'` on an
 * already-square source is a straight resize.
 */
async function writeArtwork(source, items) {
  const written = [];

  for (const [index, item] of items.entries()) {
    const name = `${source}-${index}.webp`;

    if (!item.artSource) {
      written.push({ ...item, art: null });
      continue;
    }

    try {
      const response = await fetch(item.artSource, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const buffer = await sharp(Buffer.from(await response.arrayBuffer()))
        .resize(ART_PX, ART_PX, { fit: 'cover' })
        .webp({ quality: 78 })
        .toBuffer();

      writeFileSync(new URL(name, ART_DIR), buffer);
      written.push({ ...item, art: `/images/music/${name}` });
    } catch (error) {
      warn(source, `cover art for "${item.title}" failed (${error.message}) — row renders bare`);
      written.push({ ...item, art: null });
    }
  }

  /* artSource was only ever the download address; it does not belong in the bundle. */
  return written.map(({ artSource: _artSource, ...item }) => item);
}

/** The sleeve: one image, its own size, same no-crop rule. */
async function writeSleeve(url, name, size) {
  const response = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const buffer = await sharp(Buffer.from(await response.arrayBuffer()))
    .resize(size, size, { fit: 'cover' })
    .webp({ quality: 80 })
    .toBuffer();

  writeFileSync(new URL(name, ART_DIR), buffer);
  return `/images/music/${name}`;
}

/* ------------------------------------------------------------------- Main */

function readSnapshot() {
  try {
    return JSON.parse(readFileSync(SNAPSHOT, 'utf8'));
  } catch {
    const blank = { items: [], profileUrl: null, fetchedAt: null };
    return { spotify: { ...blank }, bandcamp: { ...blank }, album: null };
  }
}

/**
 * Names the two failures that actually happen, because neither is guessable from the status code
 * alone: a dead Spotify credential comes back as a 400 invalid_grant / invalid_client from the
 * token endpoint rather than the 401 you would expect, and a quota exhaustion is a 429 that says
 * nothing about which of the shared per-account buckets ran out.
 */
function diagnose(source, error) {
  if (/invalid_grant|invalid_client/.test(error.body ?? '') || error.status === 401) {
    warn(
      source,
      'the credentials were rejected. Either the refresh token is revoked (re-run ' +
        '`node scripts/spotify-auth.mjs`), the client id/secret in .env are wrong, or the ' +
        'account has lost Spotify Premium — Development Mode apps stop working without it.',
    );
  } else if (error.status === 429) {
    warn(source, 'rate limited or out of quota. Try again in a few minutes.');
  } else {
    warn(source, error.message);
  }
}

/**
 * The monthly pick, which is one object rather than a list and so does not fit `collect`. Same
 * contract: any failure falls back to the committed snapshot and never throws.
 */
async function collectAlbum(headers, previous) {
  if (!headers) return previous;

  try {
    const album = await fetchAlbum(headers);
    if (!album) return previous;

    const { artSource, previousInput, ...rest } = album;
    let art = previous?.art ?? null;

    if (artSource) {
      try {
        /* Same filename every month. The cache header on /images/** is an hour with
           must-revalidate, so a changed sleeve is picked up without a cache-busting name. */
        art = await writeSleeve(artSource, 'album.webp', SLEEVE_PX);
      } catch (error) {
        warn('album', `sleeve download failed (${error.message}) — keeping the previous one`);
      }
    }

    /* PICK_PX, not ART_PX: these are half-column tiles, not 48px feed rows. */
    const fetched = await fetchPreviousPicks(headers, previousInput);
    const picks = [];
    for (const { artSource: source, artName, ...pick } of fetched) {
      let picked = null;
      if (source) {
        try {
          picked = await writeSleeve(source, artName, PICK_PX);
        } catch (error) {
          warn('album', `sleeve for "${pick.title}" failed (${error.message}) — pick dropped`);
          continue;
        }
      }
      picks.push({ ...pick, art: picked });
    }

    return { ...rest, art, previous: picks, fetchedAt: new Date().toISOString() };
  } catch (error) {
    diagnose('album', error);
    warn('album', 'keeping the committed snapshot');
    return previous;
  }
}

/**
 * A source that throws must not fail the build — it must fall back. A missing cover, an expired
 * refresh token and a rewritten Bandcamp response are all "show the last known good thing", not
 * "block the deploy".
 */
async function collect(source, fetcher, previous) {
  try {
    const result = await fetcher();
    if (!result) return previous;

    return {
      items: await writeArtwork(source, result.items),
      /* Never overwrite a known profile URL with a null from a source that stopped sending it. */
      profileUrl: result.profileUrl ?? previous.profileUrl ?? null,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    diagnose(source, error);
    warn(source, `keeping the committed snapshot (${previous.items.length} rows)`);
    return previous;
  }
}

const previous = readSnapshot();

mkdirSync(ART_DIR, { recursive: true });

/* Minted once, up front: the feed and the monthly pick are two reads against the same account,
   and a failure here is the same failure for both — reported once rather than twice. */
let headers = null;
try {
  headers = await spotifyHeaders();
} catch (error) {
  diagnose('spotify', error);
}

const [spotify, bandcamp, album] = await Promise.all([
  collect('spotify', () => (headers ? fetchSpotify(headers) : null), previous.spotify),
  collect('bandcamp', fetchBandcamp, previous.bandcamp),
  collectAlbum(headers, previous.album),
]);

const snapshot = { spotify, bandcamp, album };

/* Drop art from runs that no longer reference it. Done after both sources resolve so a fallback
   never deletes the very files it is falling back on. */
const live = new Set(
  [...spotify.items, ...bandcamp.items, ...(album ? [album, ...(album.previous ?? [])] : [])]
    .map((item) => item.art?.split('/').pop())
    .filter(Boolean),
);
for (const file of readdirSync(ART_DIR)) {
  if (file.endsWith('.webp') && !live.has(file)) rmSync(new URL(file, ART_DIR));
}

writeFileSync(SNAPSHOT, `${JSON.stringify(snapshot, null, 2)}\n`);

note(
  '',
  `wrote ${spotify.items.length} Spotify + ${bandcamp.items.length} Bandcamp rows` +
    `${
      album
        ? `, album of the month "${album.title}" + ${(album.previous ?? []).length} previous`
        : ', no album of the month'
    }`,
);
