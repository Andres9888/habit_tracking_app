/**
 * Optimistic Toggle Mutation Hook with Offline Queue Support
 *
 * Provides immediate UI feedback through the optimistic store,
 * with offline queue integration for resilient habit tracking.
 *
 * @see docs/offline-habit-sync.md T010
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { optimisticStore } from '../store';
import type { ToggleOperationPayload } from '../types';
import { isNetworkError } from '../../offline/errorClassifier';
import { getOfflineQueueManager } from '../../offline/queueManager';

export interface OptimisticToggleOptions {
  /** Whether the app is currently online (pass from useIsOnline) */
  isOnline: boolean;
}

export interface ToggleMutationResult {
  /** Whether operation was queued for offline sync */
  queued: boolean;
  /** ID of offline queue operation (if queued) */
  offlineOperationId?: string;
}

/**
 * Creates an optimistic toggle mutation wrapper with offline queue support
 *
 * Flow:
 * 1. Always add to optimistic store (immediate UI feedback)
 * 2. If online: try server mutation
 *    - Success: confirm optimistic store
 *    - Network error: queue for offline sync, keep optimistic state
 * 3. If offline: queue immediately, keep optimistic state
 *
 * @see docs/offline-habit-sync.md US1 - Complete Habits While Offline
 */
export function useOptimisticToggleMutation(
  serverMutation: (args: {
    habitId: Id<'habits'>;
    date: string;
  }) => Promise<unknown>,
  getCurrentStatus: (habitId: Id<'habits'>, date: string) => boolean,
  options?: OptimisticToggleOptions
) {
  const isOnline = options?.isOnline ?? true;

  return useCallback(
    async (args: {
      habitId: Id<'habits'>;
      date: string;
    }): Promise<ToggleMutationResult> => {
      const currentlyCompleted = getCurrentStatus(args.habitId, args.date);
      const toCompleted = !currentlyCompleted;

      const payload: ToggleOperationPayload = {
        date: args.date,
        habitId: args.habitId,
        toCompleted,
      };

      // If offline, queue immediately without attempting server call
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

      // Online path still applies the optimistic update before awaiting network.
      const operationId = optimisticStore.addToggle(payload);

      // Online path: try server mutation
      try {
        await serverMutation(args);
        optimisticStore.confirm(operationId);
        return { queued: false };
      } catch (error) {
        // Check if this is a network error (device went offline during request)
        if (isNetworkError(error)) {
          // Queue for offline sync, keep optimistic state active
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

        // Non-network error: fail the optimistic update and propagate error
        optimisticStore.fail(operationId, error as Error);
        throw error;
      }
    },
    [serverMutation, getCurrentStatus, isOnline]
  );
}
