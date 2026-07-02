import { useCallback } from 'react';
import { getOfflineQueueManager, isNetworkError } from '../../lib/offline';
import { buildUpdateHabitQueuePayload } from './buildUpdateHabitQueuePayload';
import type { MutationResult, UpdateHabitArgs } from './types';

type UpdateHabitMutation = (args: UpdateHabitArgs) => Promise<unknown>;

function enqueueUpdateHabit(args: UpdateHabitArgs): MutationResult {
  const queueResult = getOfflineQueueManager().enqueue(
    'updateHabit',
    buildUpdateHabitQueuePayload(args)
  );
  return {
    queued: queueResult.success,
    offlineOperationId: queueResult.operationId,
  };
}

export function useUpdateOfflineHabit(
  isOnline: boolean,
  updateHabitMutation: UpdateHabitMutation
) {
  return useCallback(
    async (args: UpdateHabitArgs): Promise<MutationResult> => {
      if (!isOnline) return enqueueUpdateHabit(args);

      try {
        const result = await updateHabitMutation(args);
        return { queued: false, result };
      } catch (error) {
        if (isNetworkError(error)) return enqueueUpdateHabit(args);
        throw error;
      }
    },
    [isOnline, updateHabitMutation]
  );
}
