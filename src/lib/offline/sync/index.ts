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
