/**
 * Habit Calculations Utility Tests
 * Tests pure functions for calculating habit statistics
 */

import {
  calculateBestStreak,
  calculateCompletionPercentage,
  formatActivityDate,
  formatActivityTime,
} from '../habitCalculations';

describe('habitCalculations', () => {
  describe('calculateBestStreak', () => {
    it('returns 0 for empty tracking array', () => {
      expect(calculateBestStreak([])).toBe(0);
    });

    it('returns 0 when no completions', () => {
      const tracking = [
        { date: '2024-01-01', completed: false },
        { date: '2024-01-02', completed: false },
        { date: '2024-01-03', completed: false },
      ];
      expect(calculateBestStreak(tracking)).toBe(0);
    });

    it('returns 1 for a single completion', () => {
      const tracking = [
        { date: '2024-01-01', completed: true },
        { date: '2024-01-02', completed: false },
      ];
      expect(calculateBestStreak(tracking)).toBe(1);
    });

    it('calculates streak for consecutive days', () => {
      const tracking = [
        { date: '2024-01-01', completed: true },
        { date: '2024-01-02', completed: true },
        { date: '2024-01-03', completed: true },
        { date: '2024-01-04', completed: false },
      ];
      expect(calculateBestStreak(tracking)).toBe(3);
    });

    it('finds the longest streak when multiple exist', () => {
      const tracking = [
        { date: '2024-01-01', completed: true },
        { date: '2024-01-02', completed: true },
        { date: '2024-01-03', completed: false },
        { date: '2024-01-04', completed: true },
        { date: '2024-01-05', completed: true },
        { date: '2024-01-06', completed: true },
        { date: '2024-01-07', completed: true },
        { date: '2024-01-08', completed: false },
      ];
      expect(calculateBestStreak(tracking)).toBe(4);
    });

    it('handles unsorted dates correctly', () => {
      const tracking = [
        { date: '2024-01-05', completed: true },
        { date: '2024-01-02', completed: true },
        { date: '2024-01-03', completed: true },
        { date: '2024-01-01', completed: true },
        { date: '2024-01-04', completed: true },
      ];
      expect(calculateBestStreak(tracking)).toBe(5);
    });

    it('ignores gaps in tracking', () => {
      const tracking = [
        { date: '2024-01-01', completed: true },
        { date: '2024-01-02', completed: true },
        // Gap on 01-03
        { date: '2024-01-04', completed: true },
        { date: '2024-01-05', completed: true },
      ];
      expect(calculateBestStreak(tracking)).toBe(2);
    });

    it('handles same-day duplicates gracefully', () => {
      const tracking = [
        { date: '2024-01-01', completed: true },
        { date: '2024-01-01', completed: true }, // Duplicate
        { date: '2024-01-02', completed: true },
      ];
      // Should not crash
      const result = calculateBestStreak(tracking);
      expect(result).toBeGreaterThanOrEqual(1);
    });

    it('calculates long streaks correctly', () => {
      const tracking = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        completed: true,
      }));
      expect(calculateBestStreak(tracking)).toBe(100);
    });

    it('handles mixed completed and incomplete entries', () => {
      const tracking = [
        { date: '2024-01-01', completed: true },
        { date: '2024-01-02', completed: false },
        { date: '2024-01-03', completed: true },
        { date: '2024-01-04', completed: true },
        { date: '2024-01-05', completed: false },
        { date: '2024-01-06', completed: true },
      ];
      expect(calculateBestStreak(tracking)).toBe(2);
    });
  });

  describe('calculateCompletionPercentage', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-02-01T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('returns 0 for empty tracking', () => {
      const habitCreatedAt = new Date(2024, 0, 1).getTime();
      expect(calculateCompletionPercentage(habitCreatedAt, [])).toBe(0);
    });

    it('calculates percentage for single day habit', () => {
      const habitCreatedAt = new Date(2024, 1, 1).getTime();
      const tracking = [{ date: '2024-02-01', completed: true }];
      expect(calculateCompletionPercentage(habitCreatedAt, tracking)).toBe(100);
    });

    it('calculates 50% for half completions', () => {
      const habitCreatedAt = new Date(2024, 0, 1).getTime();
      const tracking = Array.from({ length: 16 }, (_, i) => ({
        date: new Date(2024, 0, i + 1).toISOString().split('T')[0],
        completed: true,
      }));
      // Created Jan 1, today is Feb 1 = 32 days total
      // 16 completed / 32 days = 50%
      expect(calculateCompletionPercentage(habitCreatedAt, tracking)).toBe(50);
    });

    it('calculates 100% for perfect habit', () => {
      const habitCreatedAt = new Date(2024, 0, 25).getTime();
      const tracking = Array.from({ length: 8 }, (_, i) => ({
        date: new Date(2024, 0, 25 + i).toISOString().split('T')[0],
        completed: true,
      }));
      // Created Jan 25, today is Feb 1 = 8 days total
      // 8 completed / 8 days = 100%
      expect(calculateCompletionPercentage(habitCreatedAt, tracking)).toBe(100);
    });

    it('rounds percentage to nearest integer', () => {
      const habitCreatedAt = new Date(2024, 0, 1).getTime();
      const tracking = [
        { date: '2024-01-01', completed: true },
        { date: '2024-01-02', completed: true },
      ];
      // 2 completed / 32 days = 6.25% -> rounds to 6%
      expect(calculateCompletionPercentage(habitCreatedAt, tracking)).toBe(6);
    });

    it('handles habit created today', () => {
      const habitCreatedAt = new Date(2024, 1, 1).getTime();
      const tracking: { date: string; completed: boolean }[] = [];
      // 0 completed / 1 day = 0%
      expect(calculateCompletionPercentage(habitCreatedAt, tracking)).toBe(0);
    });

    it('ignores incomplete entries in count', () => {
      const habitCreatedAt = new Date(2024, 0, 29).getTime();
      const tracking = [
        { date: '2024-01-29', completed: true },
        { date: '2024-01-30', completed: false },
        { date: '2024-01-31', completed: true },
        { date: '2024-02-01', completed: false },
      ];
      // 2 completed / 4 days = 50%
      expect(calculateCompletionPercentage(habitCreatedAt, tracking)).toBe(50);
    });

    it('handles future habitCreatedAt gracefully', () => {
      const futureDate = new Date('2025-01-01').getTime();
      const tracking = [{ date: '2024-01-01', completed: true }];
      expect(calculateCompletionPercentage(futureDate, tracking)).toBe(0);
    });

    it('handles very old habits', () => {
      const habitCreatedAt = new Date(2020, 0, 1).getTime();
      const tracking = Array.from({ length: 100 }, (_, i) => ({
        date: new Date(2020, 0, i + 1).toISOString().split('T')[0],
        completed: true,
      }));
      // 100 completed / ~1500 days = ~7%
      const result = calculateCompletionPercentage(habitCreatedAt, tracking);
      expect(result).toBeGreaterThan(0);
      expect(result).toBeLessThan(15);
    });
  });

  describe('formatActivityDate', () => {
    it('formats date in "EEEE, MMMM d" format', () => {
      expect(formatActivityDate('2024-02-14')).toBe('Wednesday, February 14');
    });

    it('handles January dates', () => {
      expect(formatActivityDate('2024-01-01')).toBe('Monday, January 1');
    });

    it('handles December dates', () => {
      expect(formatActivityDate('2024-12-25')).toBe('Wednesday, December 25');
    });

    it('handles single-digit days', () => {
      expect(formatActivityDate('2024-03-05')).toBe('Tuesday, March 5');
    });

    it('handles last day of month', () => {
      expect(formatActivityDate('2024-01-31')).toBe('Wednesday, January 31');
    });

    it('handles leap year dates', () => {
      expect(formatActivityDate('2024-02-29')).toBe('Thursday, February 29');
    });

    it('handles different years consistently', () => {
      expect(formatActivityDate('2023-07-04')).toBe('Tuesday, July 4');
      expect(formatActivityDate('2025-07-04')).toBe('Friday, July 4');
    });
  });

  describe('formatActivityTime', () => {
    it('formats morning time correctly', () => {
      const timestamp = new Date('2024-02-01T09:30:00').getTime();
      expect(formatActivityTime(timestamp)).toBe('9:30 AM');
    });

    it('formats afternoon time correctly', () => {
      const timestamp = new Date('2024-02-01T14:45:00').getTime();
      expect(formatActivityTime(timestamp)).toBe('2:45 PM');
    });

    it('formats midnight correctly', () => {
      const timestamp = new Date('2024-02-01T00:00:00').getTime();
      expect(formatActivityTime(timestamp)).toBe('12:00 AM');
    });

    it('formats noon correctly', () => {
      const timestamp = new Date('2024-02-01T12:00:00').getTime();
      expect(formatActivityTime(timestamp)).toBe('12:00 PM');
    });

    it('formats evening time correctly', () => {
      const timestamp = new Date('2024-02-01T19:15:00').getTime();
      expect(formatActivityTime(timestamp)).toBe('7:15 PM');
    });

    it('formats late night time correctly', () => {
      const timestamp = new Date('2024-02-01T23:59:00').getTime();
      expect(formatActivityTime(timestamp)).toBe('11:59 PM');
    });

    it('handles single digit minutes', () => {
      const timestamp = new Date('2024-02-01T08:05:00').getTime();
      expect(formatActivityTime(timestamp)).toBe('8:05 AM');
    });

    it('handles early morning', () => {
      const timestamp = new Date('2024-02-01T01:23:00').getTime();
      expect(formatActivityTime(timestamp)).toBe('1:23 AM');
    });

    it('handles timestamps across timezones', () => {
      const timestamp = new Date('2024-02-01T15:30:00Z').getTime();
      // Result depends on local timezone, but should not throw
      const result = formatActivityTime(timestamp);
      expect(result).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
    });
  });

  describe('edge cases', () => {
    it('handles invalid date strings gracefully in formatActivityDate', () => {
      expect(() => formatActivityDate('invalid-date')).toThrow();
    });

    it('handles negative timestamps in formatActivityTime', () => {
      const negativeTimestamp = -1000000;
      const result = formatActivityTime(negativeTimestamp);
      expect(result).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
    });

    it('handles very large completion arrays efficiently', () => {
      const largeTracking = Array.from({ length: 10000 }, (_, i) => ({
        date: new Date(2000, 0, i + 1).toISOString().split('T')[0],
        completed: i % 2 === 0,
      }));

      const startTime = performance.now();
      calculateBestStreak(largeTracking);
      const endTime = performance.now();

      // Should complete in reasonable time (< 1 second)
      expect(endTime - startTime).toBeLessThan(1000);
    });
  });
});
