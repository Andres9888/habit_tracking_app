/**
 * Hook for optimistic drag-end handling
 */

import { useCallback } from 'react';
import type { Id } from '../../../../convex/_generated/dataModel';
import type { Habit, HabitSortMode } from '../types';
import { optimisticStore } from '../../../lib/optimistic';

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
      }
    },
    [habitSortMode, reorderHabits, habits]
  );
}
