/**
 * useSyncOrchestrator Types
 */

import type {
  SyncOrchestratorConfig,
  SyncOrchestratorEvent,
  SyncOrchestratorResult,
  SyncOrchestratorState,
  SyncProgressCallback,
} from './types';

export interface UseSyncOrchestratorOptions {
  /** Configuration for the orchestrator */
  config?: SyncOrchestratorConfig;
  /** Whether to auto-start the orchestrator (default: true) */
  autoStart?: boolean;
  /** Callback when sync completes */
  onSyncComplete?: (result: SyncOrchestratorResult) => void;
  /** Callback when sync errors */
  onSyncError?: (error: Error) => void;
}

export interface UseSyncOrchestratorReturn {
  /** Current orchestrator state */
  state: SyncOrchestratorState;
  /** Whether the device is online */
  isOnline: boolean;
  /** Whether there are pending operations to sync */
  hasPendingOperations: boolean;
  /** Number of pending operations */
  pendingOperationCount: number;
  /** Number of operations that failed permanently (max retries exhausted) */
  failedOperationCount: number;
  /** Manually trigger a sync */
  triggerSync: (
    onProgress?: SyncProgressCallback
  ) => Promise<SyncOrchestratorResult>;
  /** Start the orchestrator */
  start: () => void;
  /** Stop the orchestrator */
  stop: () => void;
  /** Subscribe to orchestrator events */
  subscribe: (listener: (event: SyncOrchestratorEvent) => void) => () => void;
}
