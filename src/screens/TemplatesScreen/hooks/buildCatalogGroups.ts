/**
 * Builds category groups for the catalog page shelves (reuses CategoryGroup).
 *
 * Templates the user has already added (per the frozen snapshot) stay in their
 * own category section and are *also* mirrored into an "Added" group appended
 * at the bottom. An earlier version moved them, which quietly deleted a chip
 * once its last habit was added — a heavy user with 290 of 293 templates added
 * saw the rail collapse to "All | Huberman | Added" and read it as lost data.
 * Within a section the un-added ones sort first, so every shelf still opens on
 * something the user can act on.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';
import type { CategoryGroup } from '../components/ExploreAllSection/ExploreAllSection.types';
import { ADDED_CATEGORY_ID, CATEGORY_META, getCategoryMeta } from '../data/categoryMeta';
import { getCategoryPriority } from '../data/categoryPriority';

/**
 * Name and description alone miss the obvious case: searching "fitness" found
 * nothing for a habit called "Morning run" filed under Health & Fitness. The
 * category label and the start-small line are both things users type, so both
 * belong in the haystack.
 */
function matchesSearch(template: Doc<'templates'>, query: string): boolean {
  const haystack = [
    template.name,
    template.description,
    getCategoryMeta(template.category).label,
    template.startSmallVersion,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
  return haystack.includes(query);
}

const byPopularity = (a: Doc<'templates'>, b: Doc<'templates'>) =>
  (b.popularityScore ?? 0) - (a.popularityScore ?? 0);

/** Un-added first, then popularity — added habits sink to the shelf's tail. */
const byAddableThenPopularity =
  (addedIds: Set<string>) => (a: Doc<'templates'>, b: Doc<'templates'>) => {
    const rank = Number(addedIds.has(a._id)) - Number(addedIds.has(b._id));
    return rank === 0 ? byPopularity(a, b) : rank;
  };

function toGroup(
  category: string,
  templates: Doc<'templates'>[],
  sort: (a: Doc<'templates'>, b: Doc<'templates'>) => number = byPopularity
): CategoryGroup {
  const meta = getCategoryMeta(category);
  return {
    category,
    icon: meta.icon,
    label: meta.label,
    subtitle: meta.subtitle,
    templates: [...templates].sort(sort),
  };
}

function addToCategory(
  map: Map<string, Doc<'templates'>[]>,
  template: Doc<'templates'>
): void {
  // Collapse unknown categories into one bucket so the chip rail shows a
  // single "Other" chip instead of one per unrecognized category id.
  const raw = template.category || 'uncategorized';
  const category = CATEGORY_META[raw] ? raw : 'uncategorized';
  const existing = map.get(category);
  if (existing) existing.push(template);
  else map.set(category, [template]);
}

export function buildCatalogGroups(
  allTemplates: Doc<'templates'>[] | undefined,
  searchQuery: string,
  frozenImportedIds: Set<string>
): CategoryGroup[] {
  if (!allTemplates?.length) return [];
  const query = searchQuery.trim().toLowerCase();
  const map = new Map<string, Doc<'templates'>[]>();
  const added: Doc<'templates'>[] = [];
  const sortShelf = byAddableThenPopularity(frozenImportedIds);

  for (const template of allTemplates) {
    if (query && !matchesSearch(template, query)) continue;
    if (frozenImportedIds.has(template._id)) added.push(template);
    addToCategory(map, template);
  }

  const groups = [...map]
    .map(([category, templates]) => toGroup(category, templates, sortShelf))
    .sort((a, b) => getCategoryPriority(a.category) - getCategoryPriority(b.category));

  if (added.length > 0) groups.push(toGroup(ADDED_CATEGORY_ID, added));
  return groups;
}
