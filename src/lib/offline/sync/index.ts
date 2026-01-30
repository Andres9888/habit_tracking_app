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
