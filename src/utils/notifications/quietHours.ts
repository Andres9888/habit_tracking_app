/**
 * Quiet Hours
 *
 * Respects user's quiet time (default 10 PM – 7 AM). Notifications
 * scheduled within quiet hours are deferred to the next allowed window.
 *
 * Built by Opus.
 */

export interface QuietHoursConfig {
  /** Start of quiet hours (hour, 0-23). Default: 22 (10 PM) */
  startHour: number;
  /** End of quiet hours (hour, 0-23). Default: 7 (7 AM) */
  endHour: number;
  /** Whether quiet hours are enabled. Default: true */
  enabled: boolean;
}

export const DEFAULT_QUIET_HOURS: QuietHoursConfig = {
  startHour: 22,
  endHour: 7,
  enabled: true,
};

let _config: QuietHoursConfig = { ...DEFAULT_QUIET_HOURS };

/**
 * Update the quiet hours configuration.
 */
export function setQuietHoursConfig(config: Partial<QuietHoursConfig>): void {
  _config = { ..._config, ...config };
}

/**
 * Get the current quiet hours configuration.
 */
export function getQuietHoursConfig(): QuietHoursConfig {
  return { ..._config };
}

/**
 * Check if a given time falls within quiet hours.
 * Handles overnight ranges (e.g. 22:00 – 07:00).
 */
export function isWithinQuietHours(
  hour: number,
  minute: number = 0,
  config: QuietHoursConfig = _config
): boolean {
  if (!config.enabled) return false;

  const timeInMinutes = hour * 60 + minute;
  const startInMinutes = config.startHour * 60;
  const endInMinutes = config.endHour * 60;

  // Overnight range (e.g. 22:00 → 07:00)
  if (startInMinutes > endInMinutes) {
    return timeInMinutes >= startInMinutes || timeInMinutes < endInMinutes;
  }

  // Same-day range (e.g. 13:00 → 15:00) — unusual but supported
  return timeInMinutes >= startInMinutes && timeInMinutes < endInMinutes;
}

/**
 * Clamp a notification time to respect quiet hours.
 * If the time falls within quiet hours, returns the end of quiet hours.
 * Otherwise returns the original time.
 */
export function clampToQuietHours(
  hour: number,
  minute: number = 0,
  config: QuietHoursConfig = _config
): { hour: number; minute: number } {
  if (!isWithinQuietHours(hour, minute, config)) {
    return { hour, minute };
  }
  // Defer to end of quiet hours
  return { hour: config.endHour, minute: 0 };
}
