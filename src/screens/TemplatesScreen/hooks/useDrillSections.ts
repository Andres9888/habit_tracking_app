/**
 * Builds section-grouped flat list data for CategoryDrillView.
 * When sort=popular: splits into ⭐ Popular (top 3) + All habits (rest).
 * Other sorts: returns flat template list with no section headers.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { DrillSort } from './useCategoryDrillFilters';

export type DrillListItem =
  | { kind: 'header'; label: string }
  | {
      kind: 'template';
      template: Doc<'templates'>;
      isTopPick: boolean;
      popularityCount: string | null;
    };

function formatPopularityCount(
  score: number | null | undefined
): string | null {
  if (!score || score < 50) return null;
  if (score >= 1000) {
    const k = score / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return `${score}`;
}

export function useDrillSections(
  filtered: Doc<'templates'>[],
  sort: DrillSort
): DrillListItem[] {
  return useMemo(() => {
    if (sort !== 'popular' || filtered.length === 0) {
      return filtered.map((t) => ({
        kind: 'template' as const,
        isTopPick: false,
        popularityCount: null,
        template: t,
      }));
    }

    const popular = filtered.slice(0, 3);
    const rest = filtered.slice(3);
    const items: DrillListItem[] = [{ kind: 'header', label: '⭐ Popular' }];

    for (const [i, t] of popular.entries())
      items.push({
        kind: 'template',
        isTopPick: i === 0,
        popularityCount: formatPopularityCount(t.popularityScore),
        template: t,
      });

    if (rest.length > 0) {
      items.push({ kind: 'header', label: 'All habits' });
      for (const t of rest)
        items.push({
          kind: 'template',
          isTopPick: false,
          popularityCount: null,
          template: t,
        });
    }

    return items;
  }, [filtered, sort]);
}
