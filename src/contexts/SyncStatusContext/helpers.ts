/**
 * SyncStatusContext Helpers
 */

import type { RefObject } from 'react';
import type { SyncOrchestratorResult } from '../../lib/offline/sync/types';
import type { SyncStatus, SyncStatusIndicator } from './types';
import type { SyncOrchestratorState } from '../../lib/offline/sync/types';

/**
 * Derive status indicator from sync state
 */
export function deriveIndicator(
  isSyncing: boolean,
  lastResult?: SyncOrchestratorResult,
  lastError?: Error
): SyncStatusIndicator {
  if (isSyncing) return 'syncing';
  if (lastError) return 'error';
  if (lastResult && lastResult.succeeded > 0) return 'success';
  return 'idle';
}

/**
 * Build SyncStatus from orchestrator state
 */
export function buildSyncStatus(
  state: SyncOrchestratorState,
  pendingCount: number,
  lastError?: Error,
  failedCount = 0
): SyncStatus {
  const hasPendingOperations = pendingCount > 0;
  return {
    failedCount,
    hasFailedOperations: failedCount > 0,
    hasPendingOperations,
    indicator: deriveIndicator(state.isSyncing, state.lastResult, lastError),
    isActive: state.isActive,
    isSyncing: state.isSyncing,
    lastError,
    lastResult: state.lastResult,
    lastSuccessfulSyncAt: state.lastSuccessfulSyncAt,
    pendingCount,
  };
}

/**
 * Callback types for sync events
 */
export type SyncStartCallback = () => void;
export type SyncCompleteCallback = (result: SyncOrchestratorResult) => void;
export type SyncErrorCallback = (error: Error) => void;

/**
 * Creates a callback registration function that returns an unsubscribe function
 */
export function createCallbackRegistrar<T extends (...args: unknown[]) => void>(
  callbacksRef: RefObject<Set<T>>
): (cb: T) => () => void {
  return (cb: T) => {
    callbacksRef.current?.add(cb);
    return () => callbacksRef.current?.delete(cb);
  };
}
