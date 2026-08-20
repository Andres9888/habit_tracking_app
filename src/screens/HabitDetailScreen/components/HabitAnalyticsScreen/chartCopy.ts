import type { ChartRange } from './RangeTabs';
import type { WeekBar } from './weeklyBars';

const MONTH_FULL: Record<string, string> = {
  Jan: 'January',
  Feb: 'February',
  Mar: 'March',
  Apr: 'April',
  May: 'May',
  Jun: 'June',
  Jul: 'July',
  Aug: 'August',
  Sep: 'September',
  Oct: 'October',
  Nov: 'November',
  Dec: 'December',
};

export function chartTitle(range: ChartRange): string {
  return range === 'weekly'
    ? 'Days logged each week'
    : 'Share of days logged each month';
}

export function chartSubtitle(range: ChartRange, bars: WeekBar[]): string {
  if (range === 'weekly') {
    const total = bars.reduce((sum, bar) => sum + bar.value, 0);
    return `Last ${bars.length} weeks · ${total} check-ins`;
  }
  return `Last ${bars.length} months · % of scheduled days`;
}

export function chartFootnote(range: ChartRange, bars: WeekBar[]): string {
  if (range === 'weekly') {
    return 'Based on days you logged. A week with no check-ins shows as zero — nothing is estimated or filled in for you.';
  }
  const last = bars[bars.length - 1];
  const month =
    last?.partial && last.label ? (MONTH_FULL[last.label] ?? last.label) : null;
  const tail = month
    ? ` ${month} counts only the days that have happened so far.`
    : '';
  return `Based on days you logged, out of the days the habit was scheduled.${tail}`;
}

export const YEAR_TAP_CAPTION =
  'Each square is a day you logged or didn’t. Tap a square to open that month in History.';
