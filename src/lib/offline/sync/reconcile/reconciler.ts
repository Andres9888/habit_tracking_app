/**
 * Reconciler
 *
 * Main reconciliation class for syncing local state with server values.
 * Implements FR-008: Reconcile local with server-authoritative values.
 */

import type {
  ProcessedOperation,
  ReconciliationConfig,
  ReconciliationEventListener,
  ReconciliationResult,
  ReconciliationState,
} from './types';
import { createEmptyReconciliationResult } from './helpers';
import { executeReconcile } from './executeReconcile';

/** Default reconciliation configuration */
export const DEFAULT_RECONCILIATION_CONFIG: Required<ReconciliationConfig> = {
  autoReconcile: true,
  onReconciled: () => {},
  reconcileDelayMs: 100,
};

/** Create initial reconciliation state */
export function createInitialState(): ReconciliationState {
  return {
    habitSyncTimestamps: new Map(),
    isReconciling: false,
    lastResult: undefined,
    pendingRefreshCount: 0,
  };
}

/**
 * StateReconciler class - Manages reconciliation of local state with server.
 */
export class StateReconciler {
  private state: ReconciliationState;
  private config: Required<ReconciliationConfig>;
  private listeners: Set<ReconciliationEventListener>;
  private reconcileTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(config: ReconciliationConfig = {}) {
    this.config = { ...DEFAULT_RECONCILIATION_CONFIG, ...config };
    this.state = createInitialState();
    this.listeners = new Set();
  }

  getState(): ReconciliationState {
    return { ...this.state };
  }

  subscribe(listener: ReconciliationEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  reconcile(operations: ProcessedOperation[]): ReconciliationResult {
    if (this.state.isReconciling) {
      if (__DEV__) console.warn('Reconciliation already in progress, skipping');
      return createEmptyReconciliationResult();
    }
    return executeReconcile(
      operations,
      this.state,
      this.listeners,
      this.config.onReconciled
    );
  }

  scheduleReconcile(operations: ProcessedOperation[]): void {
    if (!this.config.autoReconcile) return;
    this.cancelScheduledReconcile();
    this.reconcileTimeout = setTimeout(() => {
      this.reconcile(operations);
      this.reconcileTimeout = null;
    }, this.config.reconcileDelayMs);
  }

  cancelScheduledReconcile(): void {
    if (this.reconcileTimeout) {
      clearTimeout(this.reconcileTimeout);
      this.reconcileTimeout = null;
    }
  }

  isHabitSynced(habitId: string): boolean {
    return this.state.habitSyncTimestamps.has(habitId);
  }

  getHabitSyncTimestamp(habitId: string): number | undefined {
    return this.state.habitSyncTimestamps.get(habitId);
  }

  clearSyncTimestamps(): void {
    this.state.habitSyncTimestamps.clear();
  }

  reset(): void {
    this.cancelScheduledReconcile();
    this.state = createInitialState();
    this.listeners.clear();
  }
}
