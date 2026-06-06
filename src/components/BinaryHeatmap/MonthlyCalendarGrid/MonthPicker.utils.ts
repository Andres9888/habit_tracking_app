import {
  startOfMonth,
  endOfMonth,
  isBefore,
  isAfter,
  setMonth as setMonthIndex,
  setYear,
} from 'date-fns';

export const MONTH_NAMES = [
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
] as const;

export function isMonthSelectable(
  year: number,
  monthIndex: number,
  minDate?: Date,
  maxDate?: Date
): boolean {
  const monthStart = startOfMonth(
    setMonthIndex(setYear(new Date(), year), monthIndex)
  );
  const monthEnd = endOfMonth(monthStart);
  if (minDate && isBefore(monthEnd, startOfMonth(minDate))) return false;
  if (maxDate && isAfter(monthStart, startOfMonth(maxDate))) return false;
  return true;
}
