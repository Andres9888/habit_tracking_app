/**
 * SyncStatusContext Defaults
 */

import type { SyncStatus, SyncStatusContextValue } from './types';

/**
 * Default sync status
 */
export const defaultSyncStatus: SyncStatus = {
  failedCount: 0,
  hasFailedOperations: false,
  hasPendingOperations: false,
  indicator: 'idle',
  isActive: false,
  isSyncing: false,
  lastError: undefined,
  lastResult: undefined,
  lastSuccessfulSyncAt: undefined,
  pendingCount: 0,
};

/**
 * Noop unsubscribe function for default context
 */
const noop = (): void => {};

/**
 * Default context value (throws on method calls if used without provider)
 */
export const defaultContextValue: SyncStatusContextValue = {
  discardFailed: noop,
  onSyncComplete: () => noop,
  onSyncError: () => noop,
  onSyncStart: () => noop,
  retryFailed: () =>
    Promise.reject(
      new Error('SyncStatusContext: retryFailed called outside provider')
    ),
  status: defaultSyncStatus,
  triggerSync: () =>
    Promise.reject(
      new Error('SyncStatusContext: triggerSync called outside provider')
    ),
};
