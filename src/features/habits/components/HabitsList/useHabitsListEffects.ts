/**
 * HabitsList Effects - Side effect hooks for HabitsList
 */

import { useEffect } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';

interface UseHabitsListEffectsOptions {
  justCreatedHabitId: Id<'habits'> | null;
  setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
  shouldTriggerHabitEntrance: boolean;
  isInSuccessCelebration: boolean;
  setShouldTriggerHabitEntrance: (value: boolean) => void;
  habitsLength: number;
}

export function useHabitsListEffects(options: UseHabitsListEffectsOptions) {
  const {
    justCreatedHabitId,
    setJustCreatedHabitId,
    shouldTriggerHabitEntrance,
    isInSuccessCelebration,
    setShouldTriggerHabitEntrance,
    habitsLength,
  } = options;

  useEffect(() => {
    if (!justCreatedHabitId) return;
    const t = setTimeout(() => setJustCreatedHabitId(null), 3000);
    return () => clearTimeout(t);
  }, [justCreatedHabitId, setJustCreatedHabitId]);

  useEffect(() => {
    if (
      shouldTriggerHabitEntrance ||
      isInSuccessCelebration ||
      habitsLength === 0
    )
      return;
    const t = setTimeout(() => setShouldTriggerHabitEntrance(true), 50);
    return () => clearTimeout(t);
  }, [
    habitsLength,
    isInSuccessCelebration,
    shouldTriggerHabitEntrance,
    setShouldTriggerHabitEntrance,
  ]);
}
