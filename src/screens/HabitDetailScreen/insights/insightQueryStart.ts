import { getLocalDateString } from '../../../utils/getLocalDateString';

/**
 * History, Analytics, and Day Entry need every logged day since the habit
 * began. Calendar-year YTD drops last December once January starts.
 */
export function insightQueryStart(
  today: string,
  habitCreatedAt?: number
): string {
  const yearStart = `${today.slice(0, 4)}-01-01`;
  if (habitCreatedAt === undefined) return yearStart;

  const created = getLocalDateString(new Date(habitCreatedAt));
  if (created > today) return yearStart;
  return created;
}
