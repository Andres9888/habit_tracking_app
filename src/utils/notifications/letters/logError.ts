type LetterNotificationOperation =
  | 'scheduleLetterUnlockNotification'
  | 'getScheduledLetterUnlockNotifications'
  | 'cancelLetterUnlockNotification';

/**
 * Standardized dev-only error logger for letter notification operations.
 */
export function logLetterNotificationError(
  operation: LetterNotificationOperation,
  error: unknown,
  context?: Record<string, unknown>
): void {
  if (!__DEV__) {
    return;
  }

  console.error(`${operation} failed`, {
    ...context,
    error,
  });
}
