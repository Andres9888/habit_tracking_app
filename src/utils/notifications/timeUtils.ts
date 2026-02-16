function defaultReminderTime(): Date {
  const date = new Date();
  date.setHours(14, 0, 0, 0);
  return date;
}

export function createDateFromTimeString(time?: string, fallback?: Date): Date {
  const base = fallback ?? defaultReminderTime();

  if (!time) {
    return base;
  }

  const trimmed = time.trim();

  const amPmMatch = trimmed.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (amPmMatch) {
    let hour = Number.parseInt(amPmMatch[1], 10);
    const minute = Number.parseInt(amPmMatch[2], 10);
    const period = amPmMatch[3].toUpperCase();

    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      return base;
    }

    if (period === 'PM' && hour < 12) {
      hour += 12;
    } else if (period === 'AM' && hour === 12) {
      hour = 0;
    }

    const result = new Date();
    result.setHours(hour, minute, 0, 0);
    return result;
  }

  const twentyFourHourMatch = trimmed.match(/^(\d{1,2}):(\d{2})$/);
  if (twentyFourHourMatch) {
    const hour = Number.parseInt(twentyFourHourMatch[1], 10);
    const minute = Number.parseInt(twentyFourHourMatch[2], 10);

    if (
      Number.isNaN(hour) ||
      Number.isNaN(minute) ||
      hour < 0 ||
      hour > 23 ||
      minute < 0 ||
      minute > 59
    ) {
      return base;
    }

    const result = new Date();
    result.setHours(hour, minute, 0, 0);
    return result;
  }

  return base;
}

export function formatReminderTime(date: Date): string {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');

  return `${displayHours}:${displayMinutes} ${period}`;
}

export function getDefaultReminderTime(): Date {
  return new Date(defaultReminderTime());
}

/**
 * Parse HH:MM time string to hours and minutes
 * Returns default values (0, 0) if parsing fails
 */
export function parseTimeString(time: string): {
  hours: number;
  minutes: number;
} {
  if (!time || typeof time !== 'string') {
    return { hours: 0, minutes: 0 };
  }

  const parts = time.split(':');
  if (parts.length < 2) {
    return { hours: 0, minutes: 0 };
  }

  const hours = Number(parts[0]);
  const minutes = Number(parts[1]);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return { hours: 0, minutes: 0 };
  }

  // Clamp to valid ranges
  return {
    hours: Math.max(0, Math.min(23, hours)),
    minutes: Math.max(0, Math.min(59, minutes)),
  };
}

/**
 * Normalize reminder time to avoid DST edge cases
 *
 * DST transitions can cause issues with scheduled notifications:
 * - Spring forward (2am → 3am): Times between 2-3am don't exist
 * - Fall back (2am → 1am): Times between 1-2am occur twice
 *
 * This function detects potential DST issues and adjusts times safely.
 */
export function normalizeDSTTime(date: Date): Date {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // DST transitions typically happen at 2am
  // Avoid scheduling notifications during the DST transition window (1am-3am)
  // This is a conservative approach that works across most timezones
  const isDSTRiskWindow = hours >= 1 && hours <= 3;

  if (isDSTRiskWindow) {
    // Shift to 9am as safe default
    const safeCopy = new Date(date);
    safeCopy.setHours(9, 0, 0, 0);

    if (__DEV__) {
      console.warn(
        `Reminder time ${hours}:${minutes.toString().padStart(2, '0')} is in DST risk window (1am-3am). Adjusted to 9:00 AM for reliability.`
      );
    }

    return safeCopy;
  }

  return date;
}

/**
 * Validate that a reminder time is sensible
 * Returns error message if invalid, null if valid
 */
export function validateReminderTime(date: Date): string | null {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return 'Invalid time';
  }

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return 'Time out of valid range';
  }

  // Warn about very early morning times (potential user error)
  if (hours >= 0 && hours <= 4) {
    return null; // Valid but unusual - let user decide
  }

  // Warn about very late night (potential user error)
  if (hours >= 23) {
    return null; // Valid but unusual - let user decide
  }

  return null;
}

// Note: formatRelativeTime and getNextReminderRelativeTime are in ./relativeTimeFormatter.ts
// Import them directly from there to avoid circular dependencies
