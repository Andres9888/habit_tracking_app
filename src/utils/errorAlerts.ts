/**
 * User-facing error alerts for failed mutations.
 * Keeps mutation handlers lean while providing consistent UX feedback.
 *
 * All alerts now accept an optional `onRetry` callback so users can
 * recover from transient failures without navigating away.
 */
import { Alert, AlertButton } from 'react-native';
import { ERROR_MESSAGES } from '../constants/errorMessages';

/**
 * Helper to build alert buttons with optional retry action.
 * @param onRetry - Optional callback to retry the failed action
 * @param retryButtonLabel - Label for retry button (default: 'Retry')
 * @returns Array of alert buttons
 */
function buildAlertButtons(
  onRetry?: () => void,
  retryButtonLabel: string = 'Retry',
): AlertButton[] {
  if (!onRetry) {
    return [{ text: 'OK' }];
  }

  return [
    { text: 'Cancel', style: 'cancel' },
    { text: retryButtonLabel, onPress: onRetry },
  ];
}

/**
 * Show an alert for save failures.
 * @param onRetry - Optional callback to retry the failed action
 */
export function showSaveError(onRetry?: () => void) {
  Alert.alert(
    'Save Failed',
    ERROR_MESSAGES.DATA_OPS.SAVE_FAILED,
    buildAlertButtons(onRetry),
  );
}

/**
 * Show an alert for habit creation failures.
 * @param onRetry - Optional callback to retry the failed action
 */
export function showCreateError(onRetry?: () => void) {
  Alert.alert(
    "Couldn't Create Habit",
    ERROR_MESSAGES.DATA_OPS.CREATE_HABIT_FAILED,
    buildAlertButtons(onRetry),
  );
}

/**
 * Show an alert for sync failures (offline mode).
 * @param onRetry - Optional callback to retry immediately
 */
export function showSyncError(onRetry?: () => void) {
  Alert.alert(
    'Sync Failed',
    ERROR_MESSAGES.SYNC.FAILED,
    onRetry
      ? [{ text: 'OK' }, { text: 'Retry Now', onPress: onRetry }]
      : [{ text: 'OK' }],
  );
}

/**
 * Show a generic error alert with custom message.
 * @param message - Custom error message to display
 * @param onRetry - Optional callback to retry the failed action
 */
export function showGenericError(message?: string, onRetry?: () => void) {
  Alert.alert(
    'Something Went Wrong',
    message || ERROR_MESSAGES.UI.GENERIC_ERROR,
    buildAlertButtons(onRetry),
  );
}

/**
 * Show an alert for network/connection issues.
 * @param onRetry - Optional callback to retry the failed action
 */
export function showNetworkError(onRetry?: () => void) {
  Alert.alert(
    'Connection Issue',
    ERROR_MESSAGES.NETWORK.CONNECTION_ISSUE,
    buildAlertButtons(onRetry),
  );
}

/**
 * Show a retryable error alert with custom message.
 * @param message - Error message to display
 * @param onRetry - Optional callback to retry the failed action
 */
export function showRetryableError(message: string, onRetry?: () => void) {
  Alert.alert(
    'Error',
    message,
    buildAlertButtons(onRetry),
  );
}
