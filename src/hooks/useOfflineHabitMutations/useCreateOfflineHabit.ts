import { useCallback } from 'react';
import { getOfflineQueueManager, isNetworkError } from '../../lib/offline';
import type { CreateHabitArgs, MutationResult } from './types';

type CreateHabitMutation = (args: CreateHabitArgs) => Promise<unknown>;

function enqueueCreateHabit(
  args: CreateHabitArgs,
  tempId: string
): MutationResult {
  const queueResult = getOfflineQueueManager().enqueue('createHabit', {
    ...args,
    tempId,
  });
  return {
    queued: queueResult.success,
    offlineOperationId: queueResult.operationId,
    tempId,
  };
}

export function useCreateOfflineHabit(
  isOnline: boolean,
  createHabitMutation: CreateHabitMutation
) {
  return useCallback(
    async (args: CreateHabitArgs): Promise<MutationResult> => {
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      if (!isOnline) return enqueueCreateHabit(args, tempId);

      try {
        const result = await createHabitMutation(args);
        return { queued: false, result };
      } catch (error) {
        if (isNetworkError(error)) return enqueueCreateHabit(args, tempId);
        throw error;
      }
    },
    [isOnline, createHabitMutation]
  );
}
