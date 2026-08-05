import { validateDaysOfWeek } from './validation';

describe('validateDaysOfWeek', () => {
  it('accepts undefined and valid day arrays', () => {
    expect(() => validateDaysOfWeek(undefined)).not.toThrow();
    expect(() => validateDaysOfWeek([])).not.toThrow();
    expect(() => validateDaysOfWeek([0, 1, 2, 3, 4, 5, 6])).not.toThrow();
  });

  it('rejects out-of-range, fractional, and oversized inputs', () => {
    expect(() => validateDaysOfWeek([7])).toThrow();
    expect(() => validateDaysOfWeek([-1])).toThrow();
    expect(() => validateDaysOfWeek([999])).toThrow();
    expect(() => validateDaysOfWeek([1.5])).toThrow();
    expect(() => validateDaysOfWeek([0, 1, 2, 3, 4, 5, 6, 0])).toThrow();
  });
});
