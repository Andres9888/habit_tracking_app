/** Filtering, sorting, and session-add tracking for LibraryLandingView. */

import { useCallback, useMemo, useState } from 'react';
import type { Doc, Id } from '../../../../convex/_generated/dataModel';
import { CATALOG_ALL_ID } from './CatalogChipRail';

interface UseLibraryLandingViewOptions {
  allTemplates: Doc<'templates'>[];
  onImport: (template: Doc<'templates'>) => void;
  searchQuery: string;
}

function matchesSearch(template: Doc<'templates'>, query: string): boolean {
  if (!query) return true;
  const haystack =
    `${template.name} ${template.tagline ?? ''} ${template.description}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function useLibraryLandingView({
  allTemplates,
  onImport,
  searchQuery,
}: UseLibraryLandingViewOptions) {
  const [selectedCategoryId, setSelectedCategoryId] = useState(CATALOG_ALL_ID);
  const [justAddedIds, setJustAddedIds] = useState<Set<Id<'templates'>>>(
    () => new Set()
  );

  const topTemplateByCategory = useMemo(() => {
    const map = new Map<string, Doc<'templates'>>();
    for (const template of allTemplates) {
      const current = map.get(template.category);
      if (!current || (template.popularityScore ?? 0) > (current.popularityScore ?? 0)) {
        map.set(template.category, template);
      }
    }
    return map;
  }, [allTemplates]);

  const visibleTemplates = useMemo(() => {
    return allTemplates
      .filter(
        (template) =>
          (selectedCategoryId === CATALOG_ALL_ID ||
            template.category === selectedCategoryId) &&
          matchesSearch(template, searchQuery)
      )
      .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
  }, [allTemplates, searchQuery, selectedCategoryId]);

  const handleImport = useCallback(
    (template: Doc<'templates'>) => {
      setJustAddedIds((prev) => new Set(prev).add(template._id));
      onImport(template);
    },
    [onImport]
  );

  return {
    handleImport,
    justAddedIds,
    onSelectCategory: setSelectedCategoryId,
    selectedCategoryId,
    topTemplateByCategory,
    visibleTemplates,
  };
}
