import type { Doc } from '../../../convex/_generated/dataModel';
import { getCategoryMeta } from './data/categoryMeta';

export function normalizeTemplateSearchValue(value: string | null | undefined) {
  return (value ?? '').trim().toLowerCase();
}

export function matchesTemplateSearch(
  template: Doc<'templates'>,
  searchQuery: string
) {
  const categoryFallback = template.category.replaceAll('_', ' ');
  const categoryLabel =
    `${categoryFallback} ${getCategoryMeta(template.category).label}`.trim();
  return (
    normalizeTemplateSearchValue(template.name).includes(searchQuery) ||
    normalizeTemplateSearchValue(template.description).includes(searchQuery) ||
    normalizeTemplateSearchValue(template.scientificReference).includes(
      searchQuery
    ) ||
    normalizeTemplateSearchValue(template.frequency).includes(searchQuery) ||
    normalizeTemplateSearchValue(categoryLabel).includes(searchQuery)
  );
}
