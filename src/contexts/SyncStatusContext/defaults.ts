/**
 * SyncStatusContext Defaults
 */

import type { SyncStatus, SyncStatusContextValue } from './types';

/**
 * Default sync status
 */
export const defaultSyncStatus: SyncStatus = {
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
  onSyncComplete: () => noop,
  onSyncError: () => noop,
  onSyncStart: () => noop,
  status: defaultSyncStatus,
  triggerSync: () =>
    Promise.reject(
      new Error('SyncStatusContext: triggerSync called outside provider')
    ),
};
