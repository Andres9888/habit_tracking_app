/**
 * Pure builder for the browse "fast path" row section: a short list of
 * one-tap quick-start habits below the transformation goal grid.
 * Non-imported templates surface first, ordered by popularity.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';

const QUICK_START_LIMIT = 3;

export interface BrowseRowSection {
  key: string;
  templates: Doc<'templates'>[];
  title: string;
}

interface BuildBrowseRowSectionsOptions {
  allTemplates: Doc<'templates'>[] | undefined;
  popularTemplates: Doc<'templates'>[];
}

export function buildBrowseRowSections({
  allTemplates,
  popularTemplates,
}: BuildBrowseRowSectionsOptions): BrowseRowSection[] {
  if (!allTemplates) return [];
  const quickStart = popularTemplates.slice(0, QUICK_START_LIMIT);
  if (quickStart.length === 0) return [];
  return [
    { key: 'popular', templates: quickStart, title: 'Popular right now' },
  ];
}
