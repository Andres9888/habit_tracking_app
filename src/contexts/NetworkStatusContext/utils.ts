/**
 * NetworkStatus utility functions
 */

import { NetworkStateType, type NetworkState } from 'expo-network';
import type { NetworkStatus } from './types';

/**
 * Convert expo-network state to our NetworkStatus format
 */
export function networkStateToStatus(state: NetworkState): NetworkStatus {
  return {
    connectionType: state.type ?? 'unknown',
    isConnected: state.isConnected ?? false,
    // expo-network doesn't expose isConnectionExpensive, assume cellular is expensive
    isExpensive: state.type === NetworkStateType.CELLULAR,
    isInternetReachable: state.isInternetReachable ?? null,
    lastStatusChangeAt: Date.now(),
  };
}

// Re-export for type compatibility

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

export { type NetworkState, type NetworkStateType } from 'expo-network';
