/**
 * Timezone Utilities
 *
 * Provides timezone-aware functionality for consistent date handling
 * across the application. Used to pass timezone context to server-side
 * date calculations so streaks are evaluated in the user's local time.
 *
 * @module timezone
 * @category Date Handling
 */

/**
 * Get the user's IANA timezone string (e.g., "America/Denver").
 * Used to pass timezone context to server-side date calculations
 * so streaks are evaluated in the user's local time, not server UTC.
 *
 * @returns IANA timezone string (e.g., "America/Denver", "UTC")
 *
 * @example
 * getUserTimezone() // "America/Denver" (depends on user device settings)
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}
