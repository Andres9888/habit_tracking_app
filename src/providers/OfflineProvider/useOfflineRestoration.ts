import { useAuth } from '@clerk/clerk-expo';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getOfflineQueueManager } from '../../lib/offline';
import { rehydrateOptimisticFromQueue } from '../../lib/offline/rehydrate';
import { setQueueStorageScope } from '../../lib/offline/persistence';
import { setOptimisticStoreScope } from '../../lib/optimistic/store/persistence';
import { clearSessionData } from './clearSessionData';
import type { OfflineContextValue } from './types';

type RestoreState = Pick<
  OfflineContextValue,
  'isRestored' | 'isRestoring' | 'restorationError'
>;

const restoredState: RestoreState = {
  isRestored: true,
  isRestoring: false,
  restorationError: null,
};

export function useOfflineRestoration(
  skipAutoRestore: boolean
): OfflineContextValue {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const [state, setState] = useState<RestoreState>({
    isRestored: false,
    isRestoring: false,
    restorationError: null,
  });
  const isRestoringRef = useRef(false);
  const activeUserIdRef = useRef<string | null>(null);
  const previousUserIdRef = useRef<string | null>(null);

  const restoreQueue = useCallback(async () => {
    if (isRestoringRef.current) return;
    const activeUserId = activeUserIdRef.current;
    if (!activeUserId) {
      setState(restoredState);
      return;
    }

    isRestoringRef.current = true;
    setState({ isRestored: false, isRestoring: true, restorationError: null });

    try {
      setQueueStorageScope(activeUserId);
      const manager = getOfflineQueueManager();
      await manager.restore();
      rehydrateOptimisticFromQueue(manager.getState().operations);
      setState(restoredState);
    } catch (error) {
      const restorationError =
        error instanceof Error ? error : new Error('Queue restoration failed');
      setState({ isRestored: false, isRestoring: false, restorationError });
      if (__DEV__)
        console.error(
          '[OfflineProvider] Failed to restore queue:',
          restorationError
        );
    } finally {
      isRestoringRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
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
        if (cancelled) return;
      }
      if (!currentUserId || skipAutoRestore) {
        setState(restoredState);
        return;
      }
      setState((prev) => ({ ...prev, isRestored: false }));
      await restoreQueue();
    })();

    return () => {
      cancelled = true;
      isRestoringRef.current = false;
    };
  }, [isLoaded, isSignedIn, restoreQueue, skipAutoRestore, userId]);

  return { ...state, restoreQueue };
}
