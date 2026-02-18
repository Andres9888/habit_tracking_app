/**
 * Offline State Helpers
 *
 * Helper functions for useOfflineHabitState hook.
 * @see docs/offline-habit-sync.md T013
 */

import type {
  OfflineOperation,
  PendingToggleOperation,
  ToggleCompletionOperation,
} from '../../../lib/offline';

/**
 * Filter operations for a specific habit
 * Returns only toggleCompletion operations that are pending or syncing
 */
export function filterPendingForHabit(
  operations: OfflineOperation[],
  habitId: string
): ToggleCompletionOperation[] {
  return operations
    .filter(
      (op): op is ToggleCompletionOperation => op.type === 'toggleCompletion'
    )
    .filter(
      (op) =>
        op.payload.habitId === habitId &&
        (op.status === 'pending' || op.status === 'syncing')
    );
}

/**
 * Convert offline operations to PendingToggleOperation format
 * Assumes all operations are toggleCompletion operations
 */
export function toPendingToggleOps(
  operations: ToggleCompletionOperation[]
): PendingToggleOperation[] {
  return operations.map((op) => ({
    date: op.payload.date,
    toCompleted: op.payload.toCompleted,
  }));
}

/**
 * Get completion status for today from pending operations
 */
export function getCompletionFromPending(
  pendingOps: PendingToggleOperation[],
  todayDate: string,
  serverCompleted: boolean
): boolean {
  const todayPending = pendingOps.find((op) => op.date === todayDate);
  return todayPending === undefined
    ? serverCompleted
    : todayPending.toCompleted;
}
