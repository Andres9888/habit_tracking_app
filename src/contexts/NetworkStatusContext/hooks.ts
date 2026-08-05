/**
 * NetworkStatus Hooks
 */

import { useContext, useEffect } from 'react';
import { NetworkStatusContext } from './context';
import type { NetworkStatusContextValue } from './types';

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
      'UseNetworkStatus must be used within a NetworkStatusProvider'
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
