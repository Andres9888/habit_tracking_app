import type { Doc } from '../../../../convex/_generated/dataModel';
import type { CategoryFilter } from '../../templates/templates.types';
import { CATEGORY_META } from './categoryMeta';

const FALLBACK_CATEGORIES: CategoryFilter[] = [
  { icon: '✨', id: 'all', label: 'All' },
];

export function getCategoriesFromTemplates(
  templates: Doc<'templates'>[] | undefined
) {
  if (!templates?.length) return FALLBACK_CATEGORIES;
  const uniqueCategories = [
    ...new Set(templates.map((template) => template.category).filter(Boolean)),
  ].sort();
  const normalized = uniqueCategories.map((category) => {
    const id = category as string;
    const canonical = CATEGORY_META[id];
    const metadata = canonical
      ? { icon: canonical.icon, label: canonical.label }
      : {
          icon: '📌',
          label:
            typeof category === 'string'
              ? category.charAt(0).toUpperCase() +
                category.slice(1).replaceAll('_', ' ')
              : 'Template',
        };
    return { ...metadata, id: category as CategoryFilter['id'] };
  });
  return [...FALLBACK_CATEGORIES, ...normalized];
}
