/**
 * Hook for optimistic drag-end handling
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSortMode } from '../types';
import { optimisticStore } from '../../../lib/optimistic';
import { showGenericError } from '../../../utils/errorAlerts';
import { ERROR_MESSAGES } from '../../../constants/errorMessages';

type ReorderMutation = (args: { habitIds: Id<'habits'>[] }) => Promise<unknown>;

export function useOptimisticDragEnd(
  habitSortMode: HabitSortMode,
  habits: Habit[],
  reorderHabits: ReorderMutation
) {
  return useCallback(
    async ({ data }: { data: Habit[] }) => {
      if (habitSortMode !== 'manual') return;

      const newOrder = data.map((h) => h._id);
      const previousOrder = habits.map((h) => h._id);

      // Apply optimistic reorder immediately for smooth drag UX
      const operationId = optimisticStore.addReorder({
        habitIds: newOrder,
        previousOrder,
      });

      try {
        await reorderHabits({ habitIds: newOrder });
        optimisticStore.confirm(operationId);
      } catch (error) {
        optimisticStore.fail(operationId, error as Error);
        if (__DEV__) console.error('Failed to reorder habits:', error);
        showGenericError(ERROR_MESSAGES.DATA_OPS.REORDER_HABITS_FAILED);
      }
    },
    [habitSortMode, reorderHabits, habits]
  );
}
