/**
 * Sync Module
 *
 * Orchestrates offline queue synchronization with network detection.
 */

// Core orchestrator
export { SyncOrchestrator } from './SyncOrchestrator';
export { getSyncOrchestrator, resetSyncOrchestrator } from './singleton';

// React hook
export {
  useSyncOrchestrator,
  type UseSyncOrchestratorOptions,
  type UseSyncOrchestratorReturn,
} from './useSyncOrchestrator';

// Helpers
export {
  DEFAULT_ORCHESTRATOR_CONFIG,
  filterPendingOperations,
  getOperationsForSync,
  operationsToSyncItems,
  operationToSyncItem,
  shouldSkipSync,
} from './helpers';

// Retry Strategy (FR-006: Exponential backoff)
export {
  calculateSyncRetryDelay,
  createSyncRetryContext,
  FAST_SYNC_RETRY_STRATEGY,
  getTimeUntilSyncRetry,
  RATE_LIMITED_RETRY_STRATEGY,
  selectSyncRetryStrategy,
  shouldRetrySyncOperation,
  SYNC_RETRY_STRATEGY,
  updateSyncRetryContext,
} from './retryStrategy';

// Queue Processing (FR-005: FIFO processing)
export {
  DEFAULT_BATCH_SIZE,
  operationToSyncItem as operationToSyncItemForQueue,
  processQueue,
  processQueueUntilEmpty,
  processSingleOperation,
  shouldSkipOperation,
} from './processQueue';

// Types
export type {
  BatchResult,
  OfflineOperation,
  SyncEvent,
  SyncExecutorFactory,
  SyncItem,
  SyncOrchestratorConfig,
  SyncOrchestratorEvent,
  SyncOrchestratorEventListener,
  SyncOrchestratorEventType,
  SyncOrchestratorResult,
  SyncOrchestratorState,
  SyncProgressCallback,
  SyncStatus,
  ToggleCompletionPayload,
  ToggleSyncExecutor,
} from './types';

// Process Queue Types
export type {
  ProcessOperationResult,
  ProcessQueueConfig,
  ProcessQueueResult,
  ProcessingContext,
  ProcessSingleOptions,
  QueueProcessorDeps,
  QueueProgressCallback,
} from './processQueue';

// State Reconciliation (FR-008: Reconcile local with server values)
export {
  DEFAULT_RECONCILIATION_CONFIG,
  getStateReconciler,
  resetStateReconciler,
  StateReconciler,
  useReconciliation,
} from './reconcile';

// Reconciliation Helpers
export {
  buildReconciliationResult,
  createEmptyReconciliationResult,
  extractSyncedHabits,
  updateHabitSyncTimestamps,
  wasHabitSyncedAfter,
} from './reconcile';

// Reconciliation Types
export type {
  ProcessedOperation,
  ReconciliationCallback,
  ReconciliationConfig,
  ReconciliationEvent,
  ReconciliationEventListener,
  ReconciliationEventType,
  ReconciliationResult,
  ReconciliationState,
  SyncedHabit,
  UseReconciliationOptions,
  UseReconciliationReturn,
} from './reconcile';
