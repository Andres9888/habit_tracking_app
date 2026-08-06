/**
 * Tests for validation utilities (edge case guards)
 */

import {
  validateHabitName,
  validateDateString,
  validateHabitsArray,
  safeParseNumber,
} from '../validation';

describe('validateHabitName', () => {
  it('accepts valid habit names', () => {
    expect(validateHabitName('Morning run')).toEqual({
      isValid: true,
      sanitized: 'Morning run',
    });
  });

  it('trims whitespace', () => {
    expect(validateHabitName('  Meditate  ')).toEqual({
      isValid: true,
      sanitized: 'Meditate',
    });
  });

  it('rejects empty strings', () => {
    const result = validateHabitName('');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot be empty');
  });

  it('rejects whitespace-only strings', () => {
    const result = validateHabitName('   ');
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('cannot be empty');
  });

  it('rejects very long names (500+ chars)', () => {
    const longName = 'a'.repeat(500);
    const result = validateHabitName(longName);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('200 characters or less');
    expect(result.sanitized).toHaveLength(200);
  });

  it('handles null/undefined gracefully', () => {
    const result = validateHabitName(null as unknown);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('required');
  });
});

describe('validateDateString', () => {
  it('accepts valid dates', () => {
    expect(validateDateString('2024-01-15').isValid).toBe(true);
    expect(validateDateString('2026-02-15').isValid).toBe(true);
  });

  it('rejects invalid formats', () => {
    expect(validateDateString('2024/01/15').isValid).toBe(false);
    expect(validateDateString('01-15-2024').isValid).toBe(false);
    expect(validateDateString('2024-1-5').isValid).toBe(false);
  });

  it('rejects invalid dates (e.g., Feb 30)', () => {
    expect(validateDateString('2024-02-30').isValid).toBe(false);
    expect(validateDateString('2024-13-01').isValid).toBe(false);
  });

  it('rejects dates too far in the past (5+ years)', () => {
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 6);
    const dateString = oldDate.toISOString().split('T')[0];
    expect(validateDateString(dateString).isValid).toBe(false);
  });

  it('rejects dates too far in the future (2+ years)', () => {
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 3);
    const dateString = futureDate.toISOString().split('T')[0];
    expect(validateDateString(dateString).isValid).toBe(false);
  });
});

describe('validateHabitsArray', () => {
  it('accepts valid arrays', () => {
    const habits = [{ id: '1' }, { id: '2' }];
    const result = validateHabitsArray(habits);
    expect(result.isValid).toBe(true);
    expect(result.limited).toEqual(habits);
  });

  it('handles empty arrays', () => {
    const result = validateHabitsArray([]);
    expect(result.isValid).toBe(true);
    expect(result.limited).toEqual([]);
  });

  it('limits very large arrays (100+ habits)', () => {
    const manyHabits = Array.from({ length: 600 }, (_, i) => ({ id: `${i}` }));
    const result = validateHabitsArray(manyHabits);
    expect(result.isValid).toBe(true);
    expect(result.limited).toHaveLength(500);
    expect(result.warning).toContain('Too many habits');
  });

  it('handles non-arrays gracefully', () => {
    const result = validateHabitsArray(null as unknown);
    expect(result.isValid).toBe(false);
    expect(result.limited).toEqual([]);
  });
});

describe('safeParseNumber', () => {
  it('parses valid numbers', () => {
    expect(safeParseNumber(42, 0)).toBe(42);
    expect(safeParseNumber('3.14', 0)).toBe(3.14);
  });

  it('clamps to min/max bounds', () => {
    expect(safeParseNumber(150, 0, 0, 100)).toBe(100);
    expect(safeParseNumber(-10, 0, 0, 100)).toBe(0);
  });

  it('returns default for invalid input', () => {
    expect(safeParseNumber('invalid', 50)).toBe(50);
    expect(safeParseNumber(NaN, 50)).toBe(50);
    expect(safeParseNumber(Infinity, 50)).toBe(50);
  });
});
