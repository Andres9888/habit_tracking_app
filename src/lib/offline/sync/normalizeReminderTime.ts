export function normalizeReminderTime(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;

  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const amPmMatch = /^(\d{1,2}):([0-5]\d)\s*([AaPp][Mm])$/.exec(trimmed);
  if (amPmMatch) {
    const hour = Number.parseInt(amPmMatch[1], 10);
    const minute = amPmMatch[2];
    const period = amPmMatch[3].toUpperCase();
    let normalizedHour = hour;
    if (period === 'PM' && hour < 12) {
      normalizedHour += 12;
    } else if (period === 'AM' && hour === 12) {
      normalizedHour = 0;
    }
    return `${normalizedHour.toString().padStart(2, '0')}:${minute}`;
  }

  const legacyMatch = /^(\d{1,2}):([0-5]\d)$/.exec(trimmed);
  if (!legacyMatch) return undefined;

  const hour = Number.parseInt(legacyMatch[1], 10);
  const minute = Number.parseInt(legacyMatch[2], 10);
  if (
    Number.isNaN(hour) ||
    Number.isNaN(minute) ||
    hour < 0 ||
    hour > 23 ||
    minute < 0 ||
    minute > 59
  ) {
    return undefined;
  }
  return `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`;
}
