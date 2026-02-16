/**
 * HabitsList Effects - Side effect hooks for HabitsList
 */

import { useEffect } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import {
  ENTRANCE_ANIMATION_DELAY_MS,
  NEW_HABIT_HIGHLIGHT_MS,
} from '@/constants';

/**
 * Inputs required to manage HabitsList lifecycle side effects.
 */
interface UseHabitsListEffectsOptions {
  justCreatedHabitId: Id<'habits'> | null;
  setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
  shouldTriggerHabitEntrance: boolean;
  isInSuccessCelebration: boolean;
  setShouldTriggerHabitEntrance: (value: boolean) => void;
  habitsLength: number;
}

/**
 * Runs non-visual HabitsList effects:
 * - clears transient "just created" highlight state
 * - triggers initial row entrance animation once layout settles
 */
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
