/**
 * Sync Manager Types
 */

import type {
  CircuitBreakerConfig,
  ClassifiedError,
  RetryContext,
  RetryStrategy,
  SyncEvent,
} from '../types';

export interface OfflineSyncManagerConfig {
  /** Retry strategy for sync operations */
  retryStrategy?: Partial<RetryStrategy>;
  /** Circuit breaker configuration */
  circuitBreaker?: Partial<CircuitBreakerConfig>;
  /** Whether to auto-sync on initialization */
  autoSync?: boolean;
  /** Optional provider for queue pending count used in sync status */
  getPendingCount?: () => number;
}

export interface SyncItem<T = unknown> {
  id: string;
  type: string;
  payload: T;
  retryContext: RetryContext;
}

export type SyncItemExecutor<T> = (item: SyncItem<T>) => Promise<void>;

export type SyncEventListener = (event: SyncEvent) => void;

export interface SyncResult<T> {
  success: boolean;
  item: SyncItem<T>;
  error?: ClassifiedError;
}

export interface BatchResult<T> {
  successful: SyncItem<T>[];
  failed: SyncItem<T>[];
  skipped: SyncItem<T>[];
}

export { type SyncEventType, type SyncStatus, type SyncEvent } from '../types';
