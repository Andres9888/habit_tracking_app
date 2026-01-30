/**
 * Sync Module Type Exports
 */

// Main sync types
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
} from '../types';

// Process Queue Types
export type {
  ProcessOperationResult,
  ProcessQueueConfig,
  ProcessQueueResult,
  ProcessingContext,
  ProcessSingleOptions,
  QueueProcessorDeps,
  QueueProgressCallback,
} from '../processQueue';

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
} from '../reconcile';

// Orphan Cleanup Types
export type {
  BatchHabitExistsChecker,
  CleanupOrphansConfig,
  CleanupOrphansDeps,
  CleanupOrphansEvent,
  CleanupOrphansEventListener,
  CleanupOrphansEventType,
  CleanupOrphansResult,
  HabitExistsChecker,
  HabitExistsResult,
  OrphanedOperation,
} from '../cleanupOrphans';
