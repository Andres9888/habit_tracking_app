/**
 * The completion rate to show beside a month name — but only for months that
 * have finished. A percentage that climbs all month long reads as a falling
 * score, so the current month (and anything outside this year, which the yearly
 * rates don't cover) is shown without one rather than with a misleading one.
 *
 * Months that ended before the habit existed are withheld for the same reason:
 * `buildMonthlyRates` fills January-to-now regardless of createdAt, so a habit
 * started in August would otherwise report "0% · 0 of 22" for June — a failing
 * score for a month the user was never in the game.
 */
import { endOfMonth } from 'date-fns';
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate, type MonthRate } from '../../insights';
import { useHistoryMonths } from '../HabitDetailHistory/useHistoryMonths';

interface SettledMonthRateArgs {
  completedDates: Set<string>;
  createdAt?: number;
  daysOfWeek?: number[];
  month: Date;
  today?: string;
}

export function useSettledMonthRate({
  completedDates,
  createdAt,
  daysOfWeek,
  month,
  today = getLocalDateString(),
}: SettledMonthRateArgs): { isBest: boolean; rate?: MonthRate } {
  const months = useHistoryMonths({
    completedDates,
    createdAt,
    daysOfWeek,
    today,
  });
  const elapsed =
    month.getFullYear() === months.year &&
    month.getMonth() < parseLocalDate(today).getMonth();
  const existed =
    createdAt === undefined ||
    getLocalDateString(new Date(createdAt)) <=
      getLocalDateString(endOfMonth(month));
  const rate = elapsed && existed ? months.rates[month.getMonth()] : undefined;

  // One settled month is trivially its own best, which reads as a boast about
  // nothing. The star only means something once there is a field to lead.
  const settled = months.rates.filter(
    (entry, index) =>
      index < parseLocalDate(today).getMonth() && entry.scheduled > 0
  ).length;

  return {
    isBest:
      settled >= 2 && rate !== undefined && rate.month === months.best?.month,
    rate,
  };
}
