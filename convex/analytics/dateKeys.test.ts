import {
  dateKeysEndingOn,
  getRollingWeekBoundaryKeys,
  shiftDateKey,
} from './dateKeys';

describe('analytics date keys', () => {
  it('shifts across month boundaries', () => {
    expect(shiftDateKey('2026-03-01', -1)).toBe('2026-02-28');
    expect(shiftDateKey('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('builds two equal 7-day rolling windows', () => {
    const { lastWeekStartKey, thisWeekStartKey } =
      getRollingWeekBoundaryKeys('2026-01-15');

    expect(thisWeekStartKey).toBe('2026-01-09');
    expect(lastWeekStartKey).toBe('2026-01-02');

    const thisWeek = dateKeysEndingOn('2026-01-15', 7);
    expect(thisWeek).toEqual([
      '2026-01-09',
      '2026-01-10',
      '2026-01-11',
      '2026-01-12',
      '2026-01-13',
      '2026-01-14',
      '2026-01-15',
    ]);
    expect(thisWeek).toHaveLength(7);

    const lastWeek = dateKeysEndingOn('2026-01-08', 7);
    expect(lastWeek[0]).toBe('2026-01-02');
    expect(lastWeek.at(-1)).toBe('2026-01-08');
    expect(lastWeek).toHaveLength(7);
  });

  it('enumerates a 30-day trend ending on today', () => {
    const keys = dateKeysEndingOn('2026-01-15', 30);
    expect(keys).toHaveLength(30);
    expect(keys[0]).toBe('2025-12-17');
    expect(keys.at(-1)).toBe('2026-01-15');
  });
});
