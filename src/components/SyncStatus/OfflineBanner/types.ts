/**
 * OfflineBanner Types
 */

import type { ViewStyle } from 'react-native';

export interface OfflineBannerProps {
  /**
   * Whether the banner should be visible
   */
  visible?: boolean;

  /**
   * Number of pending items in the offline queue
   */
  pendingCount?: number;

  /**
   * Whether sync is currently in progress
   */
  isSyncing?: boolean;

  /**
   * Callback when sync button is pressed
   */
  onSyncPress?: () => void;

  /**
   * Custom style override
   */
  style?: ViewStyle;

  /**
   * Test ID for testing
   */
  testID?: string;
}

export interface OfflineBannerLogicReturn {
  shouldRender: boolean;
  displayText: string;
}
