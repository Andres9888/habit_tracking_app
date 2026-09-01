import type {
  SyncOrchestratorResult,
  SyncOrchestratorState,
} from '../../lib/offline/sync/types';
import type { SyncStatus, SyncStatusIndicator } from './types';

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

export function buildSyncStatus(
  state: SyncOrchestratorState,
  pendingCount: number,
  lastError?: Error
): SyncStatus {
  return {
    hasPendingOperations: pendingCount > 0,
    indicator: deriveIndicator(state.isSyncing, state.lastResult, lastError),
    isActive: state.isActive,
    isSyncing: state.isSyncing,
    lastError,
    lastResult: state.lastResult,
    lastSuccessfulSyncAt: state.lastSuccessfulSyncAt,
    pendingCount,
  };
}
