/**
 * Reconciliation Module
 *
 * Handles state reconciliation after offline sync operations complete.
 * Implements FR-008: Reconcile local calculations with server-authoritative values.
 *
 * Key features:
 * - Tracks which habits were successfully synced
 * - Emits events for UI updates
 * - Provides React hook for component integration
 */

// Core reconciler
export {
  DEFAULT_RECONCILIATION_CONFIG,
  StateReconciler,
  createInitialState,
} from './reconciler';

// Singleton
export { getStateReconciler, resetStateReconciler } from './singleton';

// React hook
export { useReconciliation } from './useReconciliation';
export type {
  UseReconciliationOptions,
  UseReconciliationReturn,
} from './useReconciliation.types';

// Helpers
export {
  buildReconciliationResult,
  buildSyncedHabits,
  createEmptyReconciliationResult,
  extractSyncedDates,
  extractSyncedHabits,
  groupOperationsByHabit,
  updateHabitSyncTimestamps,
  wasHabitSyncedAfter,
} from './helpers';

// Execute reconcile
export {
  emitEvent,
  emitHabitSyncedEvents,
  executeReconcile,
} from './executeReconcile';

// Types
export type {
  ExtractSyncedHabitsInput,
  ProcessedOperation,
  ReconciliationCallback,
  ReconciliationConfig,
  ReconciliationEvent,
  ReconciliationEventListener,
  ReconciliationEventType,
  ReconciliationResult,
  ReconciliationState,
  SyncedHabit,
} from './types';
