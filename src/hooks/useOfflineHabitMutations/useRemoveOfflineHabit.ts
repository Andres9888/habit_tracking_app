import { useCallback } from 'react';
import { getOfflineQueueManager, isNetworkError } from '../../lib/offline';
import type { HabitId, MutationResult } from './types';

type RemoveHabitMutation = (args: { habitId: HabitId }) => Promise<unknown>;

function enqueueRemoveHabit(habitId: HabitId): MutationResult {
  const queueResult = getOfflineQueueManager().enqueue('removeHabit', {
    habitId,
  });
  return {
    queued: queueResult.success,
    offlineOperationId: queueResult.operationId,
  };
}

export function useRemoveOfflineHabit(
  isOnline: boolean,
  removeHabitMutation: RemoveHabitMutation
) {
  return useCallback(
    async (habitId: HabitId): Promise<MutationResult> => {
      if (!isOnline) return enqueueRemoveHabit(habitId);

      try {
        const result = await removeHabitMutation({ habitId });
        return { queued: false, result };
      } catch (error) {
        if (isNetworkError(error)) return enqueueRemoveHabit(habitId);
        throw error;
      }
    },
    [isOnline, removeHabitMutation]
  );
}
