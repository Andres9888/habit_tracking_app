/**
 * HabitsList Effects - Side effect hooks for HabitsList
 */

import { useEffect } from 'react';
import { InteractionManager } from 'react-native';
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
  // Uses InteractionManager to ensure smooth animations
  useEffect(() => {
    if (!justCreatedHabitId) return;
    let timer: NodeJS.Timeout;
    const task = InteractionManager.runAfterInteractions(() => {
      timer = setTimeout(() => setJustCreatedHabitId(null), NEW_HABIT_HIGHLIGHT_MS);
    });
    return () => {
      task.cancel();
      if (timer) clearTimeout(timer);
    };
  }, [justCreatedHabitId, setJustCreatedHabitId]);

  // Trigger entrance animation after layout settles
  // Defers heavy animation setup until interaction is complete
  useEffect(() => {
    if (
      shouldTriggerHabitEntrance ||
      isInSuccessCelebration ||
      habitsLength === 0
    )
      return;
    let timer: NodeJS.Timeout;
    const task = InteractionManager.runAfterInteractions(() => {
      timer = setTimeout(() => setShouldTriggerHabitEntrance(true), ENTRANCE_ANIMATION_DELAY_MS);
    });
    return () => {
      task.cancel();
      if (timer) clearTimeout(timer);
    };
  }, [
    habitsLength,
    isInSuccessCelebration,
    shouldTriggerHabitEntrance,
    setShouldTriggerHabitEntrance,
  ]);
}
