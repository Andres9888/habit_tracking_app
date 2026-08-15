import { eachDayOfInterval, endOfMonth } from 'date-fns';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate } from '../../insights';
import { MONTH_SHORT, type WeekBar } from './weeklyBars';

/** Elapsed months this year, oldest first. Counts logged days only. */
export function buildMonthlyBars(
  doneDates: Set<string>,
  today = getLocalDateString()
): WeekBar[] {
  const cursor = parseLocalDate(today);
  const year = cursor.getFullYear();

  return Array.from({ length: cursor.getMonth() + 1 }, (_, month) => {
    const start = new Date(year, month, 1);
    const monthEnd = endOfMonth(start);
    const end = monthEnd > cursor ? cursor : monthEnd;
    let value = 0;
    for (const day of eachDayOfInterval({ end, start })) {
      if (doneDates.has(getLocalDateString(day))) value += 1;
    }
    return {
      label: MONTH_SHORT[month] ?? '',
      partial: month === cursor.getMonth(),
      value,
    };
  });
}
