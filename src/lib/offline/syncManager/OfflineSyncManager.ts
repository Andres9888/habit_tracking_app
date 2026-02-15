/* eslint-disable max-lines */
/**
 * Offline Sync Manager
 */

import type {
  OfflineSyncManagerConfig,
  SyncItem,
  SyncItemExecutor,
  SyncEventListener,
  SyncResult,
  BatchResult,
} from './types';
import type { RetryStrategy, SyncEventType, SyncStatus } from '../types';
import {
  createCircuitBreaker,
  DEFAULT_CIRCUIT_CONFIG,
  type CircuitBreaker,
} from '../circuitBreaker';
import { calculateDelay, DEFAULT_RETRY_STRATEGY } from '../retryStrategy';
import { emitSyncEvent } from './emitSyncEvent';
import { processBatch as processBatchFn } from './processBatch';
import { processItem } from './processItem';

export class OfflineSyncManager {
  private circuitBreaker: CircuitBreaker;
  private retryStrategy: RetryStrategy;
  private listeners = new Set<SyncEventListener>();
  private isSyncing = false;
  private stats = { failedCount: 0, syncedCount: 0 };
  private lastSyncAt?: number;

  constructor(config: OfflineSyncManagerConfig = {}) {
    this.retryStrategy = { ...DEFAULT_RETRY_STRATEGY, ...config.retryStrategy };
    this.circuitBreaker = createCircuitBreaker({
      ...DEFAULT_CIRCUIT_CONFIG,
      ...config.circuitBreaker,
    });
    this.circuitBreaker.subscribe(({ state }) => {
      switch (state) {
        case 'open': {
          this.emit('circuit:open');
          break;
        }
        case 'closed': {
          this.emit('circuit:close');
          break;
        }
        case 'half-open': {
          {
            this.emit('circuit:half-open');
            // No default
          }
          break;
        }
      }
    });
  }

  getStatus(): SyncStatus {
    return {
      circuitStatus: this.circuitBreaker.getStatus(),
      failedCount: this.stats.failedCount,
      isSyncing: this.isSyncing,
      lastSyncAt: this.lastSyncAt,
      pendingCount: 0,
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
