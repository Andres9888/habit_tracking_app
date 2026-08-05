/**
 * "Science-backed" badge eligibility — the one rule the badge and the hero
 * chip both read.
 *
 * Gating on `sources.length` alone was too loose. `ScienceSource.journal`
 * doubles as the publisher field for book citations, so 36 templates earned
 * "Science-backed" on the strength of a trade book — Scribner, Portfolio,
 * Crown, Delacorte, Grand Central. A popular-science book is a reasonable
 * reference; it is not the primary literature the badge claims. Authoring rule
 * 1 says the badge must disappear when a habit has no primary literature
 * behind it, so the publisher venues are filtered out here rather than left to
 * the authoring pass to catch by eye.
 *
 * Clinical guidance from a body like the CDC, WHO or ACSM is deliberately NOT
 * filtered: it is evidence, it is just not a journal article.
 */

import type { Template } from '../../../types/template';
import type { ScienceSource } from '../../../../convex/templates/types';

/** Imprints and non-literature venues that appear in the `journal` field. */
const PUBLISHER_VENUES = new Set(
  [
    'avery',
    'backfitpro',
    'choose yourself media',
    'crown',
    'fc garage',
    'gotham books',
    'harper & row',
    'harperbusiness',
    'harpercollins',
    'harvard business school working paper',
    'houghton mifflin',
    'houghton mifflin harcourt',
    'johns hopkins health library',
    'jossey-bass',
    'libraries unlimited',
    'little, brown',
    'mcgraw-hill',
    'morgan kaufmann',
    'perigee',
    'portfolio',
    'prentice hall',
    'pubmed',
    'scribner',
    'teachers college, columbia university',
    'thomas nelson',
    'viking',
    'w. w. norton',
    'wiley',
    'william morrow',
    'zondervan',
  ].map((v) => v.toLowerCase())
);

/** Venue shapes that are always a book or a summary, never a paper. */
const PUBLISHER_PATTERNS =
  /\bpress\b|\bpublishing\b|\bbooks?\b|\bmedia\b|research summaries/i;

/** True when the source names a venue that publishes primary literature. */
export function isPeerReviewedSource(source: ScienceSource): boolean {
  const venue = source?.journal?.trim();
  if (!venue) return false;
  if (PUBLISHER_VENUES.has(venue.toLowerCase())) return false;
  return !PUBLISHER_PATTERNS.test(venue);
}

/** Sources that survive the publisher filter — what "The research" should show. */
export function citedSources(template: Template): ScienceSource[] {
  return (template?.sources ?? []).filter(isPeerReviewedSource);
}

/**
 * Badge eligibility: an authored finding, or at least one cited paper.
 *
 * Never gate on the merged `evidence ?? scientificReference` fallback —
 * `scientificReference` is populated on every template and is frequently a
 * book or a methodology ("Deep Work", "Inbox Zero"), so gating on it hands the
 * badge to the whole library and hollows out the claim.
 */
export function isScienceBacked(
  template: Template | null | undefined
): boolean {
  if (!template) return false;
  if (template.evidence?.trim()) return true;
  return citedSources(template).length > 0;
}
