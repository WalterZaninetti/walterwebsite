import snapshot from './music.generated.json';
import { music } from './site';

/**
 * The build-time music snapshot — written by scripts/fetch-music.mjs, committed, and read here
 * so nothing else touches the generated JSON directly.
 *
 * Track, album and artist names are proper nouns, which is why they live under content/ rather
 * than in the locale files: a record is called what it is called in both languages. Everything
 * around them — the labels, the captions, the timestamps — is copy, and lives in src/locales.
 */
export type MusicItem = {
  id: string;
  title: string;
  artist: string;
  /** Null only if the source stopped returning a link; the row then renders unlinked. */
  url: string | null;
  /** ISO 8601. Played-at for Spotify, purchased-at for Bandcamp. */
  at: string | null;
  /** Self-hosted WebP written at build time. Null if the cover failed to download. */
  art: string | null;
  /** Bandcamp only — a collection holds both albums and single tracks. */
  kind?: 'album' | 'track';
};

export type MusicFeed = {
  items: MusicItem[];
  /** Spotify's, read from /me at build time. Bandcamp does not return one — see below. */
  profileUrl: string | null;
  /** When the snapshot was taken. Null means the source has never answered successfully. */
  fetchedAt: string | null;
};

export type MusicSourceId = 'spotify' | 'bandcamp';

/* Cast, not annotation: TypeScript widens the generated JSON's `kind` to `string` and infers
   `never[]` for a source that has never answered, neither of which a structural check accepts.
   The script is the schema's only writer, so the shape is guaranteed upstream. */
export const musicFeeds = snapshot as Record<MusicSourceId, MusicFeed>;

/**
 * Where each card's footer link points — the whole profile, not the five rows above it.
 *
 * Spotify's comes from the API because it cannot be derived: /users/{id} was removed in February
 * 2026, so a profile URL guessed from a username would be a fabrication. Bandcamp's collection
 * endpoint returns no link back to the fan page at all, so it keeps the hand-written URL that
 * was already in site.ts.
 */
export const musicProfiles: Record<MusicSourceId, string | null> = {
  spotify: musicFeeds.spotify.profileUrl,
  bandcamp: music.links.primary,
};
