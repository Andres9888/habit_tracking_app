/**
 * useNetworkSync Types
 *
 * Types for the network-to-sync bridge hook.
 */

import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';

/**
 * Configuration options for useNetworkSync
 */
export interface UseNetworkSyncOptions {
  /**
   * Whether to automatically sync when coming online
   * @default true
   */
  autoSyncOnReconnect?: boolean;

  /**
   * Delay in milliseconds before triggering sync after reconnect
   * Allows time for network stabilization
   * @default 1000
   */
  reconnectDelayMs?: number;

  /**
   * Whether the hook should be active
   * Useful for conditionally disabling sync (e.g., during auth flow)
   * @default true
   */
  enabled?: boolean;

  /**
   * Callback when sync starts after reconnect
   */
  onSyncStart?: () => void;

  /**
   * Callback when sync completes successfully
   */
  onSyncComplete?: (result: SyncOrchestratorResult) => void;

  /**
   * Callback when sync fails
   */
  onSyncError?: (error: Error) => void;

  /**
   * Callback when going offline
   */
  onOffline?: () => void;

  /**
   * Callback when coming online (before sync starts)
   */
  onOnline?: () => void;
}

/**
 * Return value from useNetworkSync
 */
export interface UseNetworkSyncReturn {
  /** Whether the device is currently online */
  isOnline: boolean;

  /** Whether a sync is currently in progress */
  isSyncing: boolean;

  /** Whether there are pending operations waiting to sync */
  hasPendingOperations: boolean;

  /** Number of pending operations in the queue */
  pendingCount: number;

  /** Last sync result, if any */
  lastSyncResult?: SyncOrchestratorResult;

  /** Manually trigger a sync (useful for retry UI) */
  triggerSync: () => Promise<SyncOrchestratorResult>;

  /** Timestamp of last successful sync */
  lastSuccessfulSyncAt?: number;
}
