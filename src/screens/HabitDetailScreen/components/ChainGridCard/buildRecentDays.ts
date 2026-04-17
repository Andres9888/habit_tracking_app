import { format, startOfToday, subDays } from 'date-fns';

const DEFAULT_WINDOW_DAYS = 49;

/**
 * Build an ordered array (oldest → newest) of booleans for whether each of
 * the last N days was completed. Used by ChainGridCard.
 */
export function buildRecentDays(
  completedDates: Set<string>,
  windowDays = DEFAULT_WINDOW_DAYS
): boolean[] {
  const today = startOfToday();
  const out: boolean[] = [];
  for (let i = windowDays - 1; i >= 0; i--) {
    const dateString = format(subDays(today, i), 'yyyy-MM-dd');
    out.push(completedDates.has(dateString));
  }
  return out;
}
