/**
 * Optimistic Delete Mutation Hook with Offline Queue Support
 *
 * Provides immediate UI feedback for habit deletion
 * with offline queue fallback on network errors.
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { optimisticStore } from '../store';
import type { DeleteOperationPayload } from '../types';
import { getOfflineQueueManager, isNetworkError } from '../../offline';

export interface DeleteMutationResult {
  queued: boolean;
  offlineOperationId?: string;
}

export function useOptimisticDeleteMutation(
  serverMutation: (args: { habitId: Id<'habits'> }) => Promise<unknown>,
  options?: { isOnline: boolean }
) {
  const isOnline = options?.isOnline ?? true;

  return useCallback(
    async (
      habitId: Id<'habits'>,
      habitName: string
    ): Promise<DeleteMutationResult> => {
      const payload: DeleteOperationPayload = { habitId, habitName };
      const operationId = optimisticStore.addDelete(payload);

      if (!isOnline) {
        const queueResult = getOfflineQueueManager().enqueue('removeHabit', {
          habitId,
        });
        return {
          queued: queueResult.success,
          offlineOperationId: queueResult.operationId,
        };
      }

      try {
        await serverMutation({ habitId });
        optimisticStore.confirm(operationId);
        return { queued: false };
      } catch (error) {
        if (isNetworkError(error)) {
          const queueResult = getOfflineQueueManager().enqueue('removeHabit', {
            habitId,
          });
          return {
            queued: queueResult.success,
            offlineOperationId: queueResult.operationId,
          };
        }
        optimisticStore.fail(operationId, error as Error);
        throw error;
      }
    },
    [serverMutation, isOnline]
  );
}
