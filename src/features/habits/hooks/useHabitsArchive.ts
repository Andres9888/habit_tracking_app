import { useCallback, useRef } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';
import { useOfflineArchiveHabit } from '../../../lib/optimistic';
import { showGenericError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export interface UseHabitsArchiveResult {
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
}

export function useHabitsArchive(habits: Habit[]): UseHabitsArchiveResult {
  const archiveHabitMutation = useOfflineArchiveHabit();

  // Latest-ref: habits gets a new identity on every toggle; reading it through
  // a ref keeps handleArchive stable so memo'd habit cards don't re-render.
  const habitsRef = useRef(habits);
  habitsRef.current = habits;

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      const habit = habitsRef.current.find((h) => h._id === habitId);
      const habitName = habit?.name ?? 'Habit';

      try {
        await archiveHabitMutation({ habitId, habitName });
        logInteraction('habit_archived', { habitId, habitName });
      } catch (error) {
        if (__DEV__) console.error('[useHabitsArchive] Archive failed:', error);
        showGenericError(ERROR_MESSAGES.DATA_OPS.ARCHIVE_HABIT_FAILED);
      }
    },
    [archiveHabitMutation]
  );

  return {
    handleArchive,
  };
}
