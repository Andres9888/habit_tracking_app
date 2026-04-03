/**
 * OfflineProvider
 *
 * React provider that wires up offline queue restoration on app start.
 * Implements FR-003: Persist offline queue across app restarts and device reboots.
 *
 * @see docs/offline-habit-sync.md
 */

import { useAuth } from '@clerk/clerk-expo';
import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { getOfflineQueueManager } from '../../lib/offline';
import {
  clearLegacyQueueState,
  clearQueueState,
  setQueueStorageScope,
} from '../../lib/offline/persistence';
import { optimisticStore } from '../../lib/optimistic/store';
import {
  clearLegacyOptimisticStore,
  clearOptimisticStoreForScope,
  setOptimisticStoreScope,
} from '../../lib/optimistic/store/persistence';
import type { OfflineContextValue, OfflineProviderProps } from './types';
import { useOfflineContextValue } from './useOfflineContextValue';

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
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [isRestored, setIsRestored] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [restorationError, setRestorationError] = useState<Error | null>(null);

  // Use ref to prevent concurrent restoration calls (avoids stale closure)
  const isRestoringRef = useRef(false);
  const activeUserIdRef = useRef<string | null>(null);
  const previousUserIdRef = useRef<string | null>(null);

  const restoreQueue = useCallback(async () => {
    if (isRestoringRef.current) return;

    const activeUserId = activeUserIdRef.current;
    if (!activeUserId) {
      setIsRestored(true);
      setIsRestoring(false);
      setRestorationError(null);
      return;
    }

    isRestoringRef.current = true;
    setIsRestoring(true);
    setRestorationError(null);

    try {
      setQueueStorageScope(activeUserId);
      const manager = getOfflineQueueManager();
      await manager.restore();
      setIsRestored(true);
    } catch (error) {
      const err =
        error instanceof Error ? error : new Error('Queue restoration failed');
      setRestorationError(err);
      if (__DEV__)
        console.error('[OfflineProvider] Failed to restore queue:', err);
    } finally {
      isRestoringRef.current = false;
      setIsRestoring(false);
    }
  }, []);

  const clearSessionData = useCallback(async (scope: string) => {
    setQueueStorageScope(scope);
    setOptimisticStoreScope(scope);
    getOfflineQueueManager().clear();
    optimisticStore.reset();

    await Promise.allSettled([
      clearQueueState(scope),
      clearLegacyQueueState(),
      clearOptimisticStoreForScope(scope),
      clearLegacyOptimisticStore(),
    ]);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const currentUserId = isSignedIn && userId ? userId : null;
    activeUserIdRef.current = currentUserId;
    setQueueStorageScope(currentUserId);
    setOptimisticStoreScope(currentUserId);

    const previousUserId = previousUserIdRef.current;
    previousUserIdRef.current = currentUserId;

    let cancelled = false;

    void (async () => {
      if (previousUserId && previousUserId !== currentUserId) {
        await clearSessionData(previousUserId);
        if (cancelled) {
          return;
        }
        setQueueStorageScope(currentUserId);
        setOptimisticStoreScope(currentUserId);
      }

      if (!currentUserId) {
        setIsRestored(true);
        setIsRestoring(false);
        setRestorationError(null);
        return;
      }

      setIsRestored(false);

      if (skipAutoRestore) {
        setIsRestored(true);
        return;
      }

      await restoreQueue();
    })();

    return () => {
      cancelled = true;
      isRestoringRef.current = false;
    };
  }, [
    clearSessionData,
    isLoaded,
    isSignedIn,
    restoreQueue,
    skipAutoRestore,
    userId,
  ]);

  const value = useOfflineContextValue({
    isRestored,
    isRestoring,
    restorationError,
    restoreQueue,
  });

  return (
    <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
  );
}
