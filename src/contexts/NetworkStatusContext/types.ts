/**
 * NetworkStatusContext Types
 *
 * Type definitions for network connectivity monitoring context.
 * Provides real-time network status and connectivity change callbacks.
 *
 * @see NetworkStatusProvider.tsx for provider implementation
 * @see hooks.ts for convenience hooks
 */

import type { ReactNode } from 'react';
import type { NetworkStateType } from 'expo-network';

/**
 * Network status details
 *
 * Represents the current network connectivity state of the device.
 */
export interface NetworkStatus {
  /** Whether the device has network connectivity (wifi/cellular/ethernet) */
  isConnected: boolean;
  /** Whether the internet is reachable (not just connected to a network) - null if unknown */
  isInternetReachable: boolean | null;
  /** Type of connection (NetworkStateType.WIFI, NetworkStateType.CELLULAR, etc.) */
  connectionType: NetworkStateType | string;
  /** Whether the connection is expensive (cellular data, metered wifi) */
  isExpensive: boolean;
  /** Timestamp (ms since epoch) of last status change */
  lastStatusChangeAt: number;
}

/**
 * Context value interface
 *
 * Provides network status state and callback registration methods.
 */
export interface NetworkStatusContextValue {
  /** Current network status details */
  status: NetworkStatus;
  /** Whether we're online (connected AND internet reachable) */
  isOnline: boolean;
  /** Whether we're currently checking network status */
  isChecking: boolean;
  /** Force a manual refresh of network status */
  refresh: () => Promise<void>;
  /** Register a callback to fire when coming back online - returns unsubscribe function */
  onOnline: (callback: () => void) => () => void;
  /** Register a callback to fire when going offline - returns unsubscribe function */
  onOffline: (callback: () => void) => () => void;
}

/**
 * Provider component props
 */
export interface NetworkStatusProviderProps {
  /** React children to render */
  children: ReactNode;
  /** Optional callback invoked when network status changes */
  onStatusChange?: (status: NetworkStatus) => void;
  /** Whether to automatically refresh status when app comes to foreground (default: true) */
  refreshOnFocus?: boolean;
}
