/**
 * OfflineProvider
 *
 * React provider that wires up offline queue restoration on app start.
 * Implements FR-003: Persist offline queue across app restarts and device reboots.
 *
 * @see docs/offline-habit-sync.md
 */

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getOfflineQueueManager } from '../../lib/offline';
import type { OfflineContextValue, OfflineProviderProps } from './types';

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
  const [isRestored, setIsRestored] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restorationError, setRestorationError] = useState<Error | null>(null);

  // Use ref to prevent concurrent restoration calls (avoids stale closure)
  const isRestoringRef = useRef(false);

  const restoreQueue = useCallback(async () => {
    if (isRestoringRef.current) return;

    isRestoringRef.current = true;
    setIsRestoring(true);
    setRestorationError(null);

    try {
      const manager = getOfflineQueueManager();
      await manager.restore();
      setIsRestored(true);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Queue restoration failed');
      setRestorationError(err);
      if (__DEV__) console.error('[OfflineProvider] Failed to restore queue:', err);
    } finally {
      isRestoringRef.current = false;
      setIsRestoring(false);
    }
  }, []);

  // Auto-restore on mount
  useEffect(() => {
    if (skipAutoRestore) {
      setIsRestored(true);
      return;
    }
    restoreQueue();
  }, [skipAutoRestore, restoreQueue]);

  const value = useMemo(
    (): OfflineContextValue => ({
      isRestored,
      isRestoring,
      restorationError,
      restoreQueue,
    }),
    [isRestored, isRestoring, restorationError, restoreQueue]
  );

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  );
}
