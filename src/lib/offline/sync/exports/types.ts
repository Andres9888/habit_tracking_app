/**
 * Sync Module Type Exports
 */

// Main sync types
export type {
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

// Conflict Resolution Types (US4: Graceful Conflict Resolution)
export type {
  BatchCompletionStateChecker,
  BatchConflictResolutionResult,
  CompletionStateChecker,
  ConflictEvent,
  ConflictEventListener,
  ConflictEventType,
  ConflictResolution,
  ConflictResolutionResult,
  ConflictResolverConfig,
  ServerCompletionState,
} from '../conflictResolver';

// Auth Handler Types (Edge Case: Auth expiry while offline)
export type {
  AuthEvent,
  AuthEventData,
  AuthEventListener,
  AuthEventType,
  AuthHandlerConfig,
  AuthHandlerDeps,
  AuthHandlerState,
  AuthStatus,
  UseAuthHandlerOptions,
  UseAuthHandlerReturn,
} from '../authHandler';
