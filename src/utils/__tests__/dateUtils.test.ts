/**
 * Tests for dateUtils.ts
 * Ensures consistent date calculations that match backend (convex/streakUtils.ts)
 */

import {
  differenceInDays,
  getTodayString,
  formatDateString,
  isToday,
  isYesterday,
} from '../dateUtils';

describe('differenceInDays', () => {
  describe('basic calculations', () => {
    it('should return 0 for same day', () => {
      expect(differenceInDays('2024-01-15', '2024-01-15')).toBe(0);
    });

    it('should return 1 for consecutive days', () => {
      expect(differenceInDays('2024-01-16', '2024-01-15')).toBe(1);
    });

    it('should return -1 when date1 is before date2', () => {
      expect(differenceInDays('2024-01-14', '2024-01-15')).toBe(-1);
    });

    it('should handle multi-day gaps correctly', () => {
      expect(differenceInDays('2024-01-20', '2024-01-15')).toBe(5);
    });

    it('should handle month boundaries', () => {
      expect(differenceInDays('2024-02-01', '2024-01-31')).toBe(1);
    });

    it('should handle year boundaries', () => {
      expect(differenceInDays('2024-01-01', '2023-12-31')).toBe(1);
    });
  });

  describe('UTC calendar normalization', () => {
    it('should compare the UTC dates represented by Date objects', () => {
      const date1 = new Date('2024-01-16T23:59:59.999');
      const date2 = new Date('2024-01-15T00:00:00.001');

      // In America/New_York the first instant falls on Jan 17 UTC.
      const result = differenceInDays(date1, date2);
      expect(result).toBe(2);
    });

    it('should handle dates with different times correctly', () => {
      const date1 = new Date('2024-01-16T12:30:00');
      const date2 = new Date('2024-01-15T18:45:00');

      // Should still be 1 day difference after normalization
      expect(differenceInDays(date1, date2)).toBe(1);
    });
  });

  describe('string date handling', () => {
    it('should handle YYYY-MM-DD string format', () => {
      expect(differenceInDays('2024-03-15', '2024-03-10')).toBe(5);
    });

    it('should handle mixed string and Date inputs', () => {
      const dateObj = new Date('2024-01-15T00:00:00');
      expect(differenceInDays('2024-01-20', dateObj)).toBe(5);
    });
  });

  describe('leap year handling', () => {
    it('should handle leap year Feb 29', () => {
      expect(differenceInDays('2024-03-01', '2024-02-29')).toBe(1);
    });

    it('should handle non-leap year Feb 28 to Mar 1', () => {
      expect(differenceInDays('2023-03-01', '2023-02-28')).toBe(1);
    });
  });
});

describe('formatDateString', () => {
  it('should format Date object to YYYY-MM-DD', () => {
    const date = new Date(2024, 0, 15); // January 15, 2024
    expect(formatDateString(date)).toBe('2024-01-15');
  });

  it('should return valid YYYY-MM-DD string as-is', () => {
    expect(formatDateString('2024-01-15')).toBe('2024-01-15');
  });

  it('should pad single-digit months and days', () => {
    const date = new Date(2024, 0, 5); // January 5, 2024
    expect(formatDateString(date)).toBe('2024-01-05');
  });
});

describe('getTodayString', () => {
  it('should return a valid YYYY-MM-DD format', () => {
    const result = getTodayString();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should match current date', () => {
    const today = new Date();
    const expected = formatDateString(today);
    expect(getTodayString()).toBe(expected);
  });
});

describe('isToday', () => {
  it('should return true for today', () => {
    const today = getTodayString();
    expect(isToday(today)).toBe(true);
  });

  it('should return false for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(formatDateString(yesterday))).toBe(false);
  });
});

describe('isYesterday', () => {
  it('should return true for yesterday', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isYesterday(formatDateString(yesterday))).toBe(true);
  });

  it('should return false for today', () => {
    const today = getTodayString();
    expect(isYesterday(today)).toBe(false);
  });
});

describe('consistency with backend streakUtils', () => {
  // These tests verify that our frontend calculations match the backend
  // Backend uses: Math.floor + midnight normalization

  it('should calculate streak-breaking gaps correctly', () => {
    // A gap of 2+ days should break a streak
    const dates = ['2024-01-10', '2024-01-11', '2024-01-12', '2024-01-15'];

    // Days 10-12 are consecutive (diff = 1)
    expect(differenceInDays('2024-01-11', '2024-01-10')).toBe(1);
    expect(differenceInDays('2024-01-12', '2024-01-11')).toBe(1);

    // Day 15 has a 3-day gap from day 12
    expect(differenceInDays('2024-01-15', '2024-01-12')).toBe(3);
  });

  it('should handle consecutive days in streak calculation', () => {
    const consecutiveDates = [
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
      '2024-01-04',
      '2024-01-05',
    ];

    for (let i = 1; i < consecutiveDates.length; i++) {
      expect(differenceInDays(consecutiveDates[i], consecutiveDates[i - 1])).toBe(
        1
      );
    }
  });
});
