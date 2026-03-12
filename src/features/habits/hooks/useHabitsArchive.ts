import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';
import { optimisticStore } from '../../../lib/optimistic';
import { showGenericError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export interface UseHabitsArchiveResult {
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
}

export function useHabitsArchive(habits: Habit[]): UseHabitsArchiveResult {
  const archiveHabitMutation = useMutation(api.habits.archive);

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      const habit = habits.find((h) => h._id === habitId);
      const habitName = habit?.name ?? 'Habit';

      // Apply optimistic update immediately
      const operationId = optimisticStore.addArchive({
        habitId,
        habitName,
        toArchived: true,
      });

      try {
        await archiveHabitMutation({ habitId });
        optimisticStore.confirm(operationId);
        logInteraction('habit_archived', { habitId, habitName });
      } catch (error) {
        // Rollback on failure
        optimisticStore.fail(operationId, error as Error);
        if (__DEV__) console.error('[useHabitsArchive] Archive failed:', error);
        showGenericError(ERROR_MESSAGES.DATA_OPS.ARCHIVE_HABIT_FAILED);
      }
    },
    [archiveHabitMutation, habits]
  );

  return {
    handleArchive,
  };
}
