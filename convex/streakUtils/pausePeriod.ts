/**
 * Pause-window helpers for streak and strength.
 *
 * Completions on the pause-start calendar day are kept. Later days inside the
 * pause do not count as misses. A stale resumedAt before pausedAt means the
 * habit is currently paused (re-pause after resume).
 */
export interface PauseInfo {
  pausedAt?: number;
  resumedAt?: number;
  timezone?: string;
}

function msToDateKey(ms: number, timezone?: string): string {
  if (!timezone) return new Date(ms).toISOString().slice(0, 10);
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      day: '2-digit',
      month: '2-digit',
      timeZone: timezone,
      year: 'numeric',
    }).formatToParts(new Date(ms));
    const year = parts.find((part) => part.type === 'year')?.value ?? '';
    const month = parts.find((part) => part.type === 'month')?.value ?? '';
    const day = parts.find((part) => part.type === 'day')?.value ?? '';
    return `${year}-${month}-${day}`;
  } catch {
    return new Date(ms).toISOString().slice(0, 10);
  }
}

export function isCurrentlyPaused(pauseInfo?: PauseInfo): boolean {
  if (!pauseInfo?.pausedAt) return false;
  return (
    pauseInfo.resumedAt === undefined ||
    pauseInfo.resumedAt < pauseInfo.pausedAt
  );
}

function pauseStartKey(pauseInfo: PauseInfo): string {
  return msToDateKey(pauseInfo.pausedAt as number, pauseInfo.timezone);
}

function pauseEndKey(pauseInfo: PauseInfo): string | undefined {
  if (isCurrentlyPaused(pauseInfo) || pauseInfo.resumedAt === undefined) {
    return undefined;
  }
  return msToDateKey(pauseInfo.resumedAt, pauseInfo.timezone);
}

export function isPausedMissDay(date: string, pauseInfo?: PauseInfo): boolean {
  if (!pauseInfo?.pausedAt) return false;
  const start = pauseStartKey(pauseInfo);
  const end = pauseEndKey(pauseInfo);
  if (end === undefined) return date >= start;
  return date >= start && date < end;
}

export function isCompletionHiddenByPause(
  date: string,
  pauseInfo?: PauseInfo
): boolean {
  if (!pauseInfo?.pausedAt) return false;
  const start = pauseStartKey(pauseInfo);
  const end = pauseEndKey(pauseInfo);
  if (end === undefined) return date > start;
  return date > start && date < end;
}

export function shiftDateKey(dateKey: string, days: number): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day + days);
  const nextYear = date.getFullYear();
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getDate()).padStart(2, '0');
  return `${nextYear}-${nextMonth}-${nextDay}`;
}

export function countPausedDaysBetween(
  startExclusive: string,
  endInclusive: string,
  pauseInfo?: PauseInfo
): number {
  if (!pauseInfo?.pausedAt || startExclusive >= endInclusive) return 0;
  let count = 0;
  for (
    let cursor = shiftDateKey(startExclusive, 1);
    cursor <= endInclusive;
    cursor = shiftDateKey(cursor, 1)
  ) {
    if (isPausedMissDay(cursor, pauseInfo)) count += 1;
  }
  return count;
}
