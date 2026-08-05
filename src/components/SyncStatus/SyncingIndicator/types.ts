/**
 * SyncingIndicator Types
 *
 * Type definitions for the syncing status indicator.
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 2:
 * "Given pending completions, When viewing habit, Then subtle 'pending' indicator shows"
 */

import type { ViewStyle, StyleProp } from 'react-native';

/**
 * Props for SyncingIndicator component
 */
export interface SyncingIndicatorProps {
  /** Whether the indicator is visible (typically when syncing) */
  visible?: boolean;

  /** Number of pending operations to display (optional) */
  pendingCount?: number;

  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;
}

/**
 * Internal animation state for the syncing indicator
 */
export interface SyncingIndicatorAnimationState {
  /** Whether the spinner animation is running */
  isSpinning: boolean;
  /** Current rotation angle (0-360) */
  rotationAngle: number;
}
