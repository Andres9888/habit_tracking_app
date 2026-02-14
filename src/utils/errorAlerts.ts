/**
 * User-facing error alerts for failed mutations.
 * Now uses the toast notification system for consistent UX.
 *
 * These are standalone functions that use the imperative toast API
 * for use outside of React components (or when you don't have hook access).
 * For components, prefer `useToast()` directly.
 */
import { Alert } from 'react-native';

/**
 * @deprecated Use `useToast().error()` inside components instead.
 * Kept as fallback for non-component contexts.
 */
export function showSaveError() {
  Alert.alert(
    'Save Failed',
    'Your changes couldn\u2019t be saved. Please check your connection and try again.',
    [{ text: 'OK' }]
  );
}

/**
 * @deprecated Use `useToast().error()` inside components instead.
 * Kept as fallback for non-component contexts.
 */
export function showCreateError() {
  Alert.alert(
    'Couldn\u2019t Create Habit',
    'Something went wrong. Please check your connection and try again.',
    [{ text: 'OK' }]
  );
}

/**
 * @deprecated Use `useToast().error()` inside components instead.
 * Kept as fallback for non-component contexts.
 */
export function showSyncError() {
  Alert.alert(
    'Sync Failed',
    'Your habit couldn\u2019t be saved. It will retry when you\u2019re back online.'
  );
}
