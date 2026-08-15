import { useCallback, useEffect, useRef } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';

export function useImportedHabitTargets(
  initialTargets?: ReadonlyMap<Id<'templates'>, Id<'habits'>>
) {
  const importedHabitIdsByTemplateRef = useRef(
    new Map<Id<'templates'>, Id<'habits'>>(initialTargets)
  );

  useEffect(() => {
    if (!initialTargets) return;
    for (const [templateId, habitId] of initialTargets) {
      importedHabitIdsByTemplateRef.current.set(templateId, habitId);
    }
  }, [initialTargets]);

  const recordImportedHabit = useCallback(
    (templateId: Id<'templates'>, habitId: Id<'habits'> | undefined) => {
      if (habitId)
        importedHabitIdsByTemplateRef.current.set(templateId, habitId);
    },
    []
  );

  return { importedHabitIdsByTemplateRef, recordImportedHabit };
}
