/* eslint-disable max-lines */
/**
 * Offline Sync Manager
 */

import type { CircuitBreaker } from '../circuitBreaker';
import { calculateDelay } from '../retryStrategy';
import type { RetryStrategy, SyncEventType, SyncStatus } from '../types';
import type {
  OfflineSyncManagerConfig,
  SyncItem,
  SyncItemExecutor,
  SyncEventListener,
  SyncResult,
  BatchResult,
} from './types';
import { processItem } from './processItem';
import { processBatch as processBatchFn } from './processBatch';
import { emitSyncEvent } from './emitSyncEvent';
import { createSyncCircuit } from './createSyncCircuit';

export class OfflineSyncManager {
  private circuitBreaker: CircuitBreaker;
  private retryStrategy: RetryStrategy;
  private listeners = new Set<SyncEventListener>();
  private isSyncing = false;
  private getPendingCount?: () => number;
  private stats = { failedCount: 0, syncedCount: 0 };
  private lastSyncAt?: number;

  constructor(config: OfflineSyncManagerConfig = {}) {
    const { circuitBreaker, retryStrategy } = createSyncCircuit(
      config,
      this.emit.bind(this)
    );
    this.circuitBreaker = circuitBreaker;
    this.retryStrategy = retryStrategy;
    this.getPendingCount = config.getPendingCount;
  }

  getStatus(): SyncStatus {
    return {
      circuitStatus: this.circuitBreaker.getStatus(),
      failedCount: this.stats.failedCount,
      isSyncing: this.isSyncing,
      lastSyncAt: this.lastSyncAt,
      pendingCount: this.getPendingCount?.() ?? 0,
      progress: 0,
      syncedCount: this.stats.syncedCount,
    };
  }

  canSync(): boolean {
    return this.circuitBreaker.canExecute();
  }

  subscribe(listener: SyncEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  async syncItem<T>(
    item: SyncItem<T>,
    executor: SyncItemExecutor<T>
  ): Promise<SyncResult<T>> {
    return processItem(
      item,
      executor,
      this.circuitBreaker,
      this.retryStrategy,
      this.emit.bind(this),
      this.stats
    );
  }

  async processBatch<T>(
    items: SyncItem<T>[],
    executor: SyncItemExecutor<T>,
    onProgress?: (p: number, t: number) => void
  ): Promise<BatchResult<T>> {
    this.isSyncing = true;
    const result = await processBatchFn(
      items,
      executor,
      this.circuitBreaker,
      this.retryStrategy,
      this.emit.bind(this),
      this.stats,
      onProgress
    );
    this.isSyncing = false;
    this.lastSyncAt = Date.now();
    return result;
  }

  getNextRetryDelay(ctx: {
    attemptCount: number;
    exhausted: boolean;
    lastError?: { suggestedDelay?: number };
  }): number {
    return ctx.exhausted
      ? Infinity
      : calculateDelay(
          ctx.attemptCount,
          this.retryStrategy,
          ctx.lastError?.suggestedDelay
        );
  }

  resetCircuit(): void {
    this.circuitBreaker.reset();
  }
  resetStats(): void {
    this.stats = { failedCount: 0, syncedCount: 0 };
  }

  private emit(type: SyncEventType, data?: Record<string, unknown>): void {
    emitSyncEvent(this.listeners, type, data);
  }
}
