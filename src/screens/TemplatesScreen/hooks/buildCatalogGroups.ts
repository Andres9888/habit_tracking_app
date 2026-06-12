/**
 * Builds category groups for the catalog page shelves (reuses CategoryGroup).
 */

import type { Doc } from '../../../../convex/_generated/dataModel';
import type { CategoryGroup } from '../components/ExploreAllSection/ExploreAllSection.types';
import { getCategoryMeta } from '../data/categoryMeta';
import { getCategoryPriority } from '../data/categoryPriority';
import { sortTemplatesByImportState } from '../utils/sortTemplatesByImportState';

function matchesSearch(template: Doc<'templates'>, query: string): boolean {
  const haystack = `${template.name} ${template.description}`.toLowerCase();
  return haystack.includes(query);
}

export function buildCatalogGroups(
  allTemplates: Doc<'templates'>[] | undefined,
  searchQuery: string,
  importedTemplateIds: Set<string>
): CategoryGroup[] {
  if (!allTemplates?.length) return [];
  const query = searchQuery.trim().toLowerCase();
  const map = new Map<string, Doc<'templates'>[]>();

  for (const template of allTemplates) {
    if (query && !matchesSearch(template, query)) continue;
    const category = template.category || 'uncategorized';
    const existing = map.get(category);
    if (existing) existing.push(template);
    else map.set(category, [template]);
  }

  const groups: CategoryGroup[] = [];
  for (const [category, templates] of map) {
    const meta = getCategoryMeta(category);
    const ordered = sortTemplatesByImportState(
      [...templates].sort(
        (a, b) => (b.popularityScore ?? 0) - (a.popularityScore ?? 0)
      ),
      importedTemplateIds
    );
    if (ordered.length === 0) continue;
    groups.push({
      category,
      icon: meta.icon,
      label: meta.label,
      subtitle: meta.subtitle,
      templates: ordered,
    });
  }

  return groups.sort(
    (a, b) => getCategoryPriority(a.category) - getCategoryPriority(b.category)
  );
}
