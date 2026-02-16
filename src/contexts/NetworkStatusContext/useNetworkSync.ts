/**
 * useNetworkSync Hook
 *
 * Bridges NetworkStatusContext with SyncOrchestrator to provide:
 * - Auto-sync on network reconnection (FR-004)
 * - Debounced sync triggering for network stability
 * - Sync state tracking for UI indicators
 *
 * This hook implements the "connection boundary" pattern, acting as the
 * glue between network detection and sync execution.
 */

import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { useNetworkStatus } from './hooks';
import { useSyncOrchestrator } from '../../lib/offline/sync/useSyncOrchestrator';
import { getOfflineQueueManager } from '../../lib/offline/queueManager';
import { DEFAULT_RECONNECT_DELAY_MS } from '@/constants';
import type {
  UseNetworkSyncOptions,
  UseNetworkSyncReturn,
} from './useNetworkSync.types';

/**
 * useNetworkSync - Wires network status changes to sync orchestrator
 *
 * @example
 * ```tsx
 * function App() {
 *   const {
 *     isOnline,
 *     isSyncing,
 *     pendingCount,
 *     triggerSync,
 *   } = useNetworkSync({
 *     onSyncComplete: (result) => {
 *       Toast.show(`Synced ${result.succeeded} habits`);
 *     },
 *   });
 *
 *   return (
 *     <View>
 *       {!isOnline && <OfflineBanner />}
 *       {pendingCount > 0 && <PendingBadge count={pendingCount} />}
 *       {isSyncing && <SyncSpinner />}
 *     </View>
 *   );
 * }
 * ```
 */
export function useNetworkSync(
  options: UseNetworkSyncOptions = {}
): UseNetworkSyncReturn {
  const {
    autoSyncOnReconnect = true,
    reconnectDelayMs = DEFAULT_RECONNECT_DELAY_MS,
    enabled = true,
    onSyncStart,
    onSyncComplete,
    onSyncError,
    onOffline: onOfflineCallback,
    onOnline: onOnlineCallback,
  } = options;

  const { isOnline, onOnline, onOffline } = useNetworkStatus();
  const syncOrchestrator = useSyncOrchestrator({
    autoStart: false,
    onSyncComplete,
    onSyncError,
  });

  const [pendingCount, setPendingCount] = useState(0);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const wasOnlineRef = useRef<boolean | null>(null);

  // Track pending operations count
  useEffect(() => {
    const queueManager = getOfflineQueueManager();
    const updatePendingCount = () => {
      setPendingCount(queueManager.getStats().pendingCount);
    };

    updatePendingCount();
    const unsubscribe = queueManager.subscribe(updatePendingCount);
    return unsubscribe;
  }, []);

  // Handle network status changes
  useEffect(() => {
    if (!enabled) return;

    const handleOnline = () => {
      onOnlineCallback?.();

      if (!autoSyncOnReconnect) return;

      // Clear any existing timeout
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      // Debounce sync to allow network stabilization
      reconnectTimeoutRef.current = setTimeout(() => {
        onSyncStart?.();
        void syncOrchestrator.triggerSync();
      }, reconnectDelayMs);
    };

    const handleOffline = () => {
      // Clear pending sync on disconnect
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      onOfflineCallback?.();
    };

    const unsubscribeOnline = onOnline(handleOnline);
    const unsubscribeOffline = onOffline(handleOffline);

    // Track previous online state for edge detection
    wasOnlineRef.current = isOnline;

    return () => {
      unsubscribeOnline();
      unsubscribeOffline();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [
    enabled,
    autoSyncOnReconnect,
    reconnectDelayMs,
    onOnline,
    onOffline,
    onSyncStart,
    onOnlineCallback,
    onOfflineCallback,
    syncOrchestrator,
  ]);

  const triggerSync = useCallback(async () => {
    onSyncStart?.();
    return syncOrchestrator.triggerSync();
  }, [syncOrchestrator, onSyncStart]);

  return useMemo(
    () => ({
      hasPendingOperations: pendingCount > 0,
      isOnline,
      isSyncing: syncOrchestrator.state.isSyncing,
      lastSuccessfulSyncAt: syncOrchestrator.state.lastSuccessfulSyncAt,
      lastSyncResult: syncOrchestrator.state.lastResult,
      pendingCount,
      triggerSync,
    }),
    [isOnline, pendingCount, syncOrchestrator.state, triggerSync]
  );
}
