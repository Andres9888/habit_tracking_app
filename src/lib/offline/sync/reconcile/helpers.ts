/**
 * Reconciliation Helpers
 *
 * Helper functions for extracting and grouping synced habits.
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import type {
  ProcessedOperation,
  ReconciliationResult,
  SyncedHabit,
} from './types';

/**
 * Group successful operations by habit ID
 */
export function groupOperationsByHabit(
  operations: ProcessedOperation[]
): Map<string, ProcessedOperation[]> {
  const grouped = new Map<string, ProcessedOperation[]>();

  for (const op of operations) {
    if (!op.success) continue;
    const existing = grouped.get(op.habitId) || [];
    existing.push(op);
    grouped.set(op.habitId, existing);
  }

  return grouped;
}

/**
 * Extract unique synced dates from operations
 */
export function extractSyncedDates(operations: ProcessedOperation[]): string[] {
  const dates = new Set<string>();
  for (const op of operations) {
    dates.add(op.date);
  }
  return [...dates].sort();
}

/**
 * Build SyncedHabit objects from grouped operations
 */
export function buildSyncedHabits(
  groupedOps: Map<string, ProcessedOperation[]>,
  syncedAt: number
): SyncedHabit[] {
  const syncedHabits: SyncedHabit[] = [];

  for (const [habitId, ops] of groupedOps.entries()) {
    syncedHabits.push({
      habitId: habitId as Id<'habits'>,
      syncedAt,
      syncedDates: extractSyncedDates(ops),
    });
  }

  return syncedHabits;
}

/**
 * Extract synced habits from processed operations
 */
export function extractSyncedHabits(
  operations: ProcessedOperation[]
): SyncedHabit[] {
  const successfulOps = operations.filter((op) => op.success);
  if (successfulOps.length === 0) return [];

  const syncedAt = Date.now();
  const grouped = groupOperationsByHabit(successfulOps);

  return buildSyncedHabits(grouped, syncedAt);
}

/**
 * Create an empty reconciliation result
 */
export function createEmptyReconciliationResult(): ReconciliationResult {
  return {
    allReconciled: true,
    completedAt: Date.now(),
    durationMs: 0,
    reconciledHabits: [],
    totalReconciled: 0,
  };
}

/**
 * Build a reconciliation result from synced habits
 */
export function buildReconciliationResult(
  syncedHabits: SyncedHabit[],
  startTime: number
): ReconciliationResult {
  const completedAt = Date.now();

  return {
    allReconciled: true,
    completedAt,
    durationMs: completedAt - startTime,
    reconciledHabits: syncedHabits,
    totalReconciled: syncedHabits.reduce(
      (sum, h) => sum + h.syncedDates.length,
      0
    ),
  };
}

/**
 * Merge new synced habits with existing timestamp map
 */
export function updateHabitSyncTimestamps(
  existing: Map<string, number>,
  syncedHabits: SyncedHabit[]
): Map<string, number> {
  const updated = new Map(existing);

  for (const habit of syncedHabits) {
    const current = updated.get(habit.habitId) ?? 0;
    if (habit.syncedAt > current) {
      updated.set(habit.habitId, habit.syncedAt);
    }
  }

  return updated;
}

/**
 * Check if a habit has been synced after a given timestamp
 */
export function wasHabitSyncedAfter(
  habitSyncTimestamps: Map<string, number>,
  habitId: string,
  timestamp: number
): boolean {
  const syncedAt = habitSyncTimestamps.get(habitId);
  return syncedAt !== undefined && syncedAt > timestamp;
}
