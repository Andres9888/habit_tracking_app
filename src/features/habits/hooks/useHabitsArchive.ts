import { useCallback, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';
import { optimisticStore } from '../../../lib/optimistic';
import { showGenericError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';
import { cancelHabitReminder } from '../../../utils/notifications';

export interface UseHabitsArchiveResult {
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
}

export function useHabitsArchive(habits: Habit[]): UseHabitsArchiveResult {
  const archiveHabitMutation = useMutation(api.habits.archive);

  // Latest-ref: habits gets a new identity on every toggle; reading it through
  // a ref keeps handleArchive stable so memo'd habit cards don't re-render.
  const habitsRef = useRef(habits);
  habitsRef.current = habits;

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      const habit = habitsRef.current.find((h) => h._id === habitId);
      const habitName = habit?.name ?? 'Habit';

      // Apply optimistic update immediately
      const operationId = optimisticStore.addArchive({
        habitId,
        habitName,
        toArchived: true,
      });

      try {
        await archiveHabitMutation({ habitId });
        await cancelHabitReminder(String(habitId));
        optimisticStore.confirm(operationId);
        logInteraction('habit_archived', { habitId, habitName });
      } catch (error) {
        // Rollback on failure
        optimisticStore.fail(operationId, error as Error);
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
