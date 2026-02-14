/**
 * Date Utility Functions Tests
 * Tests for date handling utilities used in habit tracking
 */

import {
  getTodayDateKey,
  getTodayForTimezone,
  maxDateKey,
  isValidDateFormat,
  isFutureDate,
  findMaxOrder,
} from '../../../convex/habits/utils';

describe('Habit Date Utilities', () => {
  describe('getTodayDateKey', () => {
    it('should return today in YYYY-MM-DD format', () => {
      const result = getTodayDateKey();
      const expected = new Date().toISOString().split('T')[0];
      expect(result).toBe(expected);
    });

    it('should always return 10 characters (YYYY-MM-DD)', () => {
      const result = getTodayDateKey();
      expect(result.length).toBe(10);
    });
  });

  describe('getTodayForTimezone', () => {
    it('should return UTC date when no timezone provided', () => {
      const result = getTodayForTimezone();
      const expected = new Date().toISOString().split('T')[0];
      expect(result).toBe(expected);
    });

    it('should handle valid timezone', () => {
      const result = getTodayForTimezone('America/Denver');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('should fallback to UTC for invalid timezone', () => {
      const result = getTodayForTimezone('Invalid/Timezone');
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('maxDateKey', () => {
    it('should return first date if larger', () => {
      expect(maxDateKey('2025-02-15', '2025-02-10')).toBe('2025-02-15');
    });

    it('should return second date if larger', () => {
      expect(maxDateKey('2025-02-05', '2025-02-10')).toBe('2025-02-10');
    });

    it('should handle same dates', () => {
      expect(maxDateKey('2025-02-10', '2025-02-10')).toBe('2025-02-10');
    });

    it('should handle year boundaries', () => {
      expect(maxDateKey('2024-12-31', '2025-01-01')).toBe('2025-01-01');
    });
  });

  describe('isValidDateFormat', () => {
    it('should return true for valid date format', () => {
      expect(isValidDateFormat('2025-01-15')).toBe(true);
    });

    it('should return false for invalid format', () => {
      expect(isValidDateFormat('01-15-2025')).toBe(false);
      expect(isValidDateFormat('2025/01/15')).toBe(false);
      expect(isValidDateFormat('2025-1-5')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidDateFormat('')).toBe(false);
    });

    it('should return true for format validation only (not semantic validity)', () => {
      // The function only validates format, not actual date validity
      expect(isValidDateFormat('2025-13-01')).toBe(true); // Invalid month but valid format
      expect(isValidDateFormat('2025-02-30')).toBe(true); // Invalid day but valid format
    });
  });

  describe('isFutureDate', () => {
    it('should return false for today', () => {
      const today = getTodayDateKey();
      expect(isFutureDate(today)).toBe(false);
    });

    it('should return false for past dates', () => {
      expect(isFutureDate('2020-01-01')).toBe(false);
      expect(isFutureDate('2024-01-01')).toBe(false);
    });

    it('should return true for far future dates', () => {
      expect(isFutureDate('2030-01-01')).toBe(true);
    });

    it('should allow 24-hour grace period for timezone differences', () => {
      // This test verifies the grace period logic
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];
      // Should return false due to grace period
      expect(isFutureDate(tomorrowStr)).toBe(false);
    });
  });

  describe('findMaxOrder', () => {
    it('should return -1 for empty array', () => {
      expect(findMaxOrder([])).toBe(-1);
    });

    it('should find max order from habits', () => {
      const habits = [{ order: 1 }, { order: 5 }, { order: 3 }];
      expect(findMaxOrder(habits)).toBe(5);
    });

    it('should handle missing order values', () => {
      const habits = [{ name: 'habit1' }, { order: 2 }, { name: 'habit3' }];
      expect(findMaxOrder(habits)).toBe(2);
    });

    it('should handle negative orders', () => {
      const habits = [{ order: -1 }, { order: 0 }, { order: 5 }];
      expect(findMaxOrder(habits)).toBe(5);
    });
  });
});
