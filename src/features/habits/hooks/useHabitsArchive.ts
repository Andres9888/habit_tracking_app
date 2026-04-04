import { useCallback } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';
import { optimisticStore } from '../../../lib/optimistic';
import { showGenericError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { getOfflineQueueManager, isNetworkError } from '../../../lib/offline';

export interface UseHabitsArchiveResult {
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
}

export function useHabitsArchive(habits: Habit[]): UseHabitsArchiveResult {
  const archiveHabitMutation = useMutation(api.habits.archive);
  const isOnline = useIsOnline();

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      const habit = habits.find((h) => h._id === habitId);
      const habitName = habit?.name ?? 'Habit';

      const operationId = optimisticStore.addArchive({
        habitId,
        habitName,
        toArchived: true,
      });

      if (!isOnline) {
        getOfflineQueueManager().enqueue('archiveHabit', { habitId });
        return;
      }

      try {
        await archiveHabitMutation({ habitId });
        optimisticStore.confirm(operationId);
        logInteraction('habit_archived', { habitId, habitName });
      } catch (error) {
        if (isNetworkError(error)) {
          getOfflineQueueManager().enqueue('archiveHabit', { habitId });
          return;
        }
        optimisticStore.fail(operationId, error as Error);
        if (__DEV__)
          console.error('[useHabitsArchive] Archive failed:', error);
        showGenericError(ERROR_MESSAGES.DATA_OPS.ARCHIVE_HABIT_FAILED);
      }
    },
    [archiveHabitMutation, habits, isOnline]
  );

  return { handleArchive };
}
