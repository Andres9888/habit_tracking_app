/**
 * AddHabitStep hooks — template queries and import handler.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useMutation, useQuery } from 'convex/react';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { TemplateCategory } from '../../../../convex/templates/types';
import type { CategoryPillData } from '../onboarding.types';

export function useTemplatesByCategory(
  selected: CategoryPillData['category']
) {
  const popularTemplates = useQuery(api.templates.getPopular, { limit: 12 });
  const categoryTemplates = useQuery(
    api.templates.list,
    selected === 'popular'
      ? 'skip'
      : { category: selected as TemplateCategory }
  );

  return selected === 'popular' ? popularTemplates : categoryTemplates;
}

export function useImportTemplate(
  onHabitCreated: (habitId: Id<'habits'>) => void
) {
  const importTemplate = useMutation(api.templates.importTemplate);
  const [importingId, setImportingId] = useState<Id<'templates'> | null>(null);

  const handleImport = useCallback(
    async (templateId: Id<'templates'>) => {
      if (importingId) return;
      setImportingId(templateId);
      try {
        const result = await importTemplate({ templateId });
        if (result?.habitId) {
          onHabitCreated(result.habitId);
        }
      } catch (error_) {
        if (__DEV__) console.error('[AddHabitStep] Import failed:', error_);
        setImportingId(null);
      }
    },
    [importTemplate, importingId, onHabitCreated]
  );

  return { handleImport, importingId };
}

/**
 * Detects when a habit is created via the custom creation modal.
 * Watches habits list length; when it increases while modal was open, fires callback.
 */
export function useCustomHabitDetection(
  onHabitCreated: (habitId: Id<'habits'>) => void
) {
  const habits = useQuery(api.habits.list);
  const habitsCount = habits?.length ?? 0;
  const prevCountRef = useRef(habitsCount);
  const modalWasOpenRef = useRef(false);

  useEffect(() => {
    if (
      modalWasOpenRef.current &&
      habitsCount > prevCountRef.current &&
      habits
    ) {
      const newest = habits[habits.length - 1];
      if (newest) {
        modalWasOpenRef.current = false;
        onHabitCreated(newest._id);
      }
    }
    prevCountRef.current = habitsCount;
  }, [habitsCount, habits, onHabitCreated]);

  const markModalOpened = useCallback(() => {
    modalWasOpenRef.current = true;
  }, []);

  return { markModalOpened };
}
