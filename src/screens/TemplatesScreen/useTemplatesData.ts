/**
 * Data fetching hooks for templates
 */

import { useMutation } from 'convex/react';
import { useMemo } from 'react';
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';

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
  const settings = useCachedQuery(
    api.settings.get,
    {},
    {
      entryName: 'settings.get',
    }
  );
  const importedIds = useCachedQuery(
    api.templates.getImportedTemplateIds,
    {},
    { entryName: 'templates.getImportedTemplateIds' }
  );
  const isLoading = allTemplates === undefined;
  const userHabitCount = userHabits?.length ?? 0;
  const isPremiumUser = settings?.hasPremium ?? false;
  const initialImportedIds = useMemo(
    () => new Set(Array.isArray(importedIds) ? importedIds.map(String) : []),
    [importedIds]
  );

  const importTemplate = useMutation(api.templates.importTemplate);
  const seedTemplates = useMutation(api.templates.seedTemplates);

  return {
    allTemplates,
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
