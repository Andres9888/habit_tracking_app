/**
 * Groups all templates by category for the Explore All section
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { getCategoryMeta } from '../../data/categoryMeta';
import type { CategoryGroup } from './ExploreAllSection.types';

export function useGroupedTemplates(
  allTemplates: Doc<'templates'>[] | undefined
): { groups: CategoryGroup[]; totalCount: number } {
  return useMemo(() => {
    if (!allTemplates?.length) return { groups: [], totalCount: 0 };

    const map = new Map<string, Doc<'templates'>[]>();
    for (const t of allTemplates) {
      const cat = t.category || 'uncategorized';
      const arr = map.get(cat);
      if (arr) arr.push(t);
      else map.set(cat, [t]);
    }

    const groups: CategoryGroup[] = [];
    for (const [category, templates] of map) {
      const meta = getCategoryMeta(category);
      templates.sort(
        (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
      );
      groups.push({
        category, icon: meta.icon, label: meta.label,
        subtitle: meta.subtitle, templates,
      });
    }

    groups.sort((a, b) => b.templates.length - a.templates.length);

    return { groups, totalCount: allTemplates.length };
  }, [allTemplates]);
}
