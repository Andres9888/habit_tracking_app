/**
 * NetworkStatusProvider Component
 * Provides network connectivity status throughout the app
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
import { useNetworkCallbacks } from './useNetworkCallbacks';

export function NetworkStatusProvider({
  children,
  onStatusChange,
  refreshOnFocus: _refreshOnFocus = true,
}: NetworkStatusProviderProps) {
  const [status, setStatus] = useState<NetworkStatus>(defaultNetworkStatus);
  const [isChecking, setIsChecking] = useState(true);

  const {
    offlineCallbacksRef,
    onlineCallbacksRef,
    onOfflineCallback,
    onOnlineCallback,
  } = useNetworkCallbacks();
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
    return children;
  }

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

export default NetworkStatusProvider;
