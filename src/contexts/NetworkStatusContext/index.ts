/**
 * NetworkStatusContext - Barrel Export
 *
 * React Context for monitoring network connectivity status.
 * Provides real-time network state, online/offline callbacks, and sync integration.
 *
 * **Quick Start:**
 * ```tsx
 * // 1. Add provider to app root
 * <NetworkStatusProvider>
 *   <App />
 * </NetworkStatusProvider>
 *
 * // 2. Use hooks in any component
 * const isOnline = useIsOnline();
 * const { status, refresh } = useNetworkStatus();
 *
 * // 3. Register callbacks for connectivity changes
 * useOnlineCallback(() => {
 *   console.log('Back online!');
 * });
 * ```
 *
 * @module NetworkStatusContext
 */

// Provider & Context
export {
  NetworkStatusProvider,
  NetworkStatusContext,
  default,
} from './NetworkStatusProvider';

// Hooks
export { useNetworkStatus, useIsOnline, useOnlineCallback } from './hooks';
export { useNetworkSync } from './useNetworkSync';

// Types
export type {
  NetworkStatus,
  NetworkStatusContextValue,
  NetworkStatusProviderProps,
} from './types';
export type {
  UseNetworkSyncOptions,
  UseNetworkSyncReturn,
} from './useNetworkSync.types';
