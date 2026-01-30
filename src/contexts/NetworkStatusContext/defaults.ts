/**
 * NetworkStatus default values
 */

import { NetInfoStateType } from '@react-native-community/netinfo';
import type { NetworkStatus, NetworkStatusContextValue } from './types';

// No-op functions for default context
const noop = () => {};
const noopUnsubscribe = () => noop;

export const defaultNetworkStatus: NetworkStatus = {
  connectionType: NetInfoStateType.unknown,
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
