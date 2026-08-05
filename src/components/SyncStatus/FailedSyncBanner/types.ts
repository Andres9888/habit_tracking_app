/**
 * FailedSyncBanner Types
 *
 * A banner surfaced when one or more queued changes have permanently failed
 * to sync, offering Retry / Discard actions.
 */

import type { StyleProp, ViewStyle } from 'react-native';

export interface FailedSyncBannerProps {
  /** Override visibility (defaults to controlled by sync status) */
  visible?: boolean;
  /** Number of failed operations (drives the copy) */
  failedCount?: number;
  /** Whether a retry is currently in flight (disables buttons) */
  isRetrying?: boolean;
  /** Called when the user taps Retry */
  onRetry?: () => void;
  /** Called when the user confirms Discard */
  onDiscard?: () => void;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Test ID for testing */
  testID?: string;
}

export interface UseFailedSyncBannerResult {
  /** Whether the banner should render */
  visible: boolean;
  /** Number of failed operations */
  failedCount: number;
  /** Whether a retry is in flight */
  isRetrying: boolean;
  /** Retry all failed operations (guards against double-tap) */
  handleRetry: () => void;
  /** Confirm-then-discard all failed operations */
  handleDiscard: () => void;
}
