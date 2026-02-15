/**
 * User-facing error alerts for failed mutations.
 * Keeps mutation handlers lean while providing consistent UX feedback.
 *
 * All alerts now accept an optional `onRetry` callback so users can
 * recover from transient failures without navigating away.
 */
import { Alert } from 'react-native';

export function showSaveError(onRetry?: () => void) {
  Alert.alert(
    'Save Failed',
    'Your changes couldn\u2019t be saved. Please check your connection and try again.',
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

export function showCreateError(onRetry?: () => void) {
  Alert.alert(
    'Couldn\u2019t Create Habit',
    'Something went wrong. Please check your connection and try again.',
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

export function showSyncError(onRetry?: () => void) {
  Alert.alert(
    'Sync Failed',
    'Your habit couldn\u2019t be saved. It will retry when you\u2019re back online.',
    onRetry
      ? [{ text: 'OK' }, { text: 'Retry Now', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

export function showGenericError(message?: string, onRetry?: () => void) {
  Alert.alert(
    'Something Went Wrong',
    message || 'An unexpected error occurred. Please try again.',
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

export function showNetworkError(onRetry?: () => void) {
  Alert.alert(
    'Connection Issue',
    'Please check your internet connection and try again.',
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
