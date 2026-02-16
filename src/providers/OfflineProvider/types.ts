/**
 * OfflineProvider Types
 *
 * Type definitions for offline queue restoration provider.
 * Provides context for monitoring queue restoration state during app startup.
 *
 * @see OfflineProvider.tsx for provider implementation
 * @see docs/offline-habit-sync.md for offline architecture details
 */

import type { ReactNode } from 'react';

/**
 * Context value provided by OfflineProvider
 *
 * Exposes restoration state and manual restoration trigger.
 */
export interface OfflineContextValue {
  /** Whether the offline queue has been successfully restored from AsyncStorage */
  isRestored: boolean;
  /** Whether queue restoration is currently in progress */
  isRestoring: boolean;
  /** Error that occurred during restoration, if any */
  restorationError: Error | null;
  /** Manually trigger queue restoration (useful after auth changes or errors) */
  restoreQueue: () => Promise<void>;
}

/**
 * Props for the OfflineProvider component
 */
export interface OfflineProviderProps {
  /** React children to render */
  children: ReactNode;
  /** Skip automatic restoration on mount (useful for testing scenarios) */
  skipAutoRestore?: boolean;
}
