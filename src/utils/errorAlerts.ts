/**
 * User-facing error alerts for failed mutations.
 * Keeps mutation handlers lean while providing consistent UX feedback.
 *
 * All alerts now accept an optional `onRetry` callback so users can
 * recover from transient failures without navigating away.
 */
import { Alert } from 'react-native';
import { ERROR_MESSAGES } from '../constants/errorMessages';

export function showSaveError(onRetry?: () => void) {
  Alert.alert(
    'Save Failed',
    ERROR_MESSAGES.DATA_OPS.SAVE_FAILED,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

export function showCreateError(onRetry?: () => void) {
  Alert.alert(
    "Couldn't Create Habit",
    ERROR_MESSAGES.DATA_OPS.CREATE_HABIT_FAILED,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

export function showSyncError(onRetry?: () => void) {
  Alert.alert(
    'Sync Failed',
    ERROR_MESSAGES.SYNC.FAILED,
    onRetry
      ? [{ text: 'OK' }, { text: 'Retry Now', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

export function showGenericError(message?: string, onRetry?: () => void) {
  Alert.alert(
    'Something Went Wrong',
    message || ERROR_MESSAGES.UI.GENERIC_ERROR,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

export function showNetworkError(onRetry?: () => void) {
  Alert.alert(
    'Connection Issue',
    ERROR_MESSAGES.NETWORK.CONNECTION_ISSUE,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

export function showRetryableError(message: string, onRetry?: () => void) {
  Alert.alert(
    'Error',
    message,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' as const }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}
