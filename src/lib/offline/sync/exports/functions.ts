/**
 * Sync Module Function Exports
 */

// Core orchestrator
export { SyncOrchestrator } from '../SyncOrchestrator';
export { getSyncOrchestrator, resetSyncOrchestrator } from '../singleton';

// React hook
export {
  useSyncOrchestrator,
  type UseSyncOrchestratorOptions,
  type UseSyncOrchestratorReturn,
} from '../useSyncOrchestrator';

// Helpers
export {
  DEFAULT_ORCHESTRATOR_CONFIG,
  filterPendingOperations,
  getOperationsForSync,
  shouldSkipSync,
} from '../helpers';

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
} from '../retryStrategy';

// Queue Processing (FR-005: FIFO processing)
export {
  DEFAULT_BATCH_SIZE,
  operationToSyncItem as operationToSyncItemForQueue,
  processQueue,
  processQueueUntilEmpty,
  processSingleOperation,
  shouldSkipOperation,
} from '../processQueue';

// State Reconciliation (FR-008: Reconcile local with server values)
export {
  DEFAULT_RECONCILIATION_CONFIG,
  getStateReconciler,
  resetStateReconciler,
  StateReconciler,
  useReconciliation,
} from '../reconcile';

// Reconciliation Helpers
export {
  buildReconciliationResult,
  createEmptyReconciliationResult,
  extractSyncedHabits,
  updateHabitSyncTimestamps,
  wasHabitSyncedAfter,
} from '../reconcile';

// Orphan Cleanup (Edge Case: Deleted habit on server)
export {
  cleanupOrphans,
  createOrphanCleaner,
  DEFAULT_CLEANUP_BATCH_SIZE,
} from '../cleanupOrphans';

// Orphan Cleanup Helpers
export {
  buildCleanupResult,
  createCleanupEvent,
  createEmptyCleanupResult,
  createOrphanedOperation,
  extractUniqueHabitIds,
  findDeletedHabitIds,
  groupOperationsByHabit as groupOperationsByHabitForCleanup,
  identifyOrphans,
} from '../cleanupOrphans';

// Conflict Resolution (US4: Graceful Conflict Resolution, FR-010: completion wins)
export {
  DEFAULT_CONFLICT_RESOLVER_CONFIG,
  resolveOperation,
  resolveOperations,
  resolveOperationsBatch,
} from '../conflictResolver';

// Conflict Resolution Helpers
export {
  buildBatchResult as buildConflictBatchResult,
  buildResolutionResult,
  createConflictEvent,
  createEmptyBatchResult as createEmptyConflictBatchResult,
  createHabitDateKey,
  detectConflict,
  parseHabitDateKey,
  resolveConflict,
} from '../conflictResolver';

// Auth Handler (Edge Case: Auth expiry while offline)
export {
  createAuthHandler,
  DEFAULT_AUTH_CONFIG,
  getAuthHandler,
  hasAuthHandler,
  resetAuthHandler,
  useAuthHandler,
  type AuthHandlerAPI,
} from '../authHandler';

// Auth Handler Helpers
export {
  createAuthEvent,
  createInitialState as createInitialAuthState,
  getAuthDisplayMessage,
  getSuggestedAction,
  isAuthError,
  isTokenExpiredError,
  requiresUserAction,
  shouldPauseSync,
} from '../authHandler';
