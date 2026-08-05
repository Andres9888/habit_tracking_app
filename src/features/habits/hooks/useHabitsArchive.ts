import { useCallback, useRef } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit } from '../types';
import { logInteraction } from '../../../lib/analytics/interactions';
import { optimisticStore, runOfflineAwareMutation } from '../../../lib/optimistic';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { showGenericError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

export interface UseHabitsArchiveResult {
  handleArchive: (habitId: Id<'habits'>) => Promise<void>;
}

export function useHabitsArchive(habits: Habit[]): UseHabitsArchiveResult {
  const archiveHabitMutation = useMutation(api.habits.archive);
  const isOnline = useIsOnline();

  // Latest-ref: habits/isOnline get a new identity on every toggle; reading
  // them through a ref keeps handleArchive stable so memo'd habit cards don't
  // re-render.
  const depsRef = useRef({ habits, isOnline });
  depsRef.current = { habits, isOnline };

  const handleArchive = useCallback(
    async (habitId: Id<'habits'>) => {
      const { habits: currentHabits, isOnline: online } = depsRef.current;
      const habit = currentHabits.find((h) => h._id === habitId);
      const habitName = habit?.name ?? 'Habit';
      const payload = { habitId, habitName, toArchived: true as const };

      await runOfflineAwareMutation({
        addOptimistic: () => optimisticStore.addArchive(payload),
        addOptimisticWithId: (id) => optimisticStore.addArchiveWithId(id, payload),
        isOnline: online,
        onError: (error) => {
          if (__DEV__)
            console.error('[useHabitsArchive] Archive failed:', error);
          showGenericError(ERROR_MESSAGES.DATA_OPS.ARCHIVE_HABIT_FAILED);
        },
        queuePayload: { habitId, habitName },
        queueType: 'archiveHabit',
        serverMutation: () => archiveHabitMutation({ habitId }),
      });
      logInteraction('habit_archived', { habitId, habitName });
    },
    [archiveHabitMutation]
  );

  return {
    handleArchive,
  };
}
