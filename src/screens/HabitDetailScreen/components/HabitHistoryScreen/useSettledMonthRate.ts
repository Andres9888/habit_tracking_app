/**
 * The completion rate to show beside a month name — but only for months that
 * have finished. A percentage that climbs all month long reads as a falling
 * score, so the current month (and anything outside this year, which the yearly
 * rates don't cover) is shown without one rather than with a misleading one.
 */
import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { parseLocalDate, type MonthRate } from '../../insights';
import { useHistoryMonths } from '../HabitDetailHistory/useHistoryMonths';

interface SettledMonthRateArgs {
  completedDates: Set<string>;
  daysOfWeek?: number[];
  month: Date;
  today?: string;
}

export function useSettledMonthRate({
  completedDates,
  daysOfWeek,
  month,
  today = getLocalDateString(),
}: SettledMonthRateArgs): { isBest: boolean; rate?: MonthRate } {
  const months = useHistoryMonths({ completedDates, daysOfWeek, today });
  const elapsed =
    month.getFullYear() === months.year &&
    month.getMonth() < parseLocalDate(today).getMonth();
  const rate = elapsed ? months.rates[month.getMonth()] : undefined;

  return {
    isBest: rate !== undefined && rate.month === months.best?.month,
    rate,
  };
}
