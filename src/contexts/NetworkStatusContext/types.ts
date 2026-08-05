/**
 * NetworkStatusContext Types
 */

import type { ReactNode } from 'react';
import type { NetworkStateType } from 'expo-network';

/**
 * Network status details
 */
export interface NetworkStatus {
  /** Whether the device has network connectivity */
  isConnected: boolean;
  /** Whether the internet is reachable (not just connected to a network) */
  isInternetReachable: boolean | null;
  /** Type of connection (wifi, cellular, none, etc.) */
  connectionType: NetworkStateType | string;
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
