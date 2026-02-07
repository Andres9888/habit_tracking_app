/**
 * Habit Utility Functions Tests
 *
 * Tests for date utility helpers used in streak/stats calculations.
 * Focuses on UTC correctness and string-based date arithmetic.
 */

import { describe, it, expect } from 'vitest';
import {
  getTodayUTCDateKey,
  subtractDaysFromDateKey,
  isValidDateFormat,
  maxDateKey,
} from './utils';

describe('getTodayUTCDateKey', () => {
  it('should return a YYYY-MM-DD formatted string', () => {
    const result = getTodayUTCDateKey();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should match Date UTC components', () => {
    const result = getTodayUTCDateKey();
    const now = new Date();
    const expected = [
      now.getUTCFullYear(),
      String(now.getUTCMonth() + 1).padStart(2, '0'),
      String(now.getUTCDate()).padStart(2, '0'),
    ].join('-');
    expect(result).toBe(expected);
  });
});

describe('subtractDaysFromDateKey', () => {
  it('should subtract 0 days (identity)', () => {
    expect(subtractDaysFromDateKey('2025-03-15', 0)).toBe('2025-03-15');
  });

  it('should subtract 1 day within same month', () => {
    expect(subtractDaysFromDateKey('2025-03-15', 1)).toBe('2025-03-14');
  });

  it('should cross month boundary', () => {
    expect(subtractDaysFromDateKey('2025-03-01', 1)).toBe('2025-02-28');
  });

  it('should handle leap year Feb 29', () => {
    expect(subtractDaysFromDateKey('2024-03-01', 1)).toBe('2024-02-29');
  });

  it('should cross year boundary', () => {
    expect(subtractDaysFromDateKey('2025-01-01', 1)).toBe('2024-12-31');
  });

  it('should subtract 30 days', () => {
    expect(subtractDaysFromDateKey('2025-01-31', 30)).toBe('2025-01-01');
  });

  it('should subtract large number of days', () => {
    // 2024 is a leap year (366 days), so 365 days before 2025-01-01 is 2024-01-02
    expect(subtractDaysFromDateKey('2025-01-01', 365)).toBe('2024-01-02');
  });

  it('should return YYYY-MM-DD format with zero-padded months/days', () => {
    const result = subtractDaysFromDateKey('2025-01-05', 4);
    expect(result).toBe('2025-01-01');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('isValidDateFormat', () => {
  it('should accept valid YYYY-MM-DD', () => {
    expect(isValidDateFormat('2025-01-15')).toBe(true);
  });

  it('should reject invalid formats', () => {
    expect(isValidDateFormat('01-15-2025')).toBe(false);
    expect(isValidDateFormat('2025/01/15')).toBe(false);
    expect(isValidDateFormat('not-a-date')).toBe(false);
  });
});

describe('maxDateKey', () => {
  it('should return the later date', () => {
    expect(maxDateKey('2025-01-10', '2025-01-15')).toBe('2025-01-15');
  });

  it('should return the first when equal', () => {
    expect(maxDateKey('2025-01-10', '2025-01-10')).toBe('2025-01-10');
  });

  it('should handle cross-year comparison', () => {
    expect(maxDateKey('2024-12-31', '2025-01-01')).toBe('2025-01-01');
  });
});
