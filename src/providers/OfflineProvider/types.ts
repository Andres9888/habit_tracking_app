/**
 * OfflineProvider Types
 *
 * Types for the offline queue provider and context.
 */

import type { ReactNode } from 'react';

/**
 * Value provided by the OfflineProvider context
 */
export interface OfflineContextValue {
  /** Whether the queue has been restored from storage */
  isRestored: boolean;
  /** Whether restoration is currently in progress */
  isRestoring: boolean;
  /** Error that occurred during restoration, if any */
  restorationError: Error | null;
  /** Manually trigger queue restoration (useful after auth changes) */
  restoreQueue: () => Promise<void>;
}

/**
 * Props for the OfflineProvider component
 */
export interface OfflineProviderProps {
  children: ReactNode;
  /** Skip auto-restoration on mount (useful for testing) */
  skipAutoRestore?: boolean;
}
