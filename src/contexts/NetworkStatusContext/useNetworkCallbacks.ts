import { useCallback, useRef } from 'react';

export function useNetworkCallbacks() {
  const onlineCallbacksRef = useRef<Set<() => void>>(new Set());
  const offlineCallbacksRef = useRef<Set<() => void>>(new Set());

  const onOnlineCallback = useCallback((callback: () => void) => {
    onlineCallbacksRef.current.add(callback);
    return () => {
      onlineCallbacksRef.current.delete(callback);
    };
  }, []);

  const onOfflineCallback = useCallback((callback: () => void) => {
    offlineCallbacksRef.current.add(callback);
    return () => {
      offlineCallbacksRef.current.delete(callback);
    };
  }, []);

  return {
    offlineCallbacksRef,
    onlineCallbacksRef,
    onOfflineCallback,
    onOnlineCallback,
  };
}
