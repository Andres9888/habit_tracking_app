/**
 * Shared category ordering — drives catalog category grouping and the order of
 * the chip rail above the template list.
 *
 * Ordering rationale (only ~3-4 chips are visible before the horizontal fold,
 * so the leading slots are the real inventory):
 *   1. Deepest buckets lead. Already-added templates are pulled into the
 *      "Added" group, so thin categories thin out further with use; putting a
 *      shallow category in a prime slot invites dead-end taps.
 *   2. Related categories sit adjacent, following the four hue families in
 *      CATEGORY_META, so the rail reads as bands rather than noise.
 *   3. Premium / person-named categories trail, so a locked chip never fronts
 *      the rail before the user has gotten any value.
 */

import type { CategoryId } from './categoryMeta';

/**
 * Identity function that only accepts a list covering every `CategoryId`.
 * If a category is added to CATEGORY_META but not ranked below, `Exclude`
 * resolves to a non-never union and the parameter type collapses to `never`,
 * failing the call. Ranking an id that no longer exists fails the same way.
 */
const rankedList = <const T extends readonly CategoryId[]>(
  list: Exclude<CategoryId, T[number]> extends never
    ? T
    : { __unrankedCategories: Exclude<CategoryId, T[number]> }
): T => list as T;

export const CATEGORY_PRIORITY = rankedList([
  // Body / growth — the deepest bucket in the catalog leads the rail.
  'health_fitness',
  'morning_routine',
  // Rest cluster.
  'sleep',
  'recovery',
  // Mind cluster.
  'mindfulness',
  'mental_health',
  'breathing',
  // Output / life admin.
  'productivity',
  'learning',
  'financial',
  'social',
  // Long tail.
  'creativity',
  'longevity',
  'environmental_design',
  'subtraction',
  // Premium and person-named — deliberately last.
  'andrew_huberman',
]);

const PRIORITY_BY_ID = new Map<string, number>(
  CATEGORY_PRIORITY.map((id, index) => [id, index])
);

/** Unranked ids (the "Other" bucket, "Added") sort after every ranked one. */
export function getCategoryPriority(categoryId: string) {
  return PRIORITY_BY_ID.get(categoryId) ?? CATEGORY_PRIORITY.length;
}
