/**
 * Offline Support Module
 *
 * Comprehensive offline support with:
 * - Error classification for intelligent retry decisions
 * - Circuit breaker pattern to prevent service hammering
 * - Smart retry strategies with exponential backoff
 * - React context for easy integration
 */

// Types
export type {
  CircuitBreakerConfig,
  CircuitBreakerStatus,
  CircuitState,
  ClassifiedError,
  ErrorCategory,
  RetryContext,
  RetryStrategy,
  SyncEvent,
  SyncEventType,
  SyncStatus,
} from './types';

// Error Classification
export {
  classifyError,
  getDisplayMessage,
  isNetworkError,
  shouldRetry,
} from './errorClassifier';

// Circuit Breaker
export {
  CircuitBreaker,
  createCircuitBreaker,
  DEFAULT_CIRCUIT_CONFIG,
  getDefaultCircuitBreaker,
  resetDefaultCircuitBreaker,
} from './circuitBreaker';

// Retry Strategy
export {
  AGGRESSIVE_RETRY_STRATEGY,
  calculateDelay,
  CONSERVATIVE_RETRY_STRATEGY,
  createRetryContext,
  DEFAULT_RETRY_STRATEGY,
  executeWithRetry,
  getTimeUntilRetry,
  selectStrategy,
  shouldRetry as shouldRetryContext,
  updateRetryContext,
  withRetry,
} from './retryStrategy';

// Sync Manager
export {
  getOfflineSyncManager,
  OfflineSyncManager,
  resetOfflineSyncManager,
  type OfflineSyncManagerConfig,
  type SyncItem,
} from './syncManager';

// React Integration
export {
  OfflineSyncProvider,
  useIsCircuitOpen,
  useOfflineSync,
  useSyncEvent,
  useSyncStatus,
} from './context';
