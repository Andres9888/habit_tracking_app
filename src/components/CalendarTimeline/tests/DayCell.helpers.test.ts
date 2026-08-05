import { formatDayLabels } from '../components/DayCell.helpers';

describe('formatDayLabels', () => {
  it('builds weekday, day number and base label', () => {
    // 2026-01-15 is a Thursday
    const labels = formatDayLabels(new Date(2026, 0, 15));
    expect(labels.weekday).toBe('Thu');
    expect(labels.dayNumber).toBe('15');
    expect(labels.baseLabel).toBe('Thu, Jan 15');
    expect(labels.monthPrefix).toBeUndefined();
  });

  it('sets an uppercase monthPrefix on the first of the month', () => {
    const labels = formatDayLabels(new Date(2026, 1, 1));
    expect(labels.dayNumber).toBe('1');
    expect(labels.monthPrefix).toBe('FEB');
    expect(labels.baseLabel).toBe('Sun, Feb 1');
  });
});
