import { useCallback } from 'react';
import { getOfflineQueueManager, isNetworkError } from '../../lib/offline';
import type { HabitId, MutationResult, NamedHabitOperationType } from './types';

type NamedHabitMutation = (args: { habitId: HabitId }) => Promise<unknown>;

function enqueueNamedHabitOperation(
  operationType: NamedHabitOperationType,
  habitId: HabitId,
  habitName: string
): MutationResult {
  const queueResult = getOfflineQueueManager().enqueue(operationType, {
    habitId,
    habitName,
  });
  return {
    queued: queueResult.success,
    offlineOperationId: queueResult.operationId,
  };
}

export function useNamedOfflineHabitMutation(
  isOnline: boolean,
  operationType: NamedHabitOperationType,
  mutation: NamedHabitMutation
) {
  return useCallback(
    async (habitId: HabitId, habitName = 'Habit'): Promise<MutationResult> => {
      if (!isOnline) {
        return enqueueNamedHabitOperation(operationType, habitId, habitName);
      }

      try {
        const result = await mutation({ habitId });
        return { queued: false, result };
      } catch (error) {
        if (isNetworkError(error)) {
          return enqueueNamedHabitOperation(operationType, habitId, habitName);
        }
        throw error;
      }
    },
    [isOnline, operationType, mutation]
  );
}
