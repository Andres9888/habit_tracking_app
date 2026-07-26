/**
 * Enhanced Validation Utilities Tests
 * Edge cases for input validation and sanitization
 */

import {
  validateHabitName,
  validateDateString,
  validateHabitsArray,
  safeParseNumber,
} from '../validation';
import {
  MAX_HABIT_NAME_LENGTH,
  MIN_HABIT_NAME_LENGTH,
} from '@/constants';

describe('validation - enhanced edge cases', () => {
  describe('validateHabitName', () => {
    describe('null/undefined edge cases', () => {
      it('handles null input', () => {
        const result = validateHabitName(null as unknown as string);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Habit name is required');
        expect(result.sanitized).toBe('');
      });

      it('handles undefined input', () => {
        const result = validateHabitName(undefined as unknown as string);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Habit name is required');
      });
    });

    describe('whitespace edge cases', () => {
      it('trims leading whitespace', () => {
        const result = validateHabitName('   Exercise');
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe('Exercise');
      });

      it('trims trailing whitespace', () => {
        const result = validateHabitName('Exercise   ');
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe('Exercise');
      });

      it('trims both leading and trailing whitespace', () => {
        const result = validateHabitName('   Exercise   ');
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe('Exercise');
      });

      it('rejects whitespace-only input', () => {
        const result = validateHabitName('     ');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Habit name cannot be empty');
      });

      it('rejects tabs and newlines only', () => {
        const result = validateHabitName('\t\n  ');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Habit name cannot be empty');
      });

      it('preserves internal whitespace', () => {
        const result = validateHabitName('  Morning  Meditation  ');
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe('Morning  Meditation');
      });
    });

    describe('length edge cases', () => {
      it('rejects names shorter than the current minimum', () => {
        const result = validateHabitName('X');
        expect(MIN_HABIT_NAME_LENGTH).toBe(2);
        expect(result.isValid).toBe(false);
        expect(result.sanitized).toBe('X');
      });

      it('accepts name at maximum length', () => {
        const maxName = 'a'.repeat(MAX_HABIT_NAME_LENGTH);
        const result = validateHabitName(maxName);
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe(maxName);
      });

      it('rejects name exceeding maximum length', () => {
        const tooLong = 'a'.repeat(MAX_HABIT_NAME_LENGTH + 1);
        const result = validateHabitName(tooLong);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain(
          `${MAX_HABIT_NAME_LENGTH} characters or less`
        );
      });

      it('truncates overly long name in sanitized output', () => {
        const tooLong = 'a'.repeat(MAX_HABIT_NAME_LENGTH + 50);
        const result = validateHabitName(tooLong);
        expect(result.sanitized).toHaveLength(MAX_HABIT_NAME_LENGTH);
      });

      it('handles empty string', () => {
        const result = validateHabitName('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Habit name cannot be empty');
      });
    });

    describe('special character edge cases', () => {
      it('accepts emoji in habit name', () => {
        const result = validateHabitName('🏃 Running');
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe('🏃 Running');
      });

      it('accepts multiple emojis', () => {
        const result = validateHabitName('🌅 🏃‍♂️ Morning Run 💪');
        expect(result.isValid).toBe(true);
      });

      it('accepts special characters', () => {
        const result = validateHabitName('Read "Book" (30 min)');
        expect(result.isValid).toBe(true);
      });

      it('accepts unicode characters', () => {
        const result = validateHabitName('学习中文 (Study Chinese)');
        expect(result.isValid).toBe(true);
      });

      it('accepts newlines and preserves them after trim', () => {
        const result = validateHabitName('Multi\nLine\nHabit');
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe('Multi\nLine\nHabit');
      });
    });

    describe('type coercion edge cases', () => {
      it('converts number to string', () => {
        const result = validateHabitName(123 as unknown as string);
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe('123');
      });

      it('converts boolean to string', () => {
        const result = validateHabitName(true as unknown as string);
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toBe('true');
      });

      it('converts object to string', () => {
        const result = validateHabitName({ name: 'test' } as unknown as string);
        expect(result.isValid).toBe(true);
        expect(result.sanitized).toContain('object');
      });
    });
  });

  describe('validateDateString', () => {
    describe('format validation edge cases', () => {
      it('rejects invalid format - missing separator', () => {
        const result = validateDateString('20240215');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('Invalid date format');
      });

      it('rejects invalid format - wrong separator', () => {
        const result = validateDateString('2024/02/15');
        expect(result.isValid).toBe(false);
      });

      it('rejects invalid format - single digit month', () => {
        const result = validateDateString('2024-2-15');
        expect(result.isValid).toBe(false);
      });

      it('rejects invalid format - single digit day', () => {
        const result = validateDateString('2024-02-5');
        expect(result.isValid).toBe(false);
      });

      it('rejects invalid format - extra components', () => {
        const result = validateDateString('2024-02-15-extra');
        expect(result.isValid).toBe(false);
      });

      it('rejects ISO datetime format', () => {
        const result = validateDateString('2024-02-15T12:00:00Z');
        expect(result.isValid).toBe(false);
      });
    });

    describe('date validity edge cases', () => {
      it('rejects February 30', () => {
        const result = validateDateString('2024-02-30');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('does not exist');
      });

      it('rejects February 31', () => {
        const result = validateDateString('2024-02-31');
        expect(result.isValid).toBe(false);
      });

      it('accepts February 29 in leap year', () => {
        const result = validateDateString('2024-02-29');
        expect(result.isValid).toBe(true);
      });

      it('rejects February 29 in non-leap year', () => {
        const result = validateDateString('2023-02-29');
        expect(result.isValid).toBe(false);
      });

      it('rejects April 31 (30-day month)', () => {
        const result = validateDateString('2024-04-31');
        expect(result.isValid).toBe(false);
      });

      it('accepts January 31 (31-day month)', () => {
        const result = validateDateString('2024-01-31');
        expect(result.isValid).toBe(true);
      });

      it('rejects month 13', () => {
        const result = validateDateString('2024-13-01');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('out of valid range');
      });

      it('rejects month 0', () => {
        const result = validateDateString('2024-00-15');
        expect(result.isValid).toBe(false);
      });

      it('rejects day 0', () => {
        const result = validateDateString('2024-02-00');
        expect(result.isValid).toBe(false);
      });

      it('rejects day 32', () => {
        const result = validateDateString('2024-01-32');
        expect(result.isValid).toBe(false);
      });
    });

    describe('range validation edge cases', () => {
      it('rejects dates before 1900', () => {
        const result = validateDateString('1899-12-31');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('out of valid range');
      });

      it('rejects valid dates outside the supported history window', () => {
        const result = validateDateString('1900-01-01');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('more than 5 years in the past');
      });

      it('rejects dates after 2100', () => {
        const result = validateDateString('2101-01-01');
        expect(result.isValid).toBe(false);
      });

      it('rejects valid dates outside the supported future window', () => {
        const result = validateDateString('2100-12-31');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('more than 2 years in the future');
      });

      it('rejects dates more than 5 years in past', () => {
        const fiveYearsAgo = new Date();
        fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);
        fiveYearsAgo.setDate(fiveYearsAgo.getDate() - 1);
        
        const dateStr = fiveYearsAgo.toISOString().split('T')[0];
        const result = validateDateString(dateStr);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('more than 5 years in the past');
      });

      it('rejects dates more than 2 years in future', () => {
        const twoYearsAhead = new Date();
        twoYearsAhead.setFullYear(twoYearsAhead.getFullYear() + 2);
        twoYearsAhead.setDate(twoYearsAhead.getDate() + 1);
        
        const dateStr = twoYearsAhead.toISOString().split('T')[0];
        const result = validateDateString(dateStr);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('more than 2 years in the future');
      });
    });

    describe('boundary dates', () => {
      it('applies the supported range after calendar validation', () => {
        const result = validateDateString('2000-02-29');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain('more than 5 years in the past');
      });

      it('handles non-leap year century (1900 not leap year)', () => {
        const result = validateDateString('1900-02-29');
        expect(result.isValid).toBe(false);
      });

      it('handles year 2100 (not a leap year)', () => {
        const result = validateDateString('2100-02-29');
        expect(result.isValid).toBe(false);
      });
    });
  });

  describe('validateHabitsArray', () => {
    describe('type validation', () => {
      it('rejects non-array input', () => {
        const result = validateHabitsArray('not an array' as unknown as []);
        expect(result.isValid).toBe(false);
        expect(result.warning).toContain('must be an array');
        expect(result.limited).toEqual([]);
      });

      it('rejects null', () => {
        const result = validateHabitsArray(null as unknown as []);
        expect(result.isValid).toBe(false);
      });

      it('rejects undefined', () => {
        const result = validateHabitsArray(undefined as unknown as []);
        expect(result.isValid).toBe(false);
      });

      it('accepts empty array', () => {
        const result = validateHabitsArray([]);
        expect(result.isValid).toBe(true);
        expect(result.limited).toEqual([]);
        expect(result.warning).toBeUndefined();
      });
    });

    describe('size limits', () => {
      it('accepts small array', () => {
        const habits = [1, 2, 3];
        const result = validateHabitsArray(habits);
        expect(result.isValid).toBe(true);
        expect(result.limited).toEqual(habits);
        expect(result.warning).toBeUndefined();
      });

      it('accepts array at limit', () => {
        const habits = Array.from({ length: 500 }, (_, i) => i);
        const result = validateHabitsArray(habits);
        expect(result.isValid).toBe(true);
        expect(result.limited).toHaveLength(500);
        expect(result.warning).toBeUndefined();
      });

      it('limits array exceeding maximum', () => {
        const habits = Array.from({ length: 600 }, (_, i) => i);
        const result = validateHabitsArray(habits);
        expect(result.isValid).toBe(true);
        expect(result.limited).toHaveLength(500);
        expect(result.warning).toContain('Too many habits');
      });

      it('warns about truncated habits', () => {
        const habits = Array.from({ length: 550 }, (_, i) => i);
        const result = validateHabitsArray(habits);
        expect(result.warning).toContain('550');
        expect(result.warning).toContain('500');
      });

      it('preserves first 500 items when limiting', () => {
        const habits = Array.from({ length: 600 }, (_, i) => i);
        const result = validateHabitsArray(habits);
        expect(result.limited[0]).toBe(0);
        expect(result.limited[499]).toBe(499);
        expect(result.limited.length).toBe(500);
      });
    });
  });

  describe('safeParseNumber', () => {
    describe('valid number parsing', () => {
      it('returns number as-is', () => {
        expect(safeParseNumber(42, 0)).toBe(42);
      });

      it('parses string number', () => {
        expect(safeParseNumber('42', 0)).toBe(42);
      });

      it('parses decimal string', () => {
        expect(safeParseNumber('3.14', 0)).toBe(3.14);
      });

      it('parses negative number', () => {
        expect(safeParseNumber('-10', 0)).toBe(-10);
      });

      it('parses scientific notation', () => {
        expect(safeParseNumber('1e3', 0)).toBe(1000);
      });
    });

    describe('invalid input handling', () => {
      it('returns default for NaN', () => {
        expect(safeParseNumber(NaN, 100)).toBe(100);
      });

      it('returns default for invalid string', () => {
        expect(safeParseNumber('not a number', 50)).toBe(50);
      });

      it('returns default for Infinity', () => {
        expect(safeParseNumber(Infinity, 0)).toBe(0);
      });

      it('returns default for -Infinity', () => {
        expect(safeParseNumber(-Infinity, 0)).toBe(0);
      });

      it('returns default for null', () => {
        expect(safeParseNumber(null, 42)).toBe(42);
      });

      it('returns default for undefined', () => {
        expect(safeParseNumber(undefined, 42)).toBe(42);
      });

      it('returns default for object', () => {
        expect(safeParseNumber({}, 10)).toBe(10);
      });

      it('returns default for array', () => {
        expect(safeParseNumber([], 10)).toBe(10);
      });
    });

    describe('bounds enforcement', () => {
      it('enforces minimum bound', () => {
        expect(safeParseNumber(5, 0, 10)).toBe(10);
      });

      it('enforces maximum bound', () => {
        expect(safeParseNumber(100, 0, undefined, 50)).toBe(50);
      });

      it('enforces both bounds', () => {
        expect(safeParseNumber(5, 0, 10, 20)).toBe(10);
        expect(safeParseNumber(25, 0, 10, 20)).toBe(20);
      });

      it('returns value within bounds', () => {
        expect(safeParseNumber(15, 0, 10, 20)).toBe(15);
      });

      it('handles negative bounds', () => {
        expect(safeParseNumber(-5, 0, -10, -1)).toBe(-5);
        expect(safeParseNumber(-15, 0, -10, -1)).toBe(-10);
      });

      it('allows value equal to min bound', () => {
        expect(safeParseNumber(10, 0, 10, 20)).toBe(10);
      });

      it('allows value equal to max bound', () => {
        expect(safeParseNumber(20, 0, 10, 20)).toBe(20);
      });
    });

    describe('edge cases', () => {
      it('handles zero', () => {
        expect(safeParseNumber(0, 1)).toBe(0);
      });

      it('handles negative zero', () => {
        expect(safeParseNumber(-0, 1)).toBe(0);
      });

      it('handles very large numbers', () => {
        expect(safeParseNumber(1e308, 0)).toBe(1e308);
      });

      it('handles very small numbers', () => {
        expect(safeParseNumber(1e-308, 0)).toBe(1e-308);
      });

      it('handles string with whitespace', () => {
        expect(safeParseNumber('  42  ', 0)).toBe(42);
      });

      it('handles string with leading +', () => {
        expect(safeParseNumber('+42', 0)).toBe(42);
      });
    });
  });
});
