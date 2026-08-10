/** Year-to-date completion volume and scheduled rate. */
import { addDays, eachDayOfInterval } from 'date-fns';
import { getLocalDateString } from '../../../utils/getLocalDateString';
import {
  isScheduledWeekday,
  parseLocalDate,
  scheduledWeekdays,
} from './schedule';

export function yearStats(
  today: string,
  firstKnown: string,
  doneSet: Set<string>,
  daysOfWeek?: number[]
) {
  const yearPrefix = `${today.slice(0, 4)}-`;
  const completions = [...doneSet].filter((date) =>
    date.startsWith(yearPrefix)
  ).length;

  const yearStart = `${yearPrefix}01-01`;
  const start = firstKnown > yearStart ? firstKnown : yearStart;
  const end = doneSet.has(today)
    ? today
    : getLocalDateString(addDays(parseLocalDate(today), -1));
  if (start > end) return { completions, ratePct: 0 };

  const scheduled = scheduledWeekdays({ daysOfWeek });
  const elapsed = eachDayOfInterval({
    end: parseLocalDate(end),
    start: parseLocalDate(start),
  }).filter((date) => isScheduledWeekday(scheduled, date.getDay())).length;

  return {
    completions,
    ratePct: elapsed === 0 ? 0 : Math.round((completions / elapsed) * 100),
  };
}
