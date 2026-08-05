/**
 * Optimistic reorder and pause mutation hooks
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import { optimisticStore } from '../store';
import type { ReorderOperationPayload, PauseOperationPayload } from '../types';

/**
 * Creates an optimistic reorder mutation wrapper
 */
export function useOptimisticReorderMutation(
  serverMutation: (args: { habitIds: Id<'habits'>[] }) => Promise<void>,
  getCurrentOrder: () => Id<'habits'>[]
) {
  return useCallback(
    async (newOrder: Id<'habits'>[]) => {
      const previousOrder = getCurrentOrder();

      const payload: ReorderOperationPayload = {
        habitIds: newOrder,
        previousOrder,
      };

      const operationId = optimisticStore.addReorder(payload);

      try {
        await serverMutation({ habitIds: newOrder });
        optimisticStore.confirm(operationId);
      } catch (error) {
        optimisticStore.fail(operationId, error as Error);
        throw error;
      }
    },
    [serverMutation, getCurrentOrder]
  );
}

/**
 * Creates an optimistic pause mutation wrapper
 */
export function useOptimisticPauseMutation(
  serverMutation: (args: {
    habitId: Id<'habits'>;
    paused: boolean;
  }) => Promise<void>
) {
  return useCallback(
    async (habitId: Id<'habits'>, toPaused: boolean) => {
      const payload: PauseOperationPayload = {
        habitId,
        toPaused,
      };

      const operationId = optimisticStore.addPause(payload);

      try {
        await serverMutation({ habitId, paused: toPaused });
        optimisticStore.confirm(operationId);
      } catch (error) {
        optimisticStore.fail(operationId, error as Error);
        throw error;
      }
    },
    [serverMutation]
  );
}
