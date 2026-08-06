/**
 * Derived catalog groups, chips, and filtered templates for CatalogView.
 *
 * Chips and body content are built from two separate group passes on purpose:
 * the rail is built from the UNFILTERED catalog so it never collapses while
 * the user types — previously it was derived from the search-filtered groups,
 * which deleted every chip mid-search including the one the user was standing
 * on, stranding them on an empty list with no way back.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { ADDED_CATEGORY_ID } from '../data/categoryMeta';
import { CATALOG_ALL_ID } from '../views/CatalogChipRail';
import type { CatalogChipItem } from '../views/CatalogChipRail';
import { buildCatalogGroups } from './buildCatalogGroups';

interface UseCatalogViewDataOptions {
  allTemplates: Doc<'templates'>[];
  frozenImportedIds: Set<string>;
  searchQuery: string;
  selectedCategoryId: string;
}

export function useCatalogViewData({
  allTemplates,
  frozenImportedIds,
  searchQuery,
  selectedCategoryId,
}: UseCatalogViewDataOptions) {
  const query = searchQuery.trim();
  const isSearching = query.length > 0;

  // Stable rail source — no query, so this only recomputes when the catalog
  // or the added-snapshot changes, not on every keystroke.
  const chipGroups = useMemo(
    () => buildCatalogGroups(allTemplates, '', frozenImportedIds),
    [allTemplates, frozenImportedIds]
  );

  // Body source. Idle reuses chipGroups rather than rebuilding an identical
  // set, so the second pass only costs anything while a search is active.
  const groups = useMemo(
    () =>
      isSearching
        ? buildCatalogGroups(allTemplates, query, frozenImportedIds)
        : chipGroups,
    [allTemplates, chipGroups, frozenImportedIds, isSearching, query]
  );

  // Counts come from the post-split groups, so already-added habits (which
  // buildCatalogGroups moves into the "Added" bucket) are never counted as
  // addable matches — otherwise a chip could promise 3 results that turn out
  // to be three habits the user already tracks.
  const matchCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const group of groups) counts.set(group.category, group.templates.length);
    return counts;
  }, [groups]);

  // Drives the "Show N matches" CTA, so it must count only habits the user can
  // actually add. The trailing "Added" group is matches they already track —
  // counting it would send them somewhere with nothing to do.
  const totalMatches = useMemo(
    () =>
      groups.reduce(
        (sum, group) =>
          group.category === ADDED_CATEGORY_ID
            ? sum
            : sum + group.templates.length,
        0
      ),
    [groups]
  );

  const chipCategories = useMemo<CatalogChipItem[]>(
    () =>
      chipGroups.map((group) => ({
        categoryId: group.category,
        // Counts are search-only: at idle they are inventory noise, during a
        // search they turn the rail into a map of where the answers are.
        count: isSearching ? (matchCounts.get(group.category) ?? 0) : undefined,
        icon: group.icon,
        label: group.label,
      })),
    [chipGroups, isSearching, matchCounts]
  );

  const filteredTemplates = useMemo(() => {
    if (selectedCategoryId === CATALOG_ALL_ID) return [];
    return (
      groups.find((group) => group.category === selectedCategoryId)
        ?.templates ?? []
    );
  }, [groups, selectedCategoryId]);

  const selectedCategoryLabel = useMemo(
    () =>
      chipGroups.find((group) => group.category === selectedCategoryId)?.label,
    [chipGroups, selectedCategoryId]
  );

  return {
    chipCategories,
    filteredTemplates,
    groups,
    isSearching,
    query,
    selectedCategoryLabel,
    totalMatches,
  };
}
