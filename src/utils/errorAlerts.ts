/**
 * User-facing error alerts for failed mutations.
 * Keeps mutation handlers lean while providing consistent UX feedback.
 *
 * All alerts now accept an optional `onRetry` callback so users can
 * recover from transient failures without navigating away.
 */
import { Alert } from 'react-native';
import { ERROR_MESSAGES } from '../constants/errorMessages';

/**
 * Show an alert for save failures.
 * @param onRetry - Optional callback to retry the failed action
 */
export function showSaveError(onRetry?: () => void) {
  Alert.alert(
    "Couldn't save your changes",
    ERROR_MESSAGES.DATA_OPS.SAVE_FAILED,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

/**
 * Show an alert for habit creation failures.
 * @param onRetry - Optional callback to retry the failed action
 */
export function showCreateError(onRetry?: () => void) {
  Alert.alert(
    "Couldn't create habit",
    ERROR_MESSAGES.DATA_OPS.CREATE_HABIT_FAILED,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

/**
 * Show an alert for sync failures (offline mode).
 * @param onRetry - Optional callback to retry immediately
 */
export function showSyncError(onRetry?: () => void) {
  Alert.alert(
    'Sync issue',
    ERROR_MESSAGES.SYNC.FAILED,
    onRetry
      ? [{ text: 'OK' }, { text: 'Retry Now', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

/**
 * Show a generic error alert with custom message.
 * @param message - Custom error message to display
 * @param onRetry - Optional callback to retry the failed action
 */
export function showGenericError(message?: string, onRetry?: () => void) {
  Alert.alert(
    'Something went wrong',
    message || ERROR_MESSAGES.UI.GENERIC_ERROR,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

/**
 * Show an alert for network/connection issues.
 * @param onRetry - Optional callback to retry the failed action
 */
export function showNetworkError(onRetry?: () => void) {
  Alert.alert(
    'Connection problem',
    ERROR_MESSAGES.NETWORK.CONNECTION_ISSUE,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
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
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' as const }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

/**
 * Show an alert for operations taking too long (>5 seconds).
 * @param onKeepWaiting - Optional callback to keep waiting
 * @param onCancel - Optional callback to cancel the operation
 */
export function showTimeoutWarning(onKeepWaiting?: () => void, onCancel?: () => void) {
  const buttons = [];
  if (onCancel) {
    buttons.push({ text: 'Cancel', style: 'cancel' as const, onPress: onCancel });
  }
  if (onKeepWaiting) {
    buttons.push({ text: 'Keep Waiting', onPress: onKeepWaiting });
  } else {
    buttons.push({ text: 'OK' });
  }

  Alert.alert(
    'Taking longer than usual',
    "This is taking a while. You can continue using the app — we'll keep trying in the background.",
    buttons
  );
}
