/**
 * PendingSyncBadge Types
 *
 * Type definitions for the pending sync badge indicator.
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 2:
 * "Given pending completions, When viewing habit, Then subtle 'pending' indicator shows"
 */

import type { ViewStyle, StyleProp } from 'react-native';

/**
 * Props for PendingSyncBadge component
 */
export interface PendingSyncBadgeProps {
  /** Whether the badge is visible (typically when habit has pending operations) */
  visible?: boolean;

  /** Badge size variant */
  size?: 'small' | 'medium';

  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;
}

/**
 * Hook options for usePendingSyncBadge
 */
export interface UsePendingSyncBadgeOptions {
  visible: boolean;
}

/**
 * Hook result for usePendingSyncBadge
 */
export interface UsePendingSyncBadgeResult {
  animatedStyle: { opacity: number; transform: { scale: number }[] };
  shouldRender: boolean;
}
