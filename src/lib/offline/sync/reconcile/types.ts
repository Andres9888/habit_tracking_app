/**
 * Reconciliation Types
 *
 * Types for state reconciliation after offline sync operations complete.
 * Implements FR-008: Reconcile local calculations with server-authoritative values.
 */

import type { Id } from '../../../../../convex/_generated/dataModel';
import type { ProcessQueueResult } from '../processQueue';

/**
 * A habit that was affected by a sync operation
 */
export interface SyncedHabit {
  /** Habit ID that was synced */
  habitId: Id<'habits'>;
  /** Dates that were synced for this habit */
  syncedDates: string[];
  /** Timestamp when sync completed */
  syncedAt: number;
}

/**
 * Result of a reconciliation cycle
 */
export interface ReconciliationResult {
  /** Habits that were successfully reconciled */
  reconciledHabits: SyncedHabit[];
  /** Total operations that were reconciled */
  totalReconciled: number;
  /** Whether all operations were successfully reconciled */
  allReconciled: boolean;
  /** Timestamp when reconciliation completed */
  completedAt: number;
  /** Duration of reconciliation in milliseconds */
  durationMs: number;
}

/**
 * Configuration for reconciliation
 */
export interface ReconciliationConfig {
  /** Whether to auto-reconcile after sync completes (default: true) */
  autoReconcile?: boolean;
  /** Delay after sync before reconciling (ms, default: 100) */
  reconcileDelayMs?: number;
  /** Callback when reconciliation completes */
  onReconciled?: ReconciliationCallback;
}

/**
 * Callback for reconciliation events
 */
export type ReconciliationCallback = (result: ReconciliationResult) => void;

/**
 * Event types for reconciliation
 */
export type ReconciliationEventType =
  | 'reconcile:started'
  | 'reconcile:completed'
  | 'reconcile:habit_synced'
  | 'reconcile:error';

/**
 * Event payload for reconciliation events
 */
export interface ReconciliationEvent {
  type: ReconciliationEventType;
  timestamp: number;
  data?: {
    result?: ReconciliationResult;
    habit?: SyncedHabit;
    error?: Error;
  };
}

/**
 * Listener for reconciliation events
 */
export type ReconciliationEventListener = (event: ReconciliationEvent) => void;

/**
 * State tracking for reconciliation
 */
export interface ReconciliationState {
  /** Whether reconciliation is in progress */
  isReconciling: boolean;
  /** Last reconciliation result */
  lastResult?: ReconciliationResult;
  /** Map of habit IDs to their most recent sync timestamp */
  habitSyncTimestamps: Map<string, number>;
  /** Number of pending habits awaiting server refresh */
  pendingRefreshCount: number;
}

/**
 * Input for extracting synced habits from process results
 */
export interface ExtractSyncedHabitsInput {
  /** Results from queue processing */
  processResult: ProcessQueueResult;
  /** Operations that were processed (for payload extraction) */
  operations: ProcessedOperation[];
}

/**
 * Simplified operation info needed for reconciliation
 */
export interface ProcessedOperation {
  /** Operation ID */
  id: string;
  /** Habit ID that was affected */
  habitId: Id<'habits'>;
  /** Date that was toggled */
  date: string;
  /** Whether the operation succeeded */
  success: boolean;
}
