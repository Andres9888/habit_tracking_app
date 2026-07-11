/**
 * HabitsList Effects - Side effect hooks for HabitsList
 */

import { useEffect, type MutableRefObject } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { NEW_HABIT_HIGHLIGHT_MS } from '@/constants';

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
 *
 * Note: rows paint directly in their final state on initial load — there is no
 * staggered entrance animation, so this hook no longer arms an entrance trigger.
 */
export function useHabitsListEffects(options: UseHabitsListEffectsOptions) {
  const {
    justCreatedHabitId,
    setJustCreatedHabitId,
    habitsLength,
    initialEntranceDoneRef,
  } = options;

  // Clear "just created" highlight after a delay
  useEffect(() => {
    if (!justCreatedHabitId) return;
    const timer = setTimeout(() => setJustCreatedHabitId(null), NEW_HABIT_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [justCreatedHabitId, setJustCreatedHabitId]);

  // After the first commit with rows, later virtualization mounts skip entering
  useEffect(() => {
    if (habitsLength > 0) initialEntranceDoneRef.current = true;
  }, [habitsLength, initialEntranceDoneRef]);
}
