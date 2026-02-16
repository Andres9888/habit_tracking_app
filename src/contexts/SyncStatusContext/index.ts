/**
 * SyncStatusContext - Barrel Export
 *
 * React Context for monitoring offline sync orchestration status.
 * Provides sync progress state, pending operations count, and lifecycle callbacks.
 *
 * **Quick Start:**
 * ```tsx
 * // 1. Add provider to app root (after NetworkStatusProvider)
 * <SyncStatusProvider autoStart={true}>
 *   <App />
 * </SyncStatusProvider>
 *
 * // 2. Use hooks in any component
 * const isSyncing = useIsSyncing();
 * const hasPending = useHasPendingSync();
 * const { status, triggerSync } = useSyncStatus();
 *
 * // 3. Register callbacks for sync events
 * useOnSyncComplete((result) => {
 *   console.log(`Synced ${result.syncedCount} operations`);
 * });
 * ```
 *
 * @module SyncStatusContext
 */

// Provider & Context
export {
  SyncStatusProvider,
  SyncStatusContext,
  default,
} from './SyncStatusProvider';

// Hooks
export {
  useSyncStatus,
  useSyncStatusState,
  useIsSyncing,
  useHasPendingSync,
  useSyncIndicator,
  useOnSyncStart,
  useOnSyncComplete,
  useOnSyncError,
} from './hooks';

// Types
export type {
  SyncStatus,
  SyncStatusContextValue,
  SyncStatusIndicator,
  SyncStatusProviderProps,
} from './types';
