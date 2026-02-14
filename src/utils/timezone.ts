/**
 * Get the user's IANA timezone string (e.g., "America/Denver").
 * Used to pass timezone context to server-side date calculations
 * so streaks are evaluated in the user's local time, not server UTC.
 */
export function getUserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return 'UTC';
  }
}
