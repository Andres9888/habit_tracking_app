/**
 * Derived catalog groups, chips, and filtered templates for CatalogView.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import { CATALOG_ALL_ID } from '../views/CatalogChipRail';
import type { CatalogChipItem } from '../views/CatalogChipRail';
import { buildCatalogGroups } from './buildCatalogGroups';

interface UseCatalogViewDataOptions {
  allTemplates: Doc<'templates'>[];
  importedTemplateIds: Set<string>;
  searchQuery: string;
  selectedCategoryId: string;
}

export function useCatalogViewData({
  allTemplates,
  importedTemplateIds,
  searchQuery,
  selectedCategoryId,
}: UseCatalogViewDataOptions) {
  const groups = useMemo(
    () => buildCatalogGroups(allTemplates, searchQuery, importedTemplateIds),
    [allTemplates, importedTemplateIds, searchQuery]
  );

  const chipCategories = useMemo<CatalogChipItem[]>(
    () =>
      groups.map((group) => ({
        categoryId: group.category,
        icon: group.icon,
        label: group.label,
      })),
    [groups]
  );

  const filteredTemplates = useMemo(() => {
    if (selectedCategoryId === CATALOG_ALL_ID) return [];
    return (
      groups.find((group) => group.category === selectedCategoryId)
        ?.templates ?? []
    );
  }, [groups, selectedCategoryId]);

  return { chipCategories, filteredTemplates, groups };
}
