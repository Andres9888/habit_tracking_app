/**
 * NetworkStatus default values
 */

import { NetworkStateType } from 'expo-network';
import type { NetworkStatus, NetworkStatusContextValue } from './types';

// No-op functions for default context
const noop = () => {};
const noopUnsubscribe = () => noop;

export const defaultNetworkStatus: NetworkStatus = {
  connectionType: NetworkStateType.UNKNOWN,
  isConnected: true,
  isExpensive: false,
  isInternetReachable: null,
  lastStatusChangeAt: Date.now(),
};

export const defaultContextValue: NetworkStatusContextValue = {
  isChecking: true,
  isOnline: true,
  onOffline: noopUnsubscribe,
  onOnline: noopUnsubscribe,
  refresh: async () => {},
  status: defaultNetworkStatus,
};
