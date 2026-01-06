/**
 * NetworkStatusContext
 * Provides network connectivity status throughout the app
 *
 * Part of Edge Case handling: Offline Queue for Submissions
 *
 * Features:
 * - Real-time network status monitoring via @react-native-community/netinfo
 * - Connection type detection (wifi, cellular, etc.)
 * - Internet reachability checking
 * - Event callbacks for online/offline transitions
 * - Retry trigger when coming back online
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  ReactNode,
} from 'react';
import NetInfo, {
  NetInfoState,
  NetInfoStateType,
} from '@react-native-community/netinfo';

/**
 * Network status details
 */
export interface NetworkStatus {
  /** Whether the device has network connectivity */
  isConnected: boolean;
  /** Whether the internet is reachable (not just connected to a network) */
  isInternetReachable: boolean | null;
  /** Type of connection (wifi, cellular, none, etc.) */
  connectionType: NetInfoStateType;
  /** Whether the connection is expensive (cellular) */
  isExpensive: boolean;
  /** Timestamp of last status change */
  lastStatusChangeAt: number;
}

/**
 * Context value interface
 */
export interface NetworkStatusContextValue {
  /** Current network status */
  status: NetworkStatus;
  /** Whether we're online and can reach the internet */
  isOnline: boolean;
  /** Whether we're currently checking network status */
  isChecking: boolean;
  /** Force a refresh of network status */
  refresh: () => Promise<void>;
  /** Register a callback for when coming back online */
  onOnline: (callback: () => void) => () => void;
  /** Register a callback for when going offline */
  onOffline: (callback: () => void) => () => void;
}

/**
 * Provider props
 */
export interface NetworkStatusProviderProps {
  children: ReactNode;
  /** Optional callback when network status changes */
  onStatusChange?: (status: NetworkStatus) => void;
  /** Whether to automatically refresh on focus (default: true) */
  refreshOnFocus?: boolean;
}

// Default network status
const defaultNetworkStatus: NetworkStatus = {
  isConnected: true, // Optimistically assume connected
  isInternetReachable: null,
  connectionType: NetInfoStateType.unknown,
  isExpensive: false,
  lastStatusChangeAt: Date.now(),
};

// Default no-op functions for context
const defaultRefresh = async (): Promise<void> => {};
const defaultCallback = (): (() => void) => () => {};

// Create context with default value
const NetworkStatusContext = createContext<NetworkStatusContextValue>({
  isChecking: true,
  isOnline: true,
  onOffline: defaultCallback,
  onOnline: defaultCallback,
  refresh: defaultRefresh,
  status: defaultNetworkStatus,
});

/**
 * Convert NetInfo state to our NetworkStatus format
 */
function netInfoToStatus(state: NetInfoState): NetworkStatus {
  return {
    isConnected: state.isConnected ?? false,
    isInternetReachable: state.isInternetReachable,
    connectionType: state.type,
    isExpensive: state.details?.isConnectionExpensive ?? false,
    lastStatusChangeAt: Date.now(),
  };
}

/**
 * Determine if we're truly online
 * We need both connectivity AND internet reachability
 */
function calculateIsOnline(status: NetworkStatus): boolean {
  // Must be connected
  if (!status.isConnected) return false;

  // If we don't know about internet reachability, assume online if connected
  if (status.isInternetReachable === null) return status.isConnected;

  // Otherwise, use the internet reachability status
  return status.isInternetReachable;
}

/**
 * NetworkStatusProvider Component
 *
 * Wraps the app to provide network status context to all children.
 *
 * @example
 * ```tsx
 * <NetworkStatusProvider onStatusChange={(status) => console.log(status)}>
 *   <App />
 * </NetworkStatusProvider>
 * ```
 */
export function NetworkStatusProvider({
  children,
  onStatusChange,
  refreshOnFocus: _refreshOnFocus = true,
}: NetworkStatusProviderProps) {
  const [status, setStatus] = useState<NetworkStatus>(defaultNetworkStatus);
  const [isChecking, setIsChecking] = useState(true);

  // Refs for callbacks
  const onlineCallbacksRef = useRef<Set<() => void>>(new Set());
  const offlineCallbacksRef = useRef<Set<() => void>>(new Set());
  const previousIsOnlineRef = useRef<boolean | null>(null);

  // Calculate isOnline from status
  const isOnline = calculateIsOnline(status);

  // Handle status update
  const handleStatusUpdate = useCallback(
    (newState: NetInfoState) => {
      const newStatus = netInfoToStatus(newState);
      const wasOnline = previousIsOnlineRef.current;
      const nowOnline = calculateIsOnline(newStatus);

      setStatus(newStatus);
      setIsChecking(false);

      // Trigger callbacks on state changes
      if (wasOnline !== null && wasOnline !== nowOnline) {
        if (nowOnline) {
          // Coming back online - trigger all onOnline callbacks
          onlineCallbacksRef.current.forEach((callback) => {
            try {
              callback();
            } catch (error) {
              console.warn('Error in onOnline callback:', error);
            }
          });
        } else {
          // Going offline - trigger all onOffline callbacks
          offlineCallbacksRef.current.forEach((callback) => {
            try {
              callback();
            } catch (error) {
              console.warn('Error in onOffline callback:', error);
            }
          });
        }
      }

      previousIsOnlineRef.current = nowOnline;

      // Notify external listener
      if (onStatusChange) {
        onStatusChange(newStatus);
      }
    },
    [onStatusChange]
  );

  // Subscribe to network status changes
  useEffect(() => {
    // Get initial status
    void NetInfo.fetch().then(handleStatusUpdate);

    // Subscribe to changes
    const unsubscribe = NetInfo.addEventListener(handleStatusUpdate);

    return () => {
      unsubscribe();
    };
  }, [handleStatusUpdate]);

  // Refresh network status
  const refresh = useCallback(async () => {
    setIsChecking(true);
    try {
      const state = await NetInfo.fetch();
      handleStatusUpdate(state);
    } catch (error) {
      console.warn('Error refreshing network status:', error);
      setIsChecking(false);
    }
  }, [handleStatusUpdate]);

  // Register onOnline callback
  const onOnlineCallback = useCallback((callback: () => void) => {
    onlineCallbacksRef.current.add(callback);
    return () => {
      onlineCallbacksRef.current.delete(callback);
    };
  }, []);

  // Register onOffline callback
  const onOfflineCallback = useCallback((callback: () => void) => {
    offlineCallbacksRef.current.add(callback);
    return () => {
      offlineCallbacksRef.current.delete(callback);
    };
  }, []);

  const value: NetworkStatusContextValue = {
    status,
    isOnline,
    isChecking,
    refresh,
    onOnline: onOnlineCallback,
    onOffline: onOfflineCallback,
  };

  return (
    <NetworkStatusContext.Provider value={value}>
      {children}
    </NetworkStatusContext.Provider>
  );
}

/**
 * useNetworkStatus Hook
 *
 * Access the current network status and register callbacks.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isOnline, status, onOnline } = useNetworkStatus();
 *
 *   useEffect(() => {
 *     return onOnline(() => {
 *       // Sync queued items when coming back online
 *       syncQueue();
 *     });
 *   }, [onOnline]);
 *
 *   if (!isOnline) {
 *     return <OfflineBanner />;
 *   }
 *
 *   return <OnlineContent />;
 * }
 * ```
 */
export function useNetworkStatus(): NetworkStatusContextValue {
  const context = useContext(NetworkStatusContext);

  if (!context) {
    throw new Error(
      'useNetworkStatus must be used within a NetworkStatusProvider'
    );
  }

  return context;
}

/**
 * useIsOnline Hook
 *
 * Simple hook that just returns the online status.
 *
 * @example
 * ```tsx
 * const isOnline = useIsOnline();
 *
 * const handleSubmit = async () => {
 *   if (!isOnline) {
 *     await enqueue('reflection', payload);
 *     return;
 *   }
 *   await submitDirectly();
 * };
 * ```
 */
export function useIsOnline(): boolean {
  const { isOnline } = useNetworkStatus();
  return isOnline;
}

/**
 * useOnlineCallback Hook
 *
 * Register a callback that fires when the app comes back online.
 *
 * @example
 * ```tsx
 * useOnlineCallback(() => {
 *   processOfflineQueue();
 * });
 * ```
 */
export function useOnlineCallback(callback: () => void): void {
  const { onOnline } = useNetworkStatus();

  useEffect(() => {
    return onOnline(callback);
  }, [onOnline, callback]);
}

export default NetworkStatusContext;
