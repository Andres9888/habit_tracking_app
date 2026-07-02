/**
 * OfflineProvider
 *
 * React provider that wires up offline queue restoration on app start.
 * Implements FR-003: Persist offline queue across app restarts and device reboots.
 *
 * @see docs/offline-habit-sync.md
 */

import { createContext, useEffect } from 'react';
import { getOfflineQueueManager } from '../../lib/offline';
import { syncOptimisticFromQueueEvent } from '../../lib/offline/rehydrate';
import type { OfflineContextValue, OfflineProviderProps } from './types';
import { useOfflineContextValue } from './useOfflineContextValue';
import { useOfflineRestoration } from './useOfflineRestoration';

export const OfflineContext = createContext<OfflineContextValue | null>(null);

/**
 * Provider component that restores the offline queue on mount.
 *
 * This ensures that any pending offline operations are loaded from
 * AsyncStorage when the app starts, fulfilling SC-003 (zero data loss
 * through restarts) and SC-006 (app launch time increase ≤100ms).
 */
export function OfflineProvider({
  children,
  skipAutoRestore = false,
}: OfflineProviderProps) {
  const restoration = useOfflineRestoration(skipAutoRestore);

  useEffect(() => {
    const manager = getOfflineQueueManager();
    return manager.subscribe((event) => {
      syncOptimisticFromQueueEvent(event, manager);
    });
  }, []);

  const value = useOfflineContextValue(restoration);

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  );
}
