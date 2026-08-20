import { getLocalDateString } from '../../../../utils/getLocalDateString';
import { buildMonthlyRates } from '../../insights';
import { MONTH_SHORT, type WeekBar } from './weeklyBars';

const LAST_MONTHS = 6;

/** Elapsed months this year as % of scheduled days (last six, oldest first). */
export function buildMonthlyBars(
  doneDates: Set<string>,
  today = getLocalDateString(),
  daysOfWeek?: number[]
): WeekBar[] {
  const rates = buildMonthlyRates({
    completedDates: doneDates,
    daysOfWeek,
    today,
  });
  const currentMonth = Number(today.slice(5, 7)) - 1;

  return rates.slice(-LAST_MONTHS).map((month) => ({
    label: MONTH_SHORT[month.month] ?? '',
    partial: month.month === currentMonth,
    value: month.ratePct,
    valueCaption: `${month.ratePct}%`,
  }));
}
