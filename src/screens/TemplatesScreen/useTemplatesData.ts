/**
 * Data fetching hooks for templates
 */

import { useMutation } from 'convex/react';
import { useMemo } from 'react';
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';
import { useSettingsQuery } from '../../lib/settings/useSettingsQuery';
import type { CategoryFilter } from '../templates/templates.types';
import type { Doc } from '../../../convex/_generated/dataModel';
import { CATEGORY_META } from './data/categoryMeta';

const FALLBACK_CATEGORIES: CategoryFilter[] = [
  { icon: '✨', id: 'all', label: 'All' },
];

function getCategoriesFromTemplates(templates: Doc<'templates'>[] | undefined) {
  if (!templates || templates.length === 0) {
    return FALLBACK_CATEGORIES;
  }

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

    return {
      ...metadata,
      id: category as CategoryFilter['id'],
    };
  });

  return [...FALLBACK_CATEGORIES, ...normalized];
}

export function useTemplatesData() {
  const allTemplates = useCachedQuery(
    api.templates.list,
    {},
    { entryName: 'templates.list' }
  );
  const userHabits = useCachedQuery(
    api.habits.list,
    {},
    {
      entryName: 'habits.list',
    }
  );
  const settings = useSettingsQuery();
  const importedIds = useCachedQuery(
    api.templates.getImportedTemplateIds,
    {},
    { entryName: 'templates.getImportedTemplateIds' }
  );
  const isLoading = allTemplates === undefined;
  const userHabitCount = userHabits?.length ?? 0;
  const isPremiumUser = settings?.hasPremium ?? false;
  const categories = useMemo(
    () => getCategoriesFromTemplates(allTemplates),
    [allTemplates]
  );

  const initialImportedIds = useMemo(
    () =>
      Array.isArray(importedIds) ? new Set(importedIds.map(String)) : undefined,
    [importedIds]
  );

  const importTemplate = useMutation(api.templates.importTemplate);
  const seedTemplates = useMutation(api.templates.seedTemplates);

  return {
    allTemplates,
    categories,
    importTemplate,
    initialImportedIds,
    isLoading,
    isPremiumUser,
    seedTemplates,
    userHabitCount,
  };
}

// Re-export filtered hooks for convenience
export {
  useCategoryCounts,
  useFilteredTemplates,
  useScienceCountsByCategory,
  useTemplatesByCategory,
} from './useFilteredTemplates';
