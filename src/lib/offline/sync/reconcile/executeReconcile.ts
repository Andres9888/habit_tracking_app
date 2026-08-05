/**
 * Execute Reconcile
 *
 * Core reconciliation execution logic extracted for file size compliance.
 */

import type {
  ProcessedOperation,
  ReconciliationEvent,
  ReconciliationResult,
  ReconciliationState,
  SyncedHabit,
} from './types';
import {
  buildReconciliationResult,
  createEmptyReconciliationResult,
  extractSyncedHabits,
  updateHabitSyncTimestamps,
} from './helpers';

/**
 * Emit an event to all listeners safely
 */
export function emitEvent(
  listeners: Set<(event: ReconciliationEvent) => void>,
  event: ReconciliationEvent
): void {
  for (const listener of listeners) {
    try {
      listener(event);
    } catch (error) {
      if (__DEV__) console.error('Error in reconciliation listener:', error);
    }
  }
}

/**
 * Emit per-habit synced events
 */
export function emitHabitSyncedEvents(
  listeners: Set<(event: ReconciliationEvent) => void>,
  syncedHabits: SyncedHabit[]
): void {
  for (const habit of syncedHabits) {
    emitEvent(listeners, {
      data: { habit },
      timestamp: Date.now(),
      type: 'reconcile:habit_synced',
    });
  }
}

/**
 * Execute the reconciliation process
 */
export function executeReconcile(
  operations: ProcessedOperation[],
  state: ReconciliationState,
  listeners: Set<(event: ReconciliationEvent) => void>,
  onReconciled: (result: ReconciliationResult) => void
): ReconciliationResult {
  const startTime = Date.now();
  state.isReconciling = true;
  emitEvent(listeners, { timestamp: startTime, type: 'reconcile:started' });

  try {
    const syncedHabits = extractSyncedHabits(operations);

    // Update sync timestamps for affected habits
    state.habitSyncTimestamps = updateHabitSyncTimestamps(
      state.habitSyncTimestamps,
      syncedHabits
    );

    // Emit per-habit events
    emitHabitSyncedEvents(listeners, syncedHabits);

    const result = buildReconciliationResult(syncedHabits, startTime);
    state.lastResult = result;
    state.isReconciling = false;

    emitEvent(listeners, {
      data: { result },
      timestamp: Date.now(),
      type: 'reconcile:completed',
    });

    onReconciled(result);

    return result;
  } catch (error) {
    state.isReconciling = false;
    emitEvent(listeners, {
      data: {
        error: error instanceof Error ? error : new Error(String(error)),
      },
      timestamp: Date.now(),
      type: 'reconcile:error',
    });
    return createEmptyReconciliationResult();
  }
}
