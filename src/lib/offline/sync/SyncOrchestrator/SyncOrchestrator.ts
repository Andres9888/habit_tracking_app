/* eslint-disable max-lines */
/**
 * Sync Orchestrator - Coordinates offline queue sync with network detection.
 */

import type { OfflineQueueManagerAPI } from '../../queueManager';
import { OfflineSyncManager } from '../../syncManager';
import type {
  SyncOrchestratorConfig,
  SyncOrchestratorState,
  SyncOrchestratorResult,
  SyncOrchestratorEventListener,
  SyncProgressCallback,
  SyncExecutor,
} from '../types';
import { DEFAULT_ORCHESTRATOR_CONFIG, getOperationsForSync } from '../helpers';
import { createSyncResult, createErrorResult } from '../resultHelpers';
import { executeSyncCycle } from './executeSyncCycle';
import { checkPreconditions } from './checkPreconditions';
import { createEmitter } from './lifecycle';

export class SyncOrchestrator {
  private queueManager: OfflineQueueManagerAPI;
  private syncManager: OfflineSyncManager;
  private executor: SyncExecutor | null = null;
  private config: Required<SyncOrchestratorConfig>;
  private state: SyncOrchestratorState;
  private listeners = new Set<SyncOrchestratorEventListener>();
  private syncTimeoutId: ReturnType<typeof setTimeout> | null = null;
  private onlineUnsubscribe: (() => void) | null = null;
  private emit: ReturnType<typeof createEmitter>;

  constructor(
    qM: OfflineQueueManagerAPI,
    sM: OfflineSyncManager,
    cfg: SyncOrchestratorConfig = {}
  ) {
    this.queueManager = qM;
    this.syncManager = sM;
    this.config = { ...DEFAULT_ORCHESTRATOR_CONFIG, ...cfg };
    this.state = { isActive: false, isSyncing: false };
    this.emit = createEmitter(this.listeners);
  }

  setExecutor(executor: SyncExecutor): void {
    this.executor = executor;
  }

  start(onOnline: (cb: () => void) => () => void): void {
    if (this.state.isActive) return;
    this.state.isActive = true;
    this.emit('orchestrator:start');
    if (this.config.autoSyncOnOnline)
      this.onlineUnsubscribe = onOnline(() => void this.scheduleSync());
  }

  stop(): void {
    if (!this.state.isActive) return;
    this.state.isActive = false;
    this.cancelScheduledSync();
    if (this.onlineUnsubscribe) {
      this.onlineUnsubscribe();
      this.onlineUnsubscribe = null;
    }
    this.emit('orchestrator:stop');
  }

  scheduleSync(): void {
    if (!this.state.isActive || this.state.isSyncing) return;
    this.cancelScheduledSync();
    this.emit('sync:scheduled');
    this.syncTimeoutId = setTimeout(
      () => void this.sync().catch(() => {}),
      this.config.syncDebounceMs
    );
  }

  cancelScheduledSync(): void {
    if (this.syncTimeoutId) {
      clearTimeout(this.syncTimeoutId);
      this.syncTimeoutId = null;
    }
  }

  async sync(
    onProgress?: SyncProgressCallback
  ): Promise<SyncOrchestratorResult> {
    const earlyResult = checkPreconditions({
      executor: this.executor,
      minSyncIntervalMs: this.config.minSyncIntervalMs,
      onCancelled: (reason) => this.emit('sync:cancelled', { reason }),
      onError: (result) =>
        this.emit('sync:error', { error: result.error, result }),
      state: this.state,
      syncManager: this.syncManager,
    });
    if (earlyResult) return earlyResult;
    const ops = getOperationsForSync(
      this.queueManager.getState().operations,
      this.config.batchSize
    );
    if (ops.length === 0) return createSyncResult(true, 0, 0, 0, 0);

    this.beginSync();

    try {
      const result = await executeSyncCycle({
        batchSize: this.config.batchSize,
        executor: this.executor!,
        onProgress,
        queueManager: this.queueManager,
        syncManager: this.syncManager,
      });
      return this.completeSync(result);
    } catch (error) {
      return this.failSync(error);
    }
  }

  private beginSync(): void {
    this.state.isSyncing = true;
    this.state.lastSyncAttemptAt = Date.now();
    this.emit('sync:started');
  }

  private completeSync(result: SyncOrchestratorResult): SyncOrchestratorResult {
    this.state.isSyncing = false;
    if (result.succeeded > 0) this.state.lastSuccessfulSyncAt = Date.now();
    this.state.lastResult = result;
    this.emit('sync:completed', { result });
    return result;
  }

  private failSync(error: unknown): SyncOrchestratorResult {
    const normalizedError =
      error instanceof Error ? error : new Error(String(error));
    const result = createErrorResult(normalizedError);
    this.state.isSyncing = false;
    this.state.lastResult = result;
    this.emit('sync:error', { error: normalizedError, result });
    return result;
  }

  getState(): SyncOrchestratorState {
    return { ...this.state };
  }

  subscribe(listener: SyncOrchestratorEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
