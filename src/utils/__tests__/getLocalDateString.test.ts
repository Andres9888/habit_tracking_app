/**
 * getLocalDateString Utility Tests
 * Tests timezone-safe date string formatting
 *
 * CRITICAL: These functions prevent timezone bugs by using local time,
 * not UTC conversion like toISOString()
 */

import { getLocalDateString, getTodayString } from '../getLocalDateString';

describe('getLocalDateString', () => {
  describe('getLocalDateString', () => {
    it('formats date as YYYY-MM-DD', () => {
      const date = new Date(2024, 1, 15); // Feb 15, 2024 in local time
      expect(getLocalDateString(date)).toBe('2024-02-15');
    });

    it('pads single-digit months with zero', () => {
      const date = new Date(2024, 0, 20); // Jan (month 0)
      expect(getLocalDateString(date)).toBe('2024-01-20');
    });

    it('pads single-digit days with zero', () => {
      const date = new Date(2024, 5, 5); // Jun 5
      expect(getLocalDateString(date)).toBe('2024-06-05');
    });

    it('handles first day of month', () => {
      const date = new Date(2024, 2, 1); // Mar 1
      expect(getLocalDateString(date)).toBe('2024-03-01');
    });

    it('handles last day of month', () => {
      const date = new Date(2024, 0, 31); // Jan 31
      expect(getLocalDateString(date)).toBe('2024-01-31');
    });

    it('handles leap year date', () => {
      const date = new Date(2024, 1, 29); // Feb 29, 2024 (leap year)
      expect(getLocalDateString(date)).toBe('2024-02-29');
    });

    it('handles non-leap year February', () => {
      const date = new Date(2023, 1, 28); // Feb 28, 2023
      expect(getLocalDateString(date)).toBe('2023-02-28');
    });

    it('handles December correctly', () => {
      const date = new Date(2024, 11, 25); // Dec 25
      expect(getLocalDateString(date)).toBe('2024-12-25');
    });

    it('uses current date when no argument provided', () => {
      const result = getLocalDateString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('preserves local timezone', () => {
      // Create date at 23:00 local time
      const date = new Date(2024, 0, 15, 23, 0, 0);
      const result = getLocalDateString(date);

      // Should still be Jan 15, not shifted to Jan 16 due to UTC conversion
      expect(result).toBe('2024-01-15');
    });

    it('preserves local timezone for early morning', () => {
      // Create date at 01:00 local time
      const date = new Date(2024, 0, 15, 1, 0, 0);
      const result = getLocalDateString(date);

      // Should still be Jan 15, not shifted to Jan 14 due to UTC conversion
      expect(result).toBe('2024-01-15');
    });

    it('handles midnight correctly', () => {
      const date = new Date(2024, 0, 15, 0, 0, 0);
      expect(getLocalDateString(date)).toBe('2024-01-15');
    });

    it('handles near-midnight correctly', () => {
      const date = new Date(2024, 0, 15, 23, 59, 59);
      expect(getLocalDateString(date)).toBe('2024-01-15');
    });

    it('handles year boundary', () => {
      const newYear = new Date(2024, 0, 1); // Jan 1, 2024
      const oldYear = new Date(2023, 11, 31); // Dec 31, 2023

      expect(getLocalDateString(newYear)).toBe('2024-01-01');
      expect(getLocalDateString(oldYear)).toBe('2023-12-31');
    });

    it('handles very old dates', () => {
      const oldDate = new Date(1990, 5, 15);
      expect(getLocalDateString(oldDate)).toBe('1990-06-15');
    });

    it('handles far future dates', () => {
      const futureDate = new Date(2099, 11, 31);
      expect(getLocalDateString(futureDate)).toBe('2099-12-31');
    });

    describe('avoids UTC conversion bugs', () => {
      it('does not use toISOString which converts to UTC', () => {
        // This test demonstrates why we need getLocalDateString
        const date = new Date(2024, 0, 15, 23, 0, 0);
        const isoString = date.toISOString().split('T')[0];
        const localString = getLocalDateString(date);

        // Depending on timezone, these might differ
        // Our function always returns local date
        expect(localString).toBe('2024-01-15');
      });

      it('handles timezone offset edge case (positive offset)', () => {
        // Create date that would shift forward in UTC
        const date = new Date(2024, 0, 15, 23, 30, 0);
        const result = getLocalDateString(date);

        // Should maintain local date regardless of UTC offset
        expect(result).toBe('2024-01-15');
      });

      it('handles timezone offset edge case (negative offset)', () => {
        // Create date that would shift backward in UTC
        const date = new Date(2024, 0, 15, 0, 30, 0);
        const result = getLocalDateString(date);

        // Should maintain local date regardless of UTC offset
        expect(result).toBe('2024-01-15');
      });
    });

    describe('edge cases', () => {
      it('handles dates with seconds and milliseconds', () => {
        const date = new Date(2024, 1, 15, 12, 34, 56, 789);
        expect(getLocalDateString(date)).toBe('2024-02-15');
      });

      it('is consistent for same date with different times', () => {
        const morning = new Date(2024, 1, 15, 6, 0, 0);
        const evening = new Date(2024, 1, 15, 20, 0, 0);

        expect(getLocalDateString(morning)).toBe('2024-02-15');
        expect(getLocalDateString(evening)).toBe('2024-02-15');
      });

      it('throws on invalid date', () => {
        const invalidDate = new Date('invalid');
        expect(() => getLocalDateString(invalidDate)).toThrow(
          'Invalid date passed to getLocalDateString'
        );
      });
    });
  });

  describe('getTodayString', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns current date in YYYY-MM-DD format', () => {
      jest.setSystemTime(new Date(2024, 1, 15, 12, 0, 0));
      expect(getTodayString()).toBe('2024-02-15');
    });

    it('updates when date changes', () => {
      jest.setSystemTime(new Date(2024, 1, 15, 12, 0, 0));
      expect(getTodayString()).toBe('2024-02-15');

      jest.setSystemTime(new Date(2024, 1, 16, 12, 0, 0));
      expect(getTodayString()).toBe('2024-02-16');
    });

    it('handles midnight correctly', () => {
      jest.setSystemTime(new Date(2024, 1, 15, 0, 0, 0));
      expect(getTodayString()).toBe('2024-02-15');
    });

    it('handles end of day correctly', () => {
      jest.setSystemTime(new Date(2024, 1, 15, 23, 59, 59));
      expect(getTodayString()).toBe('2024-02-15');
    });

    it('handles year boundary', () => {
      jest.setSystemTime(new Date(2024, 0, 1, 0, 0, 1));
      expect(getTodayString()).toBe('2024-01-01');

      jest.setSystemTime(new Date(2023, 11, 31, 23, 59, 59));
      expect(getTodayString()).toBe('2023-12-31');
    });

    it('is consistent with getLocalDateString(new Date())', () => {
      jest.setSystemTime(new Date(2024, 1, 15, 12, 0, 0));

      const todayString = getTodayString();
      const localDateString = getLocalDateString(new Date());

      expect(todayString).toBe(localDateString);
    });

    it('handles DST transitions', () => {
      // Spring forward: 2024-03-10 02:00 -> 03:00 (in US)
      jest.setSystemTime(new Date(2024, 2, 10, 1, 59, 59));
      expect(getTodayString()).toBe('2024-03-10');

      jest.setSystemTime(new Date(2024, 2, 10, 3, 0, 1));
      expect(getTodayString()).toBe('2024-03-10');
    });
  });

  describe('real-world usage scenarios', () => {
    it('can be used for habit completion tracking', () => {
      const completedDates = new Set<string>();
      const today = new Date(2024, 1, 15);

      completedDates.add(getLocalDateString(today));
      completedDates.add(getLocalDateString(new Date(2024, 1, 14)));

      expect(completedDates.has('2024-02-15')).toBe(true);
      expect(completedDates.has('2024-02-14')).toBe(true);
    });

    it('generates sortable date strings', () => {
      const dates = [
        getLocalDateString(new Date(2024, 1, 15)),
        getLocalDateString(new Date(2024, 0, 10)),
        getLocalDateString(new Date(2024, 2, 5)),
      ];

      dates.sort();

      expect(dates).toEqual(['2024-01-10', '2024-02-15', '2024-03-05']);
    });

    it('can be compared lexicographically', () => {
      const date1 = getLocalDateString(new Date(2024, 1, 15));
      const date2 = getLocalDateString(new Date(2024, 1, 16));

      expect(date1 < date2).toBe(true);
      expect(date2 > date1).toBe(true);
    });

    it('works consistently across multiple calls in same day', () => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date(2024, 1, 15, 9, 0, 0));

      const morning = getTodayString();

      jest.setSystemTime(new Date(2024, 1, 15, 17, 0, 0));
      const evening = getTodayString();

      expect(morning).toBe(evening);

      jest.useRealTimers();
    });
  });
});
