/**
 * The dataset, assembled.
 *
 * This module is imported statically by SeasonablePage, which App.tsx loads
 * lazily — so Rollup emits page and data as one content-hashed chunk under
 * /assets/, which firebase.json already serves immutable for a year. A file in
 * public/ would get no long-cache header at all: the existing rules cover
 * /assets/**, fonts and images only. That is the reason this is a module and
 * not a fetch, and it is not obvious from either end.
 *
 * One chunk rather than two also removes a state: there is no interval where
 * the page has rendered and the data has not, so there is no inert-tool screen
 * to design, translate and verify.
 */

import type { Dataset } from '../../lib/seasonable';
import { produce } from './produce';
import { provinces, regions, zones } from './geography';
import { sources } from './sources';
import { windows } from './windows';

export const dataset: Dataset = { produce, zones, regions, provinces, sources, windows };
