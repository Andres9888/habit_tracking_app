/**
 * Data fetching hooks for templates
 */

import { useMutation, useQuery } from 'convex/react';
import { useMemo } from 'react';
import { api } from '../../../convex/_generated/api';
import type { CategoryFilter } from '../templates/templates.types';
import type { Doc } from '../../../convex/_generated/dataModel';

const FALLBACK_CATEGORIES: CategoryFilter[] = [
  { icon: '✨', id: 'all', label: 'All' },
];

const CATEGORY_METADATA: Record<string, Omit<CategoryFilter, 'id'>> = {
  andrew_huberman: { icon: '🔬', label: 'Huberman' },
  breathing: { icon: '🌬️', label: 'Breathing' },
  creativity: { icon: '🎨', label: 'Creativity' },
  environmental_design: { icon: '🏠', label: 'Environment' },
  financial: { icon: '💰', label: 'Financial' },
  health_fitness: { icon: '💪', label: 'Health' },
  learning: { icon: '📚', label: 'Learning' },
  longevity: { icon: '🧬', label: 'Longevity' },
  mental_health: { icon: '🧠', label: 'Mental Health' },
  mindfulness: { icon: '🧘', label: 'Mindfulness' },
  morning_routine: { icon: '🌅', label: 'Morning' },
  productivity: { icon: '🎯', label: 'Productivity' },
  recovery: { icon: '🔄', label: 'Recovery' },
  relationships: { icon: '💑', label: 'Relationships' },
  sleep: { icon: '😴', label: 'Sleep' },
  social: { icon: '👥', label: 'Social' },
  subtraction: { icon: '➖', label: 'Less Is More' },
};

function getCategoriesFromTemplates(templates: Doc<'templates'>[] | undefined) {
  if (!templates || templates.length === 0) {
    return FALLBACK_CATEGORIES;
  }

  const uniqueCategories = [
    ...new Set(templates.map((template) => template.category).filter(Boolean)),
  ].sort();

  const normalized = uniqueCategories.map((category) => {
    const metadata = CATEGORY_METADATA[category as string] ?? {
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
  const allTemplates = useQuery(api.templates.list, {});
  const userHabits = useQuery(api.habits.list);
  const settings = useQuery(api.settings.get);
  const importedIds = useQuery(api.templates.getImportedTemplateIds, {});
  const isLoading = allTemplates === undefined;
  const userHabitCount = userHabits?.length ?? 0;
  const isPremiumUser = settings?.hasPremium ?? false;
  const categories = useMemo(
    () => getCategoriesFromTemplates(allTemplates),
    [allTemplates]
  );

  const initialImportedIds = useMemo(
    () => new Set(Array.isArray(importedIds) ? importedIds.map(String) : []),
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
