/**
 * Connectivity State Types
 *
 * Types for network connectivity awareness.
 */

/**
 * Connectivity state for network awareness
 */
export interface ConnectivityState {
  /** Whether device has network connectivity */
  isConnected: boolean;

  /** Whether connectivity is through a metered connection (mobile data) */
  isMetered?: boolean;

  /** Connection type if available */
  connectionType?: 'wifi' | 'cellular' | 'ethernet' | 'unknown';

  /** Timestamp of last connectivity change */
  lastChangeAt: number;
}
