/**
 * Hooks for reading optimistic state
 */

import type { Id } from '../../../../convex/_generated/dataModel';
import { useOptimisticStore } from './useOptimisticStore';

/**
 * Hook to check if there are pending optimistic operations
 */
export function useHasPendingOperations(): boolean {
  const store = useOptimisticStore();
  let hasPending = false;
  for (const op of store.operations.values()) {
    if (op.state === 'pending') {
      hasPending = true;
      break;
    }
  }
  return hasPending;
}

/**
 * Hook to get optimistic toggle state for a habit/date
 */
export function useOptimisticToggle(
  habitId: Id<'habits'>,
  date: string
): boolean | undefined {
  const store = useOptimisticStore();
  return store.pendingToggles.get(`${habitId}:${date}`);
}

/**
 * Hook to get optimistic archive state for a habit
 */
export function useOptimisticArchive(
  habitId: Id<'habits'>
): boolean | undefined {
  const store = useOptimisticStore();
  return store.pendingArchives.get(habitId);
}

/**
 * Hook to get optimistic pause state for a habit
 */
export function useOptimisticPause(habitId: Id<'habits'>): boolean | undefined {
  const store = useOptimisticStore();
  return store.pendingPauses.get(habitId);
}

/**
 * Hook to get optimistic habit order if reorder is pending
 */
export function useOptimisticReorder(): Id<'habits'>[] | null {
  const store = useOptimisticStore();
  return store.pendingReorder;
}
