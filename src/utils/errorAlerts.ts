/**
 * User-facing error alerts for failed mutations.
 * Keeps mutation handlers lean while providing consistent UX feedback.
 */
import { Alert } from 'react-native';

export function showSaveError() {
  Alert.alert(
    'Save Failed',
    'Your changes couldn\u2019t be saved. Please check your connection and try again.',
    [{ text: 'OK' }]
  );
}

export function showCreateError() {
  Alert.alert(
    'Couldn\u2019t Create Habit',
    'Something went wrong. Please check your connection and try again.',
    [{ text: 'OK' }]
  );
}

export function showSyncError() {
  Alert.alert(
    'Sync Failed',
    'Your habit couldn\u2019t be saved. It will retry when you\u2019re back online.'
  );
}

export function showGenericError(message?: string) {
  Alert.alert(
    'Something Went Wrong',
    message || 'An unexpected error occurred. Please try again.',
    [{ text: 'OK' }]
  );
}

export function showNetworkError() {
  Alert.alert(
    'Connection Issue',
    'Please check your internet connection and try again.',
    [{ text: 'OK' }]
  );
}

export function showRetryableError(message: string, onRetry?: () => void) {
  const buttons = [{ text: 'OK' }];
  if (onRetry) {
    buttons.unshift({ text: 'Retry', onPress: onRetry });
  }
  Alert.alert('Error', message, buttons);
}
