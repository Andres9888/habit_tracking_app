/**
 * HabitsList Effects - Side effect hooks for HabitsList
 */

import { useEffect } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';

/** Duration to highlight a newly created habit before clearing */
const NEW_HABIT_HIGHLIGHT_MS = 3000;

/** Brief delay before triggering entrance animation to allow layout */
const ENTRANCE_ANIMATION_DELAY_MS = 50;

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

  // Clear "just created" highlight after a delay
  useEffect(() => {
    if (!justCreatedHabitId) return;
    const timer = setTimeout(() => setJustCreatedHabitId(null), NEW_HABIT_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [justCreatedHabitId, setJustCreatedHabitId]);

  // Trigger entrance animation after layout settles
  useEffect(() => {
    if (
      shouldTriggerHabitEntrance ||
      isInSuccessCelebration ||
      habitsLength === 0
    )
      return;
    const timer = setTimeout(() => setShouldTriggerHabitEntrance(true), ENTRANCE_ANIMATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [
    habitsLength,
    isInSuccessCelebration,
    shouldTriggerHabitEntrance,
    setShouldTriggerHabitEntrance,
  ]);
}
