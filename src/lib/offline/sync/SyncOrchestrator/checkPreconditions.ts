/**
 * Sync Preconditions Checker
 */

import { OfflineSyncManager } from '../../syncManager';
import type {
  SyncOrchestratorResult,
  SyncOrchestratorState,
  SyncExecutor,
} from '../types';
import { shouldSkipSync } from '../helpers';
import { createSyncResult, createErrorResult } from '../resultHelpers';

export interface CheckPreconditionsParams {
  executor: SyncExecutor | null;
  state: SyncOrchestratorState;
  syncManager: OfflineSyncManager;
  minSyncIntervalMs: number;
  onError: (result: SyncOrchestratorResult) => void;
  onCancelled: (reason: string) => void;
}

/**
 * Creates a no-op sync result indicating sync was skipped (0 operations performed)
 */
function createNoOpSyncResult(): SyncOrchestratorResult {
  return createSyncResult(false, 0, 0, 0, 0);
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
  if (state.isSyncing) return createNoOpSyncResult();
  if (shouldSkipSync(state.lastSyncAttemptAt, minSyncIntervalMs)) {
    return createNoOpSyncResult();
  }
  if (!syncManager.canSync()) {
    onCancelled('Circuit breaker open');
    return createNoOpSyncResult();
  }
  return null;
}
