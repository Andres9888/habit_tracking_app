/**
 * HabitsList Effects - Side effect hooks for HabitsList
 */

import { useEffect } from 'react';
import type { Id } from '../../../../../convex/_generated/dataModel';
import { NEW_HABIT_HIGHLIGHT_MS } from '@/constants';

/**
 * Inputs required to manage HabitsList lifecycle side effects.
 */
interface UseHabitsListEffectsOptions {
  justCreatedHabitId: Id<'habits'> | null;
  setJustCreatedHabitId: (id: Id<'habits'> | null) => void;
  habitsLength: number;
  shouldTriggerHabitEntrance: boolean;
  setShouldTriggerHabitEntrance: (value: boolean) => void;
}

/**
 * Runs non-visual HabitsList effects:
 * - clears transient "just created" highlight state
 * Initial list rows render immediately; delayed entrances are reserved for
 * explicit create/highlight flows.
 */
export function useHabitsListEffects(options: UseHabitsListEffectsOptions) {
  const {
    justCreatedHabitId,
    setJustCreatedHabitId,
  } = options;

  // Clear "just created" highlight after a delay
  useEffect(() => {
    if (!justCreatedHabitId) return;
    const timer = setTimeout(() => setJustCreatedHabitId(null), NEW_HABIT_HIGHLIGHT_MS);
    return () => clearTimeout(timer);
  }, [justCreatedHabitId, setJustCreatedHabitId]);

}
