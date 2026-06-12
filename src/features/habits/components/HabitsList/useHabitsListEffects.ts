/**
 * HabitsList Effects - Side effect hooks for HabitsList
 */

import { useEffect, type MutableRefObject } from 'react';
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
  setShouldTriggerHabitEntrance: (value: boolean) => void;
  habitsLength: number;
  initialEntranceDoneRef: MutableRefObject<boolean>;
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
    setShouldTriggerHabitEntrance,
    habitsLength,
    initialEntranceDoneRef,
  } = options;

  // Clear "just created" highlight after a delay
  useEffect(() => {
    if (!justCreatedHabitId) return;
    const timer = setTimeout(() => setJustCreatedHabitId(null), NEW_HABIT_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [justCreatedHabitId, setJustCreatedHabitId]);

  // Trigger entrance animation after layout settles
  useEffect(() => {
    if (shouldTriggerHabitEntrance || habitsLength === 0) return;
    const timer = setTimeout(() => setShouldTriggerHabitEntrance(true), ENTRANCE_ANIMATION_DELAY_MS);
    return () => clearTimeout(timer);
  }, [
    habitsLength,
    shouldTriggerHabitEntrance,
    setShouldTriggerHabitEntrance,
  ]);

  // After the first commit with rows, later virtualization mounts skip entering
  useEffect(() => {
    if (habitsLength > 0) initialEntranceDoneRef.current = true;
  }, [habitsLength, initialEntranceDoneRef]);
}
