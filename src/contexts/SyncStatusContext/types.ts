/**
 * SyncStatusContext Types
 *
 * Type definitions for sync status context providing UI-friendly
 * access to offline sync state.
 */

import type { ReactNode } from 'react';
import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';

/**
 * Sync status indicator for UI display
 */
export type SyncStatusIndicator = 'idle' | 'syncing' | 'success' | 'error';

/**
 * Core sync status state
 */
export interface SyncStatus {
  /** Whether sync is currently running */
  isSyncing: boolean;
  /** Whether orchestrator is active */
  isActive: boolean;
  /** Number of pending operations in queue */
  pendingCount: number;
  /** Whether there are operations waiting to sync */
  hasPendingOperations: boolean;
  /** Number of operations that failed permanently */
  failedCount: number;
  /** Whether there are permanently-failed operations needing attention */
  hasFailedOperations: boolean;
  /** Current status indicator for UI */
  indicator: SyncStatusIndicator;
  /** Last sync result */
  lastResult?: SyncOrchestratorResult;
  /** Timestamp of last successful sync */
  lastSuccessfulSyncAt?: number;
  /** Error from last sync attempt */
  lastError?: Error;
}

/**
 * Context value interface
 */
export interface SyncStatusContextValue {
  /** Current sync status */
  status: SyncStatus;
  /** Manually trigger a sync */
  triggerSync: () => Promise<SyncOrchestratorResult>;
  /** Reset all failed operations to pending and re-trigger a sync */
  retryFailed: () => Promise<SyncOrchestratorResult | void>;
  /** Discard all failed operations, rolling back their optimistic state */
  discardFailed: () => void;
  /** Register callback for sync start */
  onSyncStart: (callback: () => void) => () => void;
  /** Register callback for sync completion */
  onSyncComplete: (
    callback: (result: SyncOrchestratorResult) => void
  ) => () => void;
  /** Register callback for sync error */
  onSyncError: (callback: (error: Error) => void) => () => void;
}

/**
 * Provider props
 */
export interface SyncStatusProviderProps {
  children: ReactNode;
  /** Whether to auto-start sync orchestrator (default: true) */
  autoStart?: boolean;
  /** Callback when sync status changes */
  onStatusChange?: (status: SyncStatus) => void;
}
