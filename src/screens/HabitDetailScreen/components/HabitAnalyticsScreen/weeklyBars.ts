import { addDays, startOfWeek } from 'date-fns';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate } from '../../insights';

export interface WeekBar {
  label: string;
  partial: boolean;
  value: number;
}

export const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Last `count` Monday-start weeks, oldest first. Counts logged days only. */
export function buildWeeklyBars(
  doneDates: Set<string>,
  today = getLocalDateString(),
  count = 8
): WeekBar[] {
  const cursor = parseLocalDate(today);
  const thisMonday = startOfWeek(cursor, { weekStartsOn: 1 });

  return Array.from({ length: count }, (_, index) => {
    const start = addDays(thisMonday, (index - (count - 1)) * 7);
    const end = addDays(start, 6);
    let value = 0;
    for (let day = 0; day < 7; day += 1) {
      const date = getLocalDateString(addDays(start, day));
      if (date <= today && doneDates.has(date)) value += 1;
    }
    return {
      label: `${MONTH_SHORT[start.getMonth()]} ${start.getDate()}`,
      partial: end > cursor,
      value,
    };
  });
}
