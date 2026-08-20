/**
 * Where every date on this page comes from.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  UNFINISHED, DELIBERATELY, AND THE BUILD ENFORCES IT.
 *
 *  Every `year` below is 0, and `seasonable.test.ts` fails on `year === 0`.
 *  `npm test` runs inside `npm run deploy`, so this dataset cannot reach
 *  production until a person fills these in.
 *
 *  That is not an oversight left as a comment — it is the only honest way to
 *  hand over this file. The page's entire claim is that every window cites a
 *  real, checkable publication. The bodies named below are real and are the
 *  right ones to cite; the specific documents and their years are not
 *  something this build could verify, and writing a plausible year next to a
 *  real organisation would manufacture exactly the false provenance the page
 *  exists to refuse.
 *
 *  To finish: open each body's calendar, put its title in `name`, its
 *  permanent URL in `url`, and its publication year in `year`. Then `npm test`
 *  passes and the page can ship.
 * ─────────────────────────────────────────────────────────────────────────
 *
 * `scope` is rendered to the reader as how narrow the claim is: a regional
 * calendar is a narrower authority than a national one, and the page says so
 * rather than presenting both as equally certain. It is not a quality score.
 */

import type { Source } from '../../lib/seasonable';

const src = (id: string, name: string, url: string, scope: Source['scope']): Source => ({
  id,
  name,
  url,
  scope,
  // See the block above. The invariant test rejects this value.
  year: 0,
});

export const sources: readonly Source[] = [
  src('crea', 'CREA — Consiglio per la ricerca in agricoltura', 'https://www.crea.gov.it', 'national'),
  src('ismea', 'ISMEA', 'https://www.ismea.it', 'national'),
  src('masaf', "MASAF — Ministero dell'agricoltura", 'https://www.politicheagricole.it', 'national'),
  src('campagna-amica', 'Fondazione Campagna Amica', 'https://www.campagnamica.it', 'national'),

  src('zona-alpina', 'CREA — colture di montagna', 'https://www.crea.gov.it', 'zone'),
  src('zona-padana', 'CREA — orticoltura padana', 'https://www.crea.gov.it', 'zone'),
  src('zona-tirrenica', 'CREA — orticoltura tirrenica', 'https://www.crea.gov.it', 'zone'),
  src('zona-meridionale', 'CREA — orticoltura meridionale', 'https://www.crea.gov.it', 'zone'),
  src('zona-insulare', 'CREA — colture insulari', 'https://www.crea.gov.it', 'zone'),

  src('reg-sicilia', 'Regione Siciliana — Assessorato Agricoltura', 'https://www.regione.sicilia.it', 'region'),
  src('reg-emilia-romagna', 'Regione Emilia-Romagna — Agricoltura', 'https://agricoltura.regione.emilia-romagna.it', 'region'),
  src('reg-piemonte', 'Regione Piemonte — Agricoltura', 'https://www.regione.piemonte.it', 'region'),
  src('reg-veneto', 'Regione Veneto — Agricoltura', 'https://www.regione.veneto.it', 'region'),
  src('reg-puglia', 'Regione Puglia — Agricoltura', 'https://www.regione.puglia.it', 'region'),
  src('reg-campania', 'Regione Campania — Agricoltura', 'https://www.agricoltura.regione.campania.it', 'region'),
  src('reg-trentino', 'Provincia autonoma di Trento — Agricoltura', 'https://www.provincia.tn.it', 'region'),
  src('reg-lazio', 'Regione Lazio — Agricoltura', 'https://www.regione.lazio.it', 'region'),
  src('reg-toscana', 'Regione Toscana — Agricoltura', 'https://www.regione.toscana.it', 'region'),
  src('reg-calabria', 'Regione Calabria — Agricoltura', 'https://www.regione.calabria.it', 'region'),
  src('reg-sardegna', 'Regione Sardegna — Agricoltura', 'https://www.regione.sardegna.it', 'region'),
  src('reg-basilicata', 'Regione Basilicata — Agricoltura', 'https://www.regione.basilicata.it', 'region'),
  src('reg-lombardia', 'Regione Lombardia — Agricoltura', 'https://www.regione.lombardia.it', 'region'),
];
