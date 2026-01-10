/**
 * NetworkStatus utility functions
 */

import type { NetInfoState } from '@react-native-community/netinfo';
import type { NetworkStatus } from './types';

/**
 * Convert NetInfo state to our NetworkStatus format
 */
export function netInfoToStatus(state: NetInfoState): NetworkStatus {
  return {
    connectionType: state.type,
    isConnected: state.isConnected ?? false,
    isExpensive: state.details?.isConnectionExpensive ?? false,
    isInternetReachable: state.isInternetReachable,
    lastStatusChangeAt: Date.now(),
  };
}

/**
 * Determine if we're truly online
 * We need both connectivity AND internet reachability
 */
export function calculateIsOnline(status: NetworkStatus): boolean {
  // Must be connected
  if (!status.isConnected) return false;

  // If we don't know about internet reachability, assume online if connected
  if (status.isInternetReachable === null) return status.isConnected;

  // Otherwise, use the internet reachability status
  return status.isInternetReachable;
}
