/**
 * Sort/filter state for CategoryDrillView
 */

import { useCallback, useMemo, useState } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';

export type DrillSort = 'popular' | 'az';

export function useCategoryDrillFilters(
  templates: Doc<'templates'>[],
  importedTemplateIds: Set<string>
) {
  const [sort, setSort] = useState<DrillSort>('popular');
  const [hideImported, setHideImported] = useState(false);

  const filtered = useMemo(() => {
    const result = hideImported
      ? templates.filter((t) => !importedTemplateIds.has(t._id))
      : templates;

    switch (sort) {
      case 'popular': {
        return [...result].sort(
          (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
        );
      }
      case 'az': {
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      }
      default: {
        return result;
      }
    }
  }, [templates, sort, hideImported, importedTemplateIds]);

  const toggleHideImported = useCallback(() => setHideImported((v) => !v), []);

  return { filtered, hideImported, setSort, sort, toggleHideImported };
}
