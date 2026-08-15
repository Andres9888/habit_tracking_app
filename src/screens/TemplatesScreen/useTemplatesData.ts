import { useMutation } from 'convex/react';
import { useMemo } from 'react';
import { api } from '../../../convex/_generated/api';
import { useCachedQuery } from '../../lib/queryCache';
import type { Id } from '../../../convex/_generated/dataModel';
import { getCategoriesFromTemplates } from './data/getCategoriesFromTemplates';

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
  const importedTemplateHabits = useCachedQuery(
    api.templates.getImportedTemplateHabits,
    {},
    { entryName: 'templates.getImportedTemplateHabits' }
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
  const initialImportedHabitIds = useMemo(() => {
    if (!Array.isArray(importedTemplateHabits)) return;
    return new Map<Id<'templates'>, Id<'habits'>>(
      importedTemplateHabits.map(({ habitId, templateId }) => [
        templateId,
        habitId,
      ])
    );
  }, [importedTemplateHabits]);

  const importTemplate = useMutation(api.templates.importTemplate);
  const seedTemplates = useMutation(api.templates.seedTemplates);

  return {
    allTemplates,
    categories,
    importTemplate,
    initialImportedHabitIds,
    initialImportedIds,
    isLoading,
    isPremiumUser,
    seedTemplates,
    userHabitCount,
  };
}
