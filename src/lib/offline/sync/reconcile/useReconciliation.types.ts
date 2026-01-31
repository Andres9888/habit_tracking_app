/**
 * useReconciliation Hook Types
 */

import type {
  ProcessedOperation,
  ReconciliationConfig,
  ReconciliationResult,
  ReconciliationState,
} from './types';

/**
 * Options for the useReconciliation hook
 */
export interface UseReconciliationOptions {
  /** Configuration for the reconciler */
  config?: ReconciliationConfig;
  /** Callback when reconciliation completes */
  onReconciled?: (result: ReconciliationResult) => void;
  /** Callback when a habit is synced */
  onHabitSynced?: (habitId: string, syncedDates: string[]) => void;
}

/**
 * Return type for useReconciliation hook
 */
export interface UseReconciliationReturn {
  /** Current reconciliation state */
  state: ReconciliationState;
  /** Whether reconciliation is in progress */
  isReconciling: boolean;
  /** Last reconciliation result */
  lastResult?: ReconciliationResult;
  /** Manually trigger reconciliation */
  reconcile: (operations: ProcessedOperation[]) => ReconciliationResult;
  /** Schedule reconciliation with delay */
  scheduleReconcile: (operations: ProcessedOperation[]) => void;
  /** Check if a habit has been synced */
  isHabitSynced: (habitId: string) => boolean;
  /** Get habit sync timestamp */
  getHabitSyncTimestamp: (habitId: string) => number | undefined;
  /** Clear all sync timestamps */
  clearSyncTimestamps: () => void;
}
