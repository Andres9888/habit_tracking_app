/**
 * Sync Preconditions Checker
 */

import type {
  SyncOrchestratorResult,
  SyncOrchestratorState,
  ToggleSyncExecutor,
} from '../types';
import { OfflineSyncManager } from '../../syncManager';
import { createSyncResult, createErrorResult } from '../resultHelpers';
import { shouldSkipSync } from '../helpers';

export interface CheckPreconditionsParams {
  executor: ToggleSyncExecutor | null;
  state: SyncOrchestratorState;
  syncManager: OfflineSyncManager;
  minSyncIntervalMs: number;
  onError: (result: SyncOrchestratorResult) => void;
  onCancelled: (reason: string) => void;
}

export function checkPreconditions(
  params: CheckPreconditionsParams
): SyncOrchestratorResult | null {
  const {
    executor,
    state,
    syncManager,
    minSyncIntervalMs,
    onError,
    onCancelled,
  } = params;

  if (!executor) {
    const result = createErrorResult(new Error('No executor configured'));
    onError(result);
    return result;
  }
  if (state.isSyncing) return createSyncResult(false, 0, 0, 0, 0);
  if (shouldSkipSync(state.lastSyncAttemptAt, minSyncIntervalMs)) {
    return createSyncResult(false, 0, 0, 0, 0);
  }
  if (!syncManager.canSync()) {
    onCancelled('Circuit breaker open');
    return createSyncResult(false, 0, 0, 0, 0);
  }
  return null;
}
