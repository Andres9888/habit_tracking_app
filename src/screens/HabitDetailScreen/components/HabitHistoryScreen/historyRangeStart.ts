import { getLocalDateString } from '../../../../utils/getLocalDateString';

/**
 * Earliest date the History calendar fetches. January 1 of the current year
 * keeps backfilled check-ins that predate `createdAt` visible; a habit older
 * than this year starts at its creation so paging back still has data.
 */
export function historyRangeStart(
  createdAt: number | undefined,
  today: string
): string {
  const janFirst = `${today.slice(0, 4)}-01-01`;
  if (createdAt === undefined) return janFirst;
  const created = getLocalDateString(new Date(createdAt));
  return created < janFirst ? created : janFirst;
}
