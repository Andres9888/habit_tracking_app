/**
 * Builds section-grouped flat list data for CategoryDrillView.
 * When sort=popular: top 3 items, then a divider, then the rest.
 * Other sorts: returns flat template list with no divider.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import type { DrillSort } from './useCategoryDrillFilters';

export type DrillListItem =
  | { kind: 'divider' }
  | {
      kind: 'template';
      template: Doc<'templates'>;
      isTopPick: boolean;
      popularityCount: string | null;
    };

export function formatPopularityCount(
  score: number | null | undefined
): string | null {
  if (!score || score < 1) return null;
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
    const toItem = (t: Doc<'templates'>, isTopPick = false) => ({
      kind: 'template' as const,
      isTopPick,
      popularityCount: formatPopularityCount(t.popularityScore),
      template: t,
    });

    if (sort !== 'popular' || filtered.length === 0) {
      return filtered.map((t) => toItem(t));
    }

    const popular = filtered.slice(0, 3);
    const rest = filtered.slice(3);
    const items: DrillListItem[] = [];

    for (const [i, t] of popular.entries()) items.push(toItem(t, i === 0));

    if (rest.length > 0) {
      items.push({ kind: 'divider' });
      for (const t of rest) items.push(toItem(t));
    }

    return items;
  }, [filtered, sort]);
}
