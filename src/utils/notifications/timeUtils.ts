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
 */
export function parseTimeString(time: string): {
  hours: number;
  minutes: number;
} {
  const [hours, minutes] = time.split(':').map(Number);
  return { hours, minutes };
}

// Re-export from separate module for backwards compatibility
export {
  formatRelativeTime,
  getNextReminderRelativeTime,
} from './relativeTimeFormatter';
