/**
 * Groups all templates by category for the Explore All section.
 * Categories not present in CATEGORY_META are merged into a single 'other' group.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../../convex/_generated/dataModel';
import { getCategoryMeta, isKnownCategory } from '../../data/categoryMeta';
import type { CategoryGroup } from './ExploreAllSection.types';

const OTHER_KEY = 'other';

export function useGroupedTemplates(
  allTemplates: Doc<'templates'>[] | undefined
): { groups: CategoryGroup[]; totalCount: number } {
  return useMemo(() => {
    if (!allTemplates?.length) return { groups: [], totalCount: 0 };

    const map = new Map<string, Doc<'templates'>[]>();
    for (const t of allTemplates) {
      const raw = t.category || 'uncategorized';
      const key = isKnownCategory(raw) ? raw : OTHER_KEY;
      const arr = map.get(key);
      if (arr) arr.push(t);
      else map.set(key, [t]);
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

    groups.sort((a, b) => {
      if (a.category === OTHER_KEY) return 1;
      if (b.category === OTHER_KEY) return -1;
      return b.templates.length - a.templates.length;
    });

    return { groups, totalCount: allTemplates.length };
  }, [allTemplates]);
}
