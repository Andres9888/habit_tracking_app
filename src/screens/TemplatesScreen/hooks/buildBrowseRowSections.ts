/**
 * Pure builder for the Minimal & Clean browse row sections:
 * "Popular" rows followed by top-priority category sections,
 * deduped against the featured pick and each other.
 */

import type { Doc } from '../../../../convex/_generated/dataModel';
import { CATEGORY_META } from '../data/categoryMeta';
import { CATEGORY_PRIORITY } from '../data/categoryPriority';
import { sortTemplatesByImportState } from '../utils/sortTemplatesByImportState';

const POPULAR_ROW_LIMIT = 4;
const CATEGORY_ROW_LIMIT = 3;
const ROW_SECTION_CATEGORY_IDS = CATEGORY_PRIORITY.slice(0, 2);

export interface BrowseRowSection {
  key: string;
  templates: Doc<'templates'>[];
  title: string;
}

interface BuildBrowseRowSectionsOptions {
  allTemplates: Doc<'templates'>[] | undefined;
  featuredTemplate: Doc<'templates'> | null;
  importedTemplateIds: Set<string>;
  popularTemplates: Doc<'templates'>[];
}

export function buildBrowseRowSections({
  allTemplates,
  featuredTemplate,
  importedTemplateIds,
  popularTemplates,
}: BuildBrowseRowSectionsOptions): BrowseRowSection[] {
  if (!allTemplates) return [];
  const usedIds = new Set<string>(
    featuredTemplate ? [featuredTemplate._id] : []
  );
  const sections: BrowseRowSection[] = [];

  const popularRows = popularTemplates
    .filter((t) => !usedIds.has(t._id))
    .slice(0, POPULAR_ROW_LIMIT);
  for (const t of popularRows) usedIds.add(t._id);
  if (popularRows.length > 0) {
    sections.push({ key: 'popular', templates: popularRows, title: 'Popular' });
  }

  for (const categoryId of ROW_SECTION_CATEGORY_IDS) {
    const meta = CATEGORY_META[categoryId];
    if (!meta) continue;
    const candidates = allTemplates
      .filter((t) => t.category === categoryId && !usedIds.has(t._id))
      .sort((a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0));
    const rows = sortTemplatesByImportState(
      candidates,
      importedTemplateIds
    ).slice(0, CATEGORY_ROW_LIMIT);
    for (const t of rows) usedIds.add(t._id);
    if (rows.length > 0) {
      sections.push({ key: categoryId, templates: rows, title: meta.label });
    }
  }

  return sections;
}
