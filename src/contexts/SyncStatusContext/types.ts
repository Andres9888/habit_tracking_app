/**
 * SyncStatusContext Types
 *
 * Type definitions for sync status context providing UI-friendly
 * access to offline sync orchestration state.
 *
 * Exposes sync progress, pending operations count, and lifecycle callbacks
 * for building sync indicators and handling sync events in the UI.
 *
 * @see SyncStatusProvider.tsx for provider implementation
 * @see hooks.ts for convenience hooks
 * @see lib/offline/sync/useSyncOrchestrator.ts for orchestrator logic
 */

import type { ReactNode } from 'react';
import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';

/**
 * Sync status indicator for UI display
 *
 * Simplified state machine for rendering sync status badges/icons.
 */
export type SyncStatusIndicator = 'idle' | 'syncing' | 'success' | 'error';

/**
 * Core sync status state
 *
 * Aggregates sync orchestrator state into UI-friendly format.
 */
export interface SyncStatus {
  /** Whether sync is currently running */
  isSyncing: boolean;
  /** Whether sync orchestrator is active and monitoring */
  isActive: boolean;
  /** Number of pending operations in offline queue */
  pendingCount: number;
  /** Whether there are operations waiting to sync */
  hasPendingOperations: boolean;
  /** Current status indicator for UI ('idle' | 'syncing' | 'success' | 'error') */
  indicator: SyncStatusIndicator;
  /** Result from last completed sync (operations synced, errors, etc.) */
  lastResult?: SyncOrchestratorResult;
  /** Timestamp (ms since epoch) of last successful sync */
  lastSuccessfulSyncAt?: number;
  /** Error from last sync attempt, if any */
  lastError?: Error;
}

/**
 * Context value interface
 *
 * Provides sync status state and callback registration methods.
 */
export interface SyncStatusContextValue {
  /** Current sync status */
  status: SyncStatus;
  /** Manually trigger an immediate sync - returns sync result */
  triggerSync: () => Promise<SyncOrchestratorResult>;
  /** Register callback to fire when sync starts - returns unsubscribe function */
  onSyncStart: (callback: () => void) => () => void;
  /** Register callback to fire when sync completes - returns unsubscribe function */
  onSyncComplete: (
    callback: (result: SyncOrchestratorResult) => void
  ) => () => void;
  /** Register callback to fire when sync errors - returns unsubscribe function */
  onSyncError: (callback: (error: Error) => void) => () => void;
}

/**
 * Provider component props
 */
export interface SyncStatusProviderProps {
  /** React children to render */
  children: ReactNode;
  /** Whether to auto-start sync orchestrator on mount (default: true) */
  autoStart?: boolean;
  /** Optional callback invoked when sync status changes */
  onStatusChange?: (status: SyncStatus) => void;
}
