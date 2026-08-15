import type { ChartRange } from './RangeTabs';
import type { WeekBar } from './weeklyBars';

export function chartTitle(range: ChartRange): string {
  return range === 'weekly'
    ? 'Days logged each week'
    : 'Days logged each month';
}

export function chartSubtitle(range: ChartRange, bars: WeekBar[]): string {
  const total = bars.reduce((sum, bar) => sum + bar.value, 0);
  return range === 'weekly'
    ? `Last ${bars.length} weeks · ${total} check-ins`
    : `This year · ${total} check-ins`;
}

export const YEAR_TAP_CAPTION =
  'Each square is a day you logged or didn’t. Tap a square to open that month in History.';
