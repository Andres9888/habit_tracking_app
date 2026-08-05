/**
 * Offline Sync Hooks
 */

import { useContext, useEffect } from 'react';
import {
  OfflineSyncContext,
  type OfflineSyncContextValue,
} from './OfflineSyncContext';
import type { SyncEvent, SyncStatus } from '../types';

/**
 * Hook to access offline sync context
 */
export function useOfflineSync(): OfflineSyncContextValue {
  const context = useContext(OfflineSyncContext);
  if (!context) {
    throw new Error(
      'UseOfflineSync must be used within an OfflineSyncProvider'
    );
  }
  return context;
}

/**
 * Hook to subscribe to specific sync events
 */
export function useSyncEvent(
  eventType: SyncEvent['type'],
  handler: (event: SyncEvent) => void
): void {
  const { subscribe } = useOfflineSync();
  useEffect(() => {
    return subscribe((event) => {
      if (event.type === eventType) handler(event);
    });
  }, [subscribe, eventType, handler]);
}

/**
 * Hook to get just the sync status
 */
export function useSyncStatus(): SyncStatus {
  const { status } = useOfflineSync();
  return status;
}

/**
 * Hook to check if circuit is open
 */
export function useIsCircuitOpen(): boolean {
  const { status } = useOfflineSync();
  return status.circuitStatus.state === 'open';
}
