/**
 * OfflineIndicator Types
 *
 * Type definitions for the subtle offline status indicator.
 * Implements US3 (Visual Sync Status Indicators) acceptance criteria 1.
 */

import type { ViewStyle, StyleProp } from 'react-native';

/**
 * Props for OfflineIndicator component
 */
export interface OfflineIndicatorProps {
  /** Whether the indicator is visible (typically when offline) */
  visible?: boolean;

  /** Custom style for the container */
  style?: StyleProp<ViewStyle>;

  /** Test ID for testing */
  testID?: string;
}

/**
 * Internal animation state
 */
export interface OfflineIndicatorAnimationState {
  /** Whether visibility animation is complete */
  isAnimating: boolean;
}
