/** Picks the most popular template per category, used to power PairsWellWithNudge suggestions. */

import type { Doc } from '../../../../../convex/_generated/dataModel';
import type { CategoryGroup } from './ExploreAllSection.types';

export function buildTopTemplateByCategory(
  groups: CategoryGroup[]
): Map<string, Doc<'templates'>> {
  const map = new Map<string, Doc<'templates'>>();
  for (const group of groups) {
    const top = [...group.templates].sort(
      (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
    )[0];
    if (top) map.set(group.category, top);
  }
  return map;
}
