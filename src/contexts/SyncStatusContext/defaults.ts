/**
 * SyncStatusContext Default Values
 *
 * Default context values used before SyncStatusProvider mounts
 * and for createContext initialization.
 *
 * The defaults assume an idle state with no sync activity.
 * triggerSync will reject if called before provider mounts.
 */

import type { SyncStatus, SyncStatusContextValue } from './types';

/**
 * Default sync status (idle, no pending operations)
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
 * No-op function for callback unsubscribe
 */
const noop = (): void => {};

/**
 * Default context value
 *
 * Used as initial value before provider mounts or if used outside provider.
 * triggerSync will reject with error if called before provider mounts.
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
