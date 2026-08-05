/**
 * Sync Orchestrator Types
 *
 * Types for coordinating offline queue sync with network status detection
 * and automatic background synchronization.
 */

import type { OfflineOperation, ToggleCompletionPayload } from '../queue';

/**
 * Result of a sync orchestration cycle
 */
export interface SyncOrchestratorResult {
  /** Whether the sync was initiated (false if offline or empty queue) */
  initiated: boolean;
  /** Number of operations processed */
  processed: number;
  /** Number of operations successfully synced */
  succeeded: number;
  /** Number of operations that failed permanently */
  failed: number;
  /** Number of operations skipped (circuit breaker open) */
  skipped: number;
  /** Error if sync failed to start */
  error?: Error;
}

/**
 * Configuration for the sync orchestrator
 */
export interface SyncOrchestratorConfig {
  /** Maximum operations to process per sync cycle (default: 50) */
  batchSize?: number;
  /** Whether to auto-start syncing when online detected (default: true) */
  autoSyncOnOnline?: boolean;
  /** Debounce time before starting sync after online (ms, default: 1000) */
  syncDebounceMs?: number;
  /** Minimum time between sync cycles (ms, default: 5000) */
  minSyncIntervalMs?: number;
}

/**
 * Sync orchestrator state
 */
export interface SyncOrchestratorState {
  /** Whether sync is currently running */
  isSyncing: boolean;
  /** Whether orchestrator is initialized and listening */
  isActive: boolean;
  /** Last sync result, if any */
  lastResult?: SyncOrchestratorResult;
  /** Timestamp of last sync attempt */
  lastSyncAttemptAt?: number;
  /** Timestamp of last successful sync */
  lastSuccessfulSyncAt?: number;
}

/**
 * Sync orchestrator event types
 */
export type SyncOrchestratorEventType =
  | 'orchestrator:start'
  | 'orchestrator:stop'
  | 'sync:scheduled'
  | 'sync:started'
  | 'sync:completed'
  | 'sync:cancelled'
  | 'sync:error';

/**
 * Sync orchestrator event payload
 */
export interface SyncOrchestratorEvent {
  type: SyncOrchestratorEventType;
  timestamp: number;
  data?: {
    result?: SyncOrchestratorResult;
    reason?: string;
    error?: Error;
  };
}

/**
 * Event listener for orchestrator events
 */
export type SyncOrchestratorEventListener = (
  event: SyncOrchestratorEvent
) => void;

/**
 * Progress callback for sync operations
 */
export type SyncProgressCallback = (processed: number, total: number) => void;

/**
 * Executor function for syncing a toggle completion operation
 */
export type ToggleSyncExecutor = (
  payload: ToggleCompletionPayload
) => Promise<void>;

/**
 * Generic executor function for syncing any operation type
 */
export type SyncExecutor = (
  operation: OfflineOperation
) => Promise<void>;

/**
 * Factory for creating sync executors with Convex mutations
 */
export interface SyncExecutorFactory {
  createToggleExecutor: (mutation: ToggleSyncExecutor) => ToggleSyncExecutor;
}

// Re-export for convenience

export { type OfflineOperation, type ToggleCompletionPayload } from '../queue';
export { type SyncEvent, type SyncStatus } from '../types';
export { type BatchResult, type SyncItem } from '../syncManager';
