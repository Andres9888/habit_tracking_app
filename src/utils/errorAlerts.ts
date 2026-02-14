/**
 * User-facing error alerts for failed mutations.
 * Keeps mutation handlers lean while providing consistent UX feedback.
 */
import { Alert } from 'react-native';

export function showSaveError(): void {
  Alert.alert(
    'Save Failed',
    'Your changes couldn\u2019t be saved. Please check your connection and try again.',
    [{ text: 'OK' }]
  );
}

export function showCreateError(): void {
  Alert.alert(
    'Couldn\u2019t Create Habit',
    'Something went wrong. Please check your connection and try again.',
    [{ text: 'OK' }]
  );
}

export function showSyncError(): void {
  Alert.alert(
    'Sync Failed',
    'Your habit couldn\u2019t be saved. It will retry when you\u2019re back online.'
  );
}
