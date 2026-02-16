/**
 * Offline State Helpers
 *
 * Helper functions for useOfflineHabitState hook.
 * @see docs/offline-habit-sync.md T013
 */

import type {
  OfflineOperation,
} from '../../../lib/offline/queue';

/**
 * Pending toggle operation for UI display
 */
export interface PendingToggleOperation {
  date: string;
  toCompleted: boolean;
}

/**
 * Filter operations for a specific habit
 */
export function filterPendingForHabit(
  operations: OfflineOperation[],
  habitId: string
): OfflineOperation<'toggleCompletion'>[] {
  return operations.filter(
    (op): op is OfflineOperation<'toggleCompletion'> =>
      op.type === 'toggleCompletion' &&
      (op.status === 'pending' || op.status === 'syncing')
  ).filter(op => op.payload.habitId === habitId);
}

/**
 * Convert offline operations to PendingToggleOperation format
 */
export function toPendingToggleOps(
  operations: OfflineOperation<'toggleCompletion'>[]
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
