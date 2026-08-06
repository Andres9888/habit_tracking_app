/**
 * NetworkStatusProvider Component
 * Provides network connectivity status throughout the app
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import * as Network from 'expo-network';
import type {
  NetworkStatus,
  NetworkStatusContextValue,
  NetworkStatusProviderProps,
} from './types';
import { networkStateToStatus, calculateIsOnline } from './utils';
import type { NetworkState } from './utils';
import { defaultNetworkStatus } from './defaults';
import { NetworkStatusContext } from './context';

export function NetworkStatusProvider({
  children,
  onStatusChange,
  refreshOnFocus: _refreshOnFocus = true,
}: NetworkStatusProviderProps) {
  const [status, setStatus] = useState<NetworkStatus>(defaultNetworkStatus);
  const [isChecking, setIsChecking] = useState(true);

  const onlineCallbacksRef = useRef<Set<() => void>>(new Set());
  const offlineCallbacksRef = useRef<Set<() => void>>(new Set());
  const previousIsOnlineRef = useRef<boolean | null>(null);

  const isOnline = calculateIsOnline(status);

  const handleStatusUpdate = useCallback(
    (newState: NetworkState) => {
      const newStatus = networkStateToStatus(newState);
      const wasOnline = previousIsOnlineRef.current;
      const nowOnline = calculateIsOnline(newStatus);

      setStatus(newStatus);
      setIsChecking(false);

      if (wasOnline !== null && wasOnline !== nowOnline) {
        const callbacks = nowOnline
          ? onlineCallbacksRef.current
          : offlineCallbacksRef.current;
        for (const cb of callbacks) {
          try {
            cb();
          } catch (error) {
            if (__DEV__) console.warn('Callback error:', error);
          }
        }
      }

      previousIsOnlineRef.current = nowOnline;
      onStatusChange?.(newStatus);
    },
    [onStatusChange]
  );

  useEffect(() => {
    void Network.getNetworkStateAsync()
      .then(handleStatusUpdate)
      .catch((error) => {
        if (__DEV__)
          console.warn('Error getting initial network state:', error);
        setIsChecking(false);
      });
    const subscription = Network.addNetworkStateListener(handleStatusUpdate);
    return () => subscription.remove();
  }, [handleStatusUpdate]);

  const refresh = useCallback(async () => {
    setIsChecking(true);
    try {
      handleStatusUpdate(await Network.getNetworkStateAsync());
    } catch (error) {
      if (__DEV__) console.warn('Error refreshing network status:', error);
      setIsChecking(false);
    }
  }, [handleStatusUpdate]);

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

  const value: NetworkStatusContextValue = useMemo(
    () => ({
      isChecking,
      isOnline,
      onOffline: onOfflineCallback,
      onOnline: onOnlineCallback,
      refresh,
      status,
    }),
    [isChecking, isOnline, onOfflineCallback, onOnlineCallback, refresh, status]
  );

  if (!NetworkStatusContext?.Provider) {
    if (__DEV__) {
      console.error('[NetworkStatusProvider] Missing NetworkStatusContext.Provider');
    }
    return <>{children}</>;
  }

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export default NetworkStatusProvider;
