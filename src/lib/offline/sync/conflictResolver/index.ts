/**
 * Conflict Resolver Module
 *
 * Provides conflict detection and resolution for offline sync operations.
 *
 * Features:
 * - US4: Graceful Conflict Resolution
 * - FR-010: Completion wins strategy (favor "completed" over "not completed")
 * - Server state checking before sync
 * - Batch resolution for efficiency
 * - Event emission for conflict monitoring
 *
 * @example
 * ```ts
 * import { resolveOperation, resolveOperations } from './conflictResolver';
 *
 * // Single operation
 * const result = await resolveOperation(operation, checkServerState);
 * if (result.resolution === 'sync') {
 *   await performSync(operation);
 * }
 *
 * // Batch operations
 * const batchResult = await resolveOperations(operations, batchChecker);
 * const toSync = batchResult.results.filter(r => r.resolution === 'sync');
 * ```
 */

// Types
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
} from './types';

// Helpers
export {
  buildBatchResult,
  buildResolutionResult,
  createConflictEvent,
  createEmptyBatchResult,
  createHabitDateKey,
  detectConflict,
  parseHabitDateKey,
  resolveConflict,
} from './helpers';

// Main functions
export {
  DEFAULT_CONFLICT_RESOLVER_CONFIG,
  resolveOperation,
  resolveOperations,
  resolveOperationsBatch,
} from './conflictResolver';
