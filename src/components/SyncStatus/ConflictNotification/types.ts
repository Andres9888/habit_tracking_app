/**
 * ConflictNotification Types
 *
 * Type definitions for the ConflictNotification component that displays
 * an informational notification when sync conflicts are detected and resolved.
 *
 * Implements US4 (Graceful Conflict Resolution) acceptance criteria 2:
 * "Given conflict occurs, When user notified, Then informational only, no action required"
 */

import type { ViewStyle } from 'react-native';

export interface ConflictNotificationProps {
  /** Override visibility (default: controlled by conflict events) */
  visible?: boolean;
  /** Number of conflicts that were resolved */
  conflictCount?: number;
  /** Auto-dismiss duration in ms (default: 3000) */
  duration?: number;
  /** Callback when notification is dismissed */
  onDismiss?: () => void;
  /** Custom style for the notification container */
  style?: ViewStyle;
  /** Test ID for testing */
  testID?: string;
}

export interface UseConflictNotificationOptions {
  /** Duration before auto-dismiss in ms (default: 3000) */
  duration?: number;
  /** Callback when notification is dismissed */
  onDismiss?: () => void;
  /** Whether to show notification (allows external control) */
  enabled?: boolean;
}

export interface UseConflictNotificationResult {
  /** Whether the notification should be visible */
  visible: boolean;
  /** Number of conflicts resolved in last sync */
  conflictCount: number;
  /** Manually dismiss the notification */
  dismiss: () => void;
  /** Manually show the notification (for testing) */
  show: (count?: number) => void;
}
