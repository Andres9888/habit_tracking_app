import { useMemo, useRef } from 'react';
import { addDays, eachDayOfInterval, format, parseISO } from 'date-fns';

// Fetch a buffer of history beyond the visible week so navigating within the
// buffer reuses the same Convex subscription — no refetch, no second list
// re-render. The window only ever grows backward, expanding when the user
// scrolls before the buffer.
const WINDOW_BUFFER_DAYS = 90;
const DATE_FMT = 'yyyy-MM-dd';

function buildWindowDateStrings(startDate: string, endDate: string): string[] {
  if (!startDate || !endDate) return [];
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    return [];
  }
  return eachDayOfInterval({ end, start }).map((d) => format(d, DATE_FMT));
}

/**
 * Stable, monotonically-growing tracking query window. Anchored to today plus a
 * fixed buffer so ordinary week-to-week navigation never changes the query args
 * (and therefore never refetches). The lower bound only ever expands further
 * back, when the user scrolls before the buffer.
 *
 * The refs are mutated during render as a pure render-cache: both updates are
 * monotonic and idempotent (min for the start, max for the end), so React's
 * double-invocation under StrictMode/concurrent rendering is safe.
 */
export function useTrackingWindow(
  extendedDateStrings: string[],
  stableToday: Date
) {
  // Callers pass the date list in either order (week strip is ascending,
  // modals-state is descending/newest-first). Normalize to min/max so the
  // window never inverts — an inverted window silently excludes recent days.
  const firstDateString = extendedDateStrings[0];
  const lastDateString = extendedDateStrings.at(-1);
  const bothEnds =
    firstDateString !== undefined && lastDateString !== undefined;
  const requestedStart =
    bothEnds && lastDateString < firstDateString
      ? lastDateString
      : firstDateString;
  const requestedEnd =
    bothEnds && lastDateString < firstDateString
      ? firstDateString
      : lastDateString;
  const windowStartRef = useRef('');
  const windowEndRef = useRef('');

  const baseStart = useMemo(
    () => format(addDays(stableToday, -WINDOW_BUFFER_DAYS), DATE_FMT),
    [stableToday]
  );

  if (
    requestedEnd &&
    (windowEndRef.current === '' || requestedEnd > windowEndRef.current)
  ) {
    windowEndRef.current = requestedEnd;
  }

  let desiredStart = baseStart;
  if (requestedStart && requestedStart < baseStart) {
    desiredStart = format(
      addDays(parseISO(requestedStart), -WINDOW_BUFFER_DAYS),
      DATE_FMT
    );
  }
  if (windowStartRef.current === '' || desiredStart < windowStartRef.current) {
    windowStartRef.current = desiredStart;
  }

  const windowStart = windowStartRef.current || requestedStart || '';
  const windowEnd = windowEndRef.current || requestedEnd || windowStart;

  const windowDateStrings = useMemo(
    () => buildWindowDateStrings(windowStart, windowEnd),
    [windowStart, windowEnd]
  );

  return { windowDateStrings, windowEnd, windowStart };
}
