import {
  getTodayDateKey,
  getTodayForTimezone,
  isFutureDate,
  isValidDateFormat,
  maxDateKey,
  findMaxOrder,
} from './utils';

describe('habits/utils', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it('returns YYYY-MM-DD from getTodayDateKey', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-14T18:45:00.000Z'));

    expect(getTodayDateKey()).toBe('2026-02-14');
  });

  it('resolves today in provided timezone', () => {
    jest.useFakeTimers();
    // UTC date is Feb 14, but in Los Angeles this is still Feb 13
    jest.setSystemTime(new Date('2026-02-14T01:30:00.000Z'));

    expect(getTodayForTimezone('America/Los_Angeles')).toBe('2026-02-13');
  });

  it('falls back to local today when timezone is invalid', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-14T12:00:00.000Z'));

    expect(getTodayForTimezone('Invalid/Zone')).toBe('2026-02-14');
  });

  it('validates strict YYYY-MM-DD date format', () => {
    expect(isValidDateFormat('2026-02-14')).toBe(true);
    expect(isValidDateFormat('2026-2-14')).toBe(false);
    expect(isValidDateFormat('14-02-2026')).toBe(false);
  });

  it('allows dates up to one day ahead (timezone grace) for future check', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-02-14T10:00:00.000Z'));

    expect(isFutureDate('2026-02-14')).toBe(false);
    expect(isFutureDate('2026-02-15')).toBe(false);
    expect(isFutureDate('2026-02-16')).toBe(true);
  });

  it('returns lexicographically max date key', () => {
    expect(maxDateKey('2026-02-10', '2026-02-14')).toBe('2026-02-14');
    expect(maxDateKey('2026-02-28', '2026-02-14')).toBe('2026-02-28');
  });

  it('finds max order with undefined values present', () => {
    const habits = [{ order: undefined }, { order: 3 }, {}, { order: 9 }];
    expect(findMaxOrder(habits)).toBe(9);
  });
});
