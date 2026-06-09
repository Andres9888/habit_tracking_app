/**
 * Personalized template recommendations for the For you rail.
 */

import { useMemo } from 'react';
import type { Doc } from '../../../../convex/_generated/dataModel';
import {
  scoreRecommendedTemplates,
  type RecommendedTemplate,
} from './scoreRecommendedTemplates';

interface UseRecommendedTemplatesOptions {
  allTemplates: Doc<'templates'>[] | undefined;
  importedTemplateIds: Set<string>;
  userHabitCount: number;
  userHabits: { name: string }[] | undefined;
}

export function useRecommendedTemplates({
  allTemplates,
  importedTemplateIds,
  userHabitCount,
  userHabits,
}: UseRecommendedTemplatesOptions): RecommendedTemplate[] {
  return useMemo(() => {
    if (!allTemplates?.length || !userHabits) return [];
    return scoreRecommendedTemplates({
      allTemplates,
      importedTemplateIds,
      userHabitCount,
      userHabitNames: userHabits.map((habit) => habit.name),
    });
  }, [allTemplates, importedTemplateIds, userHabitCount, userHabits]);
}
