/**
 * SyncedToast Types
 *
 * Type definitions for the SyncedToast component that displays
 * a brief confirmation when sync completes successfully.
 */

import type { ViewStyle } from 'react-native';

export interface SyncedToastProps {
  /** Override visibility (default: controlled by sync completion) */
  visible?: boolean;
  /** Number of operations that were synced (optional) */
  syncedCount?: number;
  /** Auto-dismiss duration in ms (default: 2000) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss?: () => void;
  /** Custom style for the toast container */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

export interface UseSyncedToastOptions {
  /** Duration before auto-dismiss in ms (default: 2000) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss?: () => void;
  /** Whether to show toast (allows external control) */
  enabled?: boolean;
}

export interface UseSyncedToastResult {
  /** Whether the toast should be visible */
  visible: boolean;
  /** Number of operations synced in last sync */
  syncedCount: number;
  /** Manually dismiss the toast */
  dismiss: () => void;
  /** Manually show the toast (for testing) */
  show: (count?: number) => void;
}
