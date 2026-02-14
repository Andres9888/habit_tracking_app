/**
 * User-facing error alerts for failed mutations.
<<<<<<< HEAD
 * Keeps mutation handlers lean while providing consistent UX feedback.
 *
 * All alerts now accept an optional `onRetry` callback so users can
 * recover from transient failures without navigating away.
=======
 * Now uses the toast notification system for consistent UX.
 *
 * These are standalone functions that use the imperative toast API
 * for use outside of React components (or when you don't have hook access).
 * For components, prefer `useToast()` directly.
>>>>>>> b9378cd5 (feat(ui): add app-wide toast notification system)
 */
import { Alert } from 'react-native';
import { ERROR_MESSAGES } from '../constants/errorMessages';

/**
<<<<<<< HEAD
 * Show an alert for save failures.
 * @param onRetry - Optional callback to retry the failed action
 */
export function showSaveError(onRetry?: () => void) {
=======
 * @deprecated Use `useToast().error()` inside components instead.
 * Kept as fallback for non-component contexts.
 */
export function showSaveError() {
>>>>>>> b9378cd5 (feat(ui): add app-wide toast notification system)
  Alert.alert(
    'Save Failed',
    ERROR_MESSAGES.DATA_OPS.SAVE_FAILED,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

/**
<<<<<<< HEAD
 * Show an alert for habit creation failures.
 * @param onRetry - Optional callback to retry the failed action
 */
export function showCreateError(onRetry?: () => void) {
=======
 * @deprecated Use `useToast().error()` inside components instead.
 * Kept as fallback for non-component contexts.
 */
export function showCreateError() {
>>>>>>> b9378cd5 (feat(ui): add app-wide toast notification system)
  Alert.alert(
    "Couldn't Create Habit",
    ERROR_MESSAGES.DATA_OPS.CREATE_HABIT_FAILED,
    onRetry
      ? [{ text: 'Cancel', style: 'cancel' }, { text: 'Retry', onPress: onRetry }]
      : [{ text: 'OK' }]
  );
}

/**
<<<<<<< HEAD
 * Show an alert for sync failures (offline mode).
 * @param onRetry - Optional callback to retry immediately
 */
export function showSyncError(onRetry?: () => void) {
=======
 * @deprecated Use `useToast().error()` inside components instead.
 * Kept as fallback for non-component contexts.
 */
export function showSyncError() {
>>>>>>> b9378cd5 (feat(ui): add app-wide toast notification system)
  Alert.alert(
    'Sync Failed',
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
    'Something Went Wrong',
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
    'Connection Issue',
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
