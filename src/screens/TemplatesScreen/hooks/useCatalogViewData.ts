/**
 * Derived catalog groups, chips, and filtered templates for CatalogView.
 *
 * Chips and body content are built from two separate group passes on purpose:
 * the rail is built from the UNFILTERED catalog so it never collapses while
 * the user types — previously it was derived from the search-filtered groups,
 * which deleted every chip mid-search including the one the user was standing
 * on, stranding them on an empty list with no way back. Adds can't shrink the
 * rail either: buildCatalogGroups keeps added habits in their own category.
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

  // A chip's count is exactly the rows behind it, added ones included, because
  // added habits now stay in their category shelf. A count that excluded them
  // would undersell the chip and disagree with the section header beside it.
  const matchCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const group of groups) counts.set(group.category, group.templates.length);
    return counts;
  }, [groups]);

  // Drives the "All" chip and the "Show N matches" CTA, so it counts each match
  // once. The trailing "Added" group mirrors habits that are already counted in
  // their own category, so summing it too would inflate the promise.
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
