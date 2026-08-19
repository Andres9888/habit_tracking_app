/**
 * Optimistic Toggle Mutation Hook with Offline Queue Support
 *
 * @see docs/offline-habit-sync.md T010
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { optimisticStore } from '../store';
import type { ToggleOperationPayload } from '../types';
import { getOfflineQueueManager, isNetworkError } from '../../offline';
import { resolveToggleTarget } from '../resolveToggleTarget';

export interface OptimisticToggleOptions {
  isOnline: boolean;
}

export interface ToggleMutationResult {
  queued: boolean;
  offlineOperationId?: string;
}

export interface ToggleMutationArgs {
  completed?: boolean;
  date: string;
  habitId: Id<'habits'>;
}

export function useOptimisticToggleMutation(
  serverMutation: (args: ToggleMutationArgs) => Promise<unknown>,
  getCurrentStatus: (habitId: Id<'habits'>, date: string) => boolean,
  options?: OptimisticToggleOptions
) {
  const isOnline = options?.isOnline ?? true;

  return useCallback(
    async (args: ToggleMutationArgs): Promise<ToggleMutationResult> => {
      const toCompleted = resolveToggleTarget(args, getCurrentStatus);
      const payload: ToggleOperationPayload = {
        date: args.date,
        habitId: args.habitId,
        toCompleted,
      };
      const mutationArgs = {
        completed: toCompleted,
        date: args.date,
        habitId: args.habitId,
      };

      if (!isOnline) {
        const queueResult = getOfflineQueueManager().enqueue(
          'toggleCompletion',
          payload
        );
        if (queueResult.success && queueResult.operationId) {
          optimisticStore.addToggleWithId(queueResult.operationId, payload);
        } else {
          optimisticStore.addToggle(payload);
        }
        return {
          offlineOperationId: queueResult.operationId,
          queued: queueResult.success,
        };
      }

      const operationId = optimisticStore.addToggle(payload);

      try {
        await serverMutation(mutationArgs);
        optimisticStore.confirm(operationId);
        return { queued: false };
      } catch (error) {
        if (isNetworkError(error)) {
          const queueResult = getOfflineQueueManager().enqueue(
            'toggleCompletion',
            payload
          );
          if (queueResult.success && queueResult.operationId) {
            optimisticStore.replaceOperationId(
              operationId,
              queueResult.operationId
            );
          }
          return {
            offlineOperationId: queueResult.operationId,
            queued: queueResult.success,
          };
        }

        optimisticStore.fail(operationId, error as Error);
        throw error;
      }
    },
    [serverMutation, getCurrentStatus, isOnline]
  );
}
