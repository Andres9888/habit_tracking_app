/**
 * Hook for optimistic drag-end handling
 *
 * Offline-capable: when offline (or when an online attempt fails with a
 * network error) the reorder is queued instead of erroring. Optimistic
 * temp IDs are filtered from the persisted order so a reorder referencing a
 * not-yet-synced created habit can't fail permanently server-side.
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSortMode } from '../types';
import { optimisticStore } from '../../../lib/optimistic';
import { getOfflineQueueManager, isNetworkError } from '../../../lib/offline';
import { useIsOnline } from '../../../contexts/NetworkStatusContext';
import { isOptimisticHabitId } from './optimisticHabitCreationStore';
import { showGenericError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

type ReorderMutation = (args: { habitIds: Id<'habits'>[] }) => Promise<unknown>;

function enqueueReorder(
  habitIds: Id<'habits'>[],
  previousOrder: Id<'habits'>[]
): void {
  const result = getOfflineQueueManager().enqueue('reorderHabits', {
    habitIds,
    previousOrder,
  });
  if (result.success && result.operationId) {
    optimisticStore.addReorderWithId(result.operationId, {
      habitIds,
      previousOrder,
    });
  }
}

export function useOptimisticDragEnd(
  habitSortMode: HabitSortMode,
  habits: Habit[],
  reorderHabits: ReorderMutation
) {
  const isOnline = useIsOnline();

  return useCallback(
    async ({ data }: { data: Habit[] }) => {
      if (habitSortMode !== 'manual') return;

      const previousOrder = habits.map((h) => h._id);
      const newOrder = data
        .map((h) => h._id)
        .filter((id) => !isOptimisticHabitId(id));

      if (!isOnline) {
        enqueueReorder(newOrder, previousOrder);
        return;
      }

      const operationId = optimisticStore.addReorder({
        habitIds: newOrder,
        previousOrder,
      });

      try {
        await reorderHabits({ habitIds: newOrder });
        optimisticStore.confirm(operationId);
      } catch (error) {
        optimisticStore.fail(operationId, error as Error);
        if (isNetworkError(error)) {
          enqueueReorder(newOrder, previousOrder);
          return;
        }
        if (__DEV__) console.error('Failed to reorder habits:', error);
        showGenericError(ERROR_MESSAGES.DATA_OPS.REORDER_HABITS_FAILED);
      }
    },
    [habitSortMode, reorderHabits, habits, isOnline]
  );
}
