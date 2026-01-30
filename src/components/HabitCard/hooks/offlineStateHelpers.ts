/**
 * Offline State Helpers
 *
 * Helper functions for useOfflineHabitState hook.
 * @see docs/offline-habit-sync.md T013
 */

import type {
  OfflineOperation,
  PendingToggleOperation,
} from '../../../lib/offline';

/**
 * Filter operations for a specific habit
 */
export function filterPendingForHabit(
  operations: OfflineOperation[],
  habitId: string
): OfflineOperation[] {
  return operations.filter(
    (op) =>
      op.type === 'toggleCompletion' &&
      op.payload.habitId === habitId &&
      (op.status === 'pending' || op.status === 'syncing')
  );
}

/**
 * Convert offline operations to PendingToggleOperation format
 */
export function toPendingToggleOps(
  operations: OfflineOperation[]
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
