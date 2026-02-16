/**
 * NetworkStatusContext Default Values
 *
 * Default context values used before NetworkStatusProvider mounts
 * and for createContext initialization.
 *
 * The defaults assume an optimistic online state (connected, not checking).
 * This prevents showing offline UI during initial app load.
 */

import { NetworkStateType } from 'expo-network';
import type { NetworkStatus, NetworkStatusContextValue } from './types';

/**
 * No-op function for callback registration (used in default context)
 */
const noop = () => {};

/**
 * No-op unsubscribe function (returns no-op)
 */
const noopUnsubscribe = () => noop;

/**
 * Default network status (optimistic: assume connected)
 */
export const defaultNetworkStatus: NetworkStatus = {
  connectionType: NetworkStateType.UNKNOWN,
  isConnected: true,
  isExpensive: false,
  isInternetReachable: null,
  lastStatusChangeAt: Date.now(),
};

/**
 * Default context value (optimistic: assume online)
 *
 * Used as initial value before provider mounts or if used outside provider.
 */
export const defaultContextValue: NetworkStatusContextValue = {
  isChecking: true,
  isOnline: true,
  onOffline: noopUnsubscribe,
  onOnline: noopUnsubscribe,
  refresh: async () => {},
  status: defaultNetworkStatus,
};
