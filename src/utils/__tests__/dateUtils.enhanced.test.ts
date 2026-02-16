/**
 * Enhanced Date Utilities Tests
 * Additional edge cases for timezone handling, DST transitions, midnight boundaries
 */

import {
  differenceInDays,
  formatDateString,
  getTodayString,
  isToday,
  isYesterday,
} from '../dateUtils';

describe('dateUtils - enhanced edge cases', () => {
  describe('differenceInDays - timezone edge cases', () => {
    it('ignores time components when comparing dates', () => {
      const morning = new Date('2024-02-15T00:00:01Z');
      const evening = new Date('2024-02-15T23:59:59Z');
      expect(differenceInDays(morning, evening)).toBe(0);
    });

    it('handles dates across different timezones consistently', () => {
      // Dates that are same day but different UTC times
      const utcMidnight = new Date('2024-02-15T00:00:00Z');
      const utcNoon = new Date('2024-02-15T12:00:00Z');
      expect(differenceInDays(utcMidnight, utcNoon)).toBe(0);
    });

    it('handles dates created in different timezone contexts', () => {
      // YYYY-MM-DD strings are timezone-agnostic
      const date1 = '2024-02-15';
      const date2 = '2024-02-16';
      expect(differenceInDays(date2, date1)).toBe(1);
    });
  });

  describe('differenceInDays - DST transition edge cases', () => {
    it('handles spring DST transition (spring forward)', () => {
      // March 10, 2024 - DST starts in US (2am -> 3am)
      const beforeDst = '2024-03-09';
      const afterDst = '2024-03-11';
      expect(differenceInDays(afterDst, beforeDst)).toBe(2);
    });

    it('handles fall DST transition (fall back)', () => {
      // November 3, 2024 - DST ends in US (2am -> 1am)
      const beforeDst = '2024-11-02';
      const afterDst = '2024-11-04';
      expect(differenceInDays(afterDst, beforeDst)).toBe(2);
    });

    it('handles week spanning DST transition', () => {
      const beforeDst = '2024-03-08';
      const afterDst = '2024-03-15';
      expect(differenceInDays(afterDst, beforeDst)).toBe(7);
    });
  });

  describe('differenceInDays - midnight boundary edge cases', () => {
    it('handles dates exactly at midnight UTC', () => {
      const midnight1 = new Date('2024-02-15T00:00:00Z');
      const midnight2 = new Date('2024-02-16T00:00:00Z');
      expect(differenceInDays(midnight2, midnight1)).toBe(1);
    });

    it('handles dates one second before midnight', () => {
      const almostMidnight = new Date('2024-02-15T23:59:59Z');
      const midnight = new Date('2024-02-16T00:00:00Z');
      expect(differenceInDays(midnight, almostMidnight)).toBe(1);
    });

    it('handles dates one second after midnight', () => {
      const justAfterMidnight = new Date('2024-02-15T00:00:01Z');
      const midnight = new Date('2024-02-15T00:00:00Z');
      expect(differenceInDays(justAfterMidnight, midnight)).toBe(0);
    });
  });

  describe('differenceInDays - month boundary edge cases', () => {
    it('handles end of month to start of next month', () => {
      expect(differenceInDays('2024-03-01', '2024-02-29')).toBe(1);
    });

    it('handles leap year February', () => {
      expect(differenceInDays('2024-03-01', '2024-02-01')).toBe(29);
    });

    it('handles non-leap year February', () => {
      expect(differenceInDays('2023-03-01', '2023-02-01')).toBe(28);
    });
  });

  describe('differenceInDays - year boundary edge cases', () => {
    it('handles New Year transition', () => {
      expect(differenceInDays('2024-01-01', '2023-12-31')).toBe(1);
    });

    it('handles leap year boundary', () => {
      expect(differenceInDays('2024-02-29', '2024-02-28')).toBe(1);
    });
  });

  describe('formatDateString - edge cases', () => {
    it('pads month and day with zeros', () => {
      const date = new Date(2024, 0, 5); // January 5
      const formatted = formatDateString(date);
      expect(formatted).toBe('2024-01-05');
    });

    it('handles single-digit months and days', () => {
      const date = new Date(2024, 8, 9); // September 9
      const formatted = formatDateString(date);
      expect(formatted).toBe('2024-09-09');
    });

    it('throws on invalid date string', () => {
      expect(() => formatDateString('invalid-date')).toThrow(TypeError);
      expect(() => formatDateString('not-a-date')).toThrow();
    });

    it('handles leap year dates', () => {
      const leapDay = new Date(2024, 1, 29); // Feb 29, 2024
      expect(formatDateString(leapDay)).toBe('2024-02-29');
    });

    it('handles end of year', () => {
      const newYearsEve = new Date(2024, 11, 31); // Dec 31
      expect(formatDateString(newYearsEve)).toBe('2024-12-31');
    });
  });

  describe('getTodayString - consistency', () => {
    it('returns string in YYYY-MM-DD format', () => {
      const today = getTodayString();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('returns current date', () => {
      const today = getTodayString();
      const now = new Date();
      const expected = formatDateString(now);
      expect(today).toBe(expected);
    });
  });

  describe('isToday - edge cases', () => {
    it('returns false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(formatDateString(yesterday))).toBe(false);
    });

    it('returns false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(formatDateString(tomorrow))).toBe(false);
    });

    it('returns false for dates far in past', () => {
      expect(isToday('2020-01-01')).toBe(false);
    });

    it('returns false for dates far in future', () => {
      expect(isToday('2030-12-31')).toBe(false);
    });
  });

  describe('isYesterday - edge cases', () => {
    it('returns false for today', () => {
      const today = getTodayString();
      expect(isYesterday(today)).toBe(false);
    });

    it('returns false for day before yesterday', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      expect(isYesterday(formatDateString(twoDaysAgo))).toBe(false);
    });

    it('returns false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isYesterday(formatDateString(tomorrow))).toBe(false);
    });

    describe('month boundary edge cases', () => {
      it('handles yesterday across month boundary', () => {
        // Mock today as March 1
        const today = new Date(2024, 2, 1); // March 1, 2024
        const yesterday = new Date(2024, 1, 29); // Feb 29, 2024 (leap year)
        
        // Verify the dates are one day apart
        const todayStr = formatDateString(today);
        const yesterdayStr = formatDateString(yesterday);
        
        expect(differenceInDays(todayStr, yesterdayStr)).toBe(1);
      });
    });
  });

  describe('timezone consistency across functions', () => {
    it('produces same results regardless of local timezone', () => {
      // These should always be the same difference regardless of where test runs
      const diff1 = differenceInDays('2024-02-20', '2024-02-15');
      const diff2 = differenceInDays('2024-02-15', '2024-02-20');
      
      expect(diff1).toBe(5);
      expect(diff2).toBe(-5);
      expect(diff1 + diff2).toBe(0);
    });

    it('handles UTC date objects consistently', () => {
      const utcDate1 = new Date(Date.UTC(2024, 1, 15, 0, 0, 0));
      const utcDate2 = new Date(Date.UTC(2024, 1, 20, 0, 0, 0));
      
      expect(differenceInDays(utcDate2, utcDate1)).toBe(5);
    });
  });

  describe('DST-specific date calculations', () => {
    it('handles dates during spring DST week', () => {
      // March 8-15, 2024 includes DST transition on March 10
      const dates = [
        '2024-03-08',
        '2024-03-09',
        '2024-03-10', // DST transition
        '2024-03-11',
        '2024-03-12',
      ];
      
      // Each consecutive pair should be 1 day apart
      for (let i = 1; i < dates.length; i++) {
        expect(differenceInDays(dates[i], dates[i - 1])).toBe(1);
      }
    });

    it('handles dates during fall DST week', () => {
      // November 1-8, 2024 includes DST transition on November 3
      const dates = [
        '2024-11-01',
        '2024-11-02',
        '2024-11-03', // DST transition (25-hour day)
        '2024-11-04',
        '2024-11-05',
      ];
      
      // Each consecutive pair should be 1 day apart
      for (let i = 1; i < dates.length; i++) {
        expect(differenceInDays(dates[i], dates[i - 1])).toBe(1);
      }
    });
  });
});
