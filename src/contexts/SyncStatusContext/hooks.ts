/**
 * SyncStatusContext Hooks
 *
 * Convenience hooks for accessing sync status in components.
 */

import { useContext, useEffect } from 'react';
import { SyncStatusContext } from './context';
import type {
  SyncStatus,
  SyncStatusContextValue,
  SyncStatusIndicator,
} from './types';
import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';
import { defaultContextValue } from './defaults';

/**
 * Main hook for accessing full sync status context
 * @throws Error if used outside SyncStatusProvider
 */
export function useSyncStatus(): SyncStatusContextValue {
  const context = useContext(SyncStatusContext);
  if (context === defaultContextValue) {
    throw new Error('UseSyncStatus must be used within SyncStatusProvider');
  }
  return context;
}

/**
 * Hook for accessing only sync status state (no methods)
 */
export function useSyncStatusState(): SyncStatus {
  const { status } = useSyncStatus();
  return status;
}

/**
 * Hook for checking if sync is in progress
 */
export function useIsSyncing(): boolean {
  const { status } = useSyncStatus();
  return status.isSyncing;
}

/**
 * Hook for checking if there are pending operations
 */
export function useHasPendingSync(): boolean {
  const { status } = useSyncStatus();
  return status.hasPendingOperations;
}

/**
 * Hook for getting current sync indicator
 */
export function useSyncIndicator(): SyncStatusIndicator {
  const { status } = useSyncStatus();
  return status.indicator;
}

/**
 * Hook for registering sync start callback
 * @param callback Function to call when sync starts
 */
export function useOnSyncStart(callback: () => void): void {
  const { onSyncStart } = useSyncStatus();
  useEffect(() => {
    return onSyncStart(callback);
  }, [onSyncStart, callback]);
}

/**
 * Hook for registering sync complete callback
 * @param callback Function to call when sync completes
 */
export function useOnSyncComplete(
  callback: (result: SyncOrchestratorResult) => void
): void {
  const { onSyncComplete } = useSyncStatus();
  useEffect(() => {
    return onSyncComplete(callback);
  }, [onSyncComplete, callback]);
}

/**
 * Hook for registering sync error callback
 * @param callback Function to call when sync errors
 */
export function useOnSyncError(callback: (error: Error) => void): void {
  const { onSyncError } = useSyncStatus();
  useEffect(() => {
    return onSyncError(callback);
  }, [onSyncError, callback]);
}
