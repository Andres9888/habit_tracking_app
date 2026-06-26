/**
 * Pure builder for the browse "fast path" row section: a short list of
 * one-tap quick-start habits below the transformation goal grid.
 * Non-imported templates surface first, ordered by popularity.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';

const QUICK_START_LIMIT = 3;
const SAVED_LIMIT = 6;

export interface BrowseRowSection {
  key: string;
  templates: Doc<'templates'>[];
  title: string;
}

interface BuildBrowseRowSectionsOptions {
  allTemplates: Doc<'templates'>[] | undefined;
  popularTemplates: Doc<'templates'>[];
  savedTemplates?: Doc<'templates'>[];
}

export function buildBrowseRowSections({
  allTemplates,
  popularTemplates,
  savedTemplates = [],
}: BuildBrowseRowSectionsOptions): BrowseRowSection[] {
  if (!allTemplates) return [];
  const sections: BrowseRowSection[] = [];
  if (savedTemplates.length > 0) {
    sections.push({
      key: 'saved',
      templates: savedTemplates.slice(0, SAVED_LIMIT),
      title: 'Saved',
    });
  }
  const quickStart = popularTemplates.slice(0, QUICK_START_LIMIT);
  if (quickStart.length > 0) {
    sections.push({
      key: 'popular',
      templates: quickStart,
      title: 'Popular right now',
    });
  }
  return sections;
}
