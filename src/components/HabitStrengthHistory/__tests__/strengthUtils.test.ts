/**
 * Habit Strength Utility Functions - Unit Tests
 *
 * Tests the core algorithm and edge cases for strength calculation.
 * Based on Loop Habit Tracker's exponential smoothing algorithm.
 */

import { addDays, subDays } from 'date-fns';

import {
  calculateCompletionRate,
  calculateDelta,
  calculateStrengthAtDate,
  calculateStrengthExtremes,
  formatDateString,
  generateStrengthTimeline,
  getStrengthColor,
  getStrengthColors,
  getStrengthLabel,
  isPerfectStreak,
} from '../strengthUtils';
import type { StrengthSnapshot } from '../types';

describe('formatDateString', () => {
  it('formats date as YYYY-MM-DD', () => {
    const date = new Date('2024-06-15T12:30:00');
    expect(formatDateString(date)).toBe('2024-06-15');
  });

  it('handles single-digit months and days with zero padding', () => {
    // Use local timezone constructor to avoid UTC/local timezone conversion issues
    const date = new Date(2024, 0, 5); // Month is 0-indexed
    expect(formatDateString(date)).toBe('2024-01-05');
  });
});

describe('calculateStrengthAtDate', () => {
  // Helper to create local timezone dates (avoids UTC midnight issues)
  const localDate = (year: number, month: number, day: number) =>
    new Date(year, month - 1, day); // month is 0-indexed

  it('returns 0 for empty completedDates', () => {
    const completedDates = new Set<string>();
    const habitCreatedAt = localDate(2024, 1, 1);
    const targetDate = localDate(2024, 1, 10);

    const strength = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      targetDate
    );

    // 10 days of decay: 0 * 0.95^10 = 0
    expect(strength).toBe(0);
  });

  it('grows strength on consecutive completions', () => {
    const habitCreatedAt = localDate(2024, 1, 1);
    const completedDates = new Set([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
      '2024-01-04',
      '2024-01-05',
    ]);
    const targetDate = localDate(2024, 1, 5);

    const strength = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      targetDate
    );

    // After 5 consecutive completions: 5% + 4.75% + 4.51% + 4.29% + 4.07% ≈ 22.6%
    // Actual value with rounding: 18.5% - 23% depending on implementation
    expect(strength).toBeGreaterThan(18);
    expect(strength).toBeLessThan(25);
  });

  it('decays strength on missed days', () => {
    const habitCreatedAt = localDate(2024, 1, 1);
    const completedDates = new Set([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
      '2024-01-04',
      '2024-01-05',
    ]);

    // Check strength after 5 completions
    const strengthAfterCompletions = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      localDate(2024, 1, 5)
    );

    // Check strength after 5 more days of no completions
    const strengthAfterDecay = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      localDate(2024, 1, 10)
    );

    expect(strengthAfterDecay).toBeLessThan(strengthAfterCompletions);
    // After 5 days of decay at 0.95, should be ~77.4% of original
    expect(strengthAfterDecay).toBeCloseTo(
      strengthAfterCompletions * Math.pow(0.95, 5),
      0
    );
  });

  it('reaches approximately 95%+ after 60 perfect days', () => {
    const habitCreatedAt = localDate(2024, 1, 1);
    const completedDates = new Set<string>();

    // Generate 60 consecutive completion dates
    for (let i = 0; i < 60; i++) {
      completedDates.add(formatDateString(addDays(habitCreatedAt, i)));
    }

    const targetDate = addDays(habitCreatedAt, 59);
    const strength = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      targetDate
    );

    // Should be approaching 100% asymptotically
    expect(strength).toBeGreaterThan(95);
  });

  it('reaches approximately 99%+ after 90 perfect days', () => {
    const habitCreatedAt = localDate(2024, 1, 1);
    const completedDates = new Set<string>();

    // Generate 90 consecutive completion dates
    for (let i = 0; i < 90; i++) {
      completedDates.add(formatDateString(addDays(habitCreatedAt, i)));
    }

    const targetDate = addDays(habitCreatedAt, 89);
    const strength = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      targetDate
    );

    // Should be very close to 100% (99% or higher)
    expect(strength).toBeGreaterThanOrEqual(99);
  });

  it('returns 0 if targetDate is before habitCreatedAt', () => {
    const completedDates = new Set(['2024-01-01']);
    const habitCreatedAt = localDate(2024, 1, 5);
    const targetDate = localDate(2024, 1, 1);

    const strength = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      targetDate
    );

    expect(strength).toBe(0);
  });

  it('handles single day correctly', () => {
    const habitCreatedAt = localDate(2024, 1, 1);
    const completedDates = new Set(['2024-01-01']);
    const targetDate = localDate(2024, 1, 1);

    const strength = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      targetDate
    );

    // First completion: 0 + (1 - 0) * 0.05 = 0.05 = 5%
    expect(strength).toBe(5);
  });
});

describe('getStrengthLabel', () => {
  it('returns weak for 0-29%', () => {
    expect(getStrengthLabel(0)).toBe('weak');
    expect(getStrengthLabel(15)).toBe('weak');
    expect(getStrengthLabel(29)).toBe('weak');
    expect(getStrengthLabel(29.9)).toBe('weak');
  });

  it('returns developing for 30-69%', () => {
    expect(getStrengthLabel(30)).toBe('developing');
    expect(getStrengthLabel(50)).toBe('developing');
    expect(getStrengthLabel(69)).toBe('developing');
    expect(getStrengthLabel(69.9)).toBe('developing');
  });

  it('returns strong for 70-100%', () => {
    expect(getStrengthLabel(70)).toBe('strong');
    expect(getStrengthLabel(85)).toBe('strong');
    expect(getStrengthLabel(100)).toBe('strong');
  });

  it('handles edge cases at boundaries', () => {
    // At exact boundaries
    expect(getStrengthLabel(30)).toBe('developing');
    expect(getStrengthLabel(70)).toBe('strong');
  });
});

describe('getStrengthColor', () => {
  // Colors updated to WCAG AA compliant variants (4.5:1 contrast minimum)
  it('returns red-600 for weak strength (WCAG AA compliant)', () => {
    const color = getStrengthColor(15);
    expect(color).toBe('#dc2626'); // Red-600
  });

  it('returns amber-700 for developing strength (WCAG AA compliant)', () => {
    const color = getStrengthColor(50);
    expect(color).toBe('#b45309'); // Amber-700
  });

  it('returns emerald-700 for strong strength (WCAG AA compliant)', () => {
    const color = getStrengthColor(85);
    expect(color).toBe('#047857'); // Emerald-700
  });
});

describe('getStrengthColors', () => {
  // Primary colors updated to WCAG AA compliant variants
  it('returns full color palette for weak strength', () => {
    const colors = getStrengthColors(15);
    expect(colors).toEqual({
      primary: '#dc2626', // Red-600 (WCAG AA: 4.83:1)
      background: '#fef2f2',
      ring: '#fca5a5',
    });
  });

  it('returns full color palette for developing strength', () => {
    const colors = getStrengthColors(50);
    expect(colors).toEqual({
      primary: '#b45309', // Amber-700 (WCAG AA: 5.02:1)
      background: '#fffbeb',
      ring: '#fcd34d',
    });
  });

  it('returns full color palette for strong strength', () => {
    const colors = getStrengthColors(85);
    expect(colors).toEqual({
      primary: '#047857', // Emerald-700 (WCAG AA: 5.48:1)
      background: '#ecfdf5',
      ring: '#6ee7b7',
    });
  });
});

describe('generateStrengthTimeline', () => {
  it('returns all points for short histories', () => {
    const habitCreatedAt = subDays(new Date(), 30);
    const completedDates = new Set<string>();

    const timeline = generateStrengthTimeline(
      completedDates,
      habitCreatedAt,
      100
    );

    expect(timeline.length).toBe(31); // 30 days + today
  });

  it('samples to max points for long histories', () => {
    const habitCreatedAt = subDays(new Date(), 365);
    const completedDates = new Set<string>();

    const timeline = generateStrengthTimeline(
      completedDates,
      habitCreatedAt,
      50
    );

    expect(timeline.length).toBe(50);
  });

  it('includes first and last day when sampling', () => {
    const habitCreatedAt = subDays(new Date(), 200);
    const completedDates = new Set<string>();

    const timeline = generateStrengthTimeline(
      completedDates,
      habitCreatedAt,
      50
    );

    // First point should be from habit creation date
    expect(timeline[0].dateString).toBe(formatDateString(habitCreatedAt));

    // Last point should be today
    expect(timeline[timeline.length - 1].dateString).toBe(
      formatDateString(new Date())
    );
  });

  it('returns snapshots with all required fields', () => {
    const habitCreatedAt = subDays(new Date(), 5);
    const completedDates = new Set([formatDateString(habitCreatedAt)]);

    const timeline = generateStrengthTimeline(completedDates, habitCreatedAt);

    expect(timeline.length).toBe(6);
    expect(timeline[0]).toMatchObject({
      dateString: formatDateString(habitCreatedAt),
      strength: 5, // First completion = 5%
      label: 'weak',
    });
    expect(timeline[0].date).toBeInstanceOf(Date);
  });

  it('returns empty array characteristics for brand new habit', () => {
    const today = new Date();
    const completedDates = new Set<string>();

    const timeline = generateStrengthTimeline(completedDates, today);

    expect(timeline.length).toBe(1);
    expect(timeline[0].strength).toBe(0);
    expect(timeline[0].label).toBe('weak');
  });
});

describe('calculateStrengthExtremes', () => {
  it('returns same snapshot for both when given single entry', () => {
    const snapshot: StrengthSnapshot = {
      date: new Date(),
      dateString: '2024-01-01',
      strength: 50,
      label: 'developing',
    };

    const { peak, lowest } = calculateStrengthExtremes([snapshot]);

    expect(peak).toBe(snapshot);
    expect(lowest).toBe(snapshot);
  });

  it('finds peak from multiple entries', () => {
    const snapshots: StrengthSnapshot[] = [
      {
        date: new Date('2024-01-01'),
        dateString: '2024-01-01',
        strength: 10,
        label: 'weak',
      },
      {
        date: new Date('2024-01-02'),
        dateString: '2024-01-02',
        strength: 50,
        label: 'developing',
      },
      {
        date: new Date('2024-01-03'),
        dateString: '2024-01-03',
        strength: 80,
        label: 'strong',
      },
      {
        date: new Date('2024-01-04'),
        dateString: '2024-01-04',
        strength: 60,
        label: 'developing',
      },
    ];

    const { peak } = calculateStrengthExtremes(snapshots);

    expect(peak.strength).toBe(80);
    expect(peak.dateString).toBe('2024-01-03');
  });

  it('excludes first day when finding lowest', () => {
    const snapshots: StrengthSnapshot[] = [
      {
        date: new Date('2024-01-01'),
        dateString: '2024-01-01',
        strength: 0,
        label: 'weak',
      },
      {
        date: new Date('2024-01-02'),
        dateString: '2024-01-02',
        strength: 5,
        label: 'weak',
      },
      {
        date: new Date('2024-01-03'),
        dateString: '2024-01-03',
        strength: 10,
        label: 'weak',
      },
      {
        date: new Date('2024-01-04'),
        dateString: '2024-01-04',
        strength: 8,
        label: 'weak',
      },
    ];

    const { lowest } = calculateStrengthExtremes(snapshots);

    // Should be 5 (day 2), not 0 (day 1)
    expect(lowest.strength).toBe(5);
    expect(lowest.dateString).toBe('2024-01-02');
  });

  it('returns default snapshot for empty array', () => {
    const { peak, lowest } = calculateStrengthExtremes([]);

    expect(peak.strength).toBe(0);
    expect(lowest.strength).toBe(0);
    expect(peak.label).toBe('weak');
    expect(lowest.label).toBe('weak');
  });
});

describe('calculateDelta', () => {
  it('returns positive delta for improvement', () => {
    const delta = calculateDelta(75, 50);
    expect(delta).toBe(25);
  });

  it('returns negative delta for decline', () => {
    const delta = calculateDelta(30, 50);
    expect(delta).toBe(-20);
  });

  it('returns 0 for no change', () => {
    const delta = calculateDelta(50, 50);
    expect(delta).toBe(0);
  });

  it('handles decimal values correctly', () => {
    const delta = calculateDelta(75.5, 50.2);
    expect(delta).toBe(25.3);
  });
});

describe('calculateCompletionRate', () => {
  it('returns 100 for full completion', () => {
    const completedDates = new Set(['2024-01-01', '2024-01-02', '2024-01-03']);
    const rate = calculateCompletionRate(completedDates, 3);
    expect(rate).toBe(100);
  });

  it('returns 50 for half completion', () => {
    const completedDates = new Set(['2024-01-01', '2024-01-03']);
    const rate = calculateCompletionRate(completedDates, 4);
    expect(rate).toBe(50);
  });

  it('returns 0 for no completions', () => {
    const completedDates = new Set<string>();
    const rate = calculateCompletionRate(completedDates, 10);
    expect(rate).toBe(0);
  });

  it('returns 0 when habitAgeDays is 0', () => {
    const completedDates = new Set(['2024-01-01']);
    const rate = calculateCompletionRate(completedDates, 0);
    expect(rate).toBe(0);
  });

  it('returns 0 when habitAgeDays is negative', () => {
    const completedDates = new Set(['2024-01-01']);
    const rate = calculateCompletionRate(completedDates, -5);
    expect(rate).toBe(0);
  });

  it('rounds to nearest integer', () => {
    const completedDates = new Set(['2024-01-01', '2024-01-02']);
    const rate = calculateCompletionRate(completedDates, 3);
    expect(rate).toBe(67); // 2/3 = 66.666... rounds to 67
  });
});

describe('isPerfectStreak', () => {
  it('returns true when all days are completed (>= 3 days)', () => {
    const completedDates = new Set(['2024-01-01', '2024-01-02', '2024-01-03']);
    expect(isPerfectStreak(completedDates, 3)).toBe(true);
  });

  it('returns true when completions exceed habit age', () => {
    // Edge case: more completions than days (shouldn't happen but defensive)
    const completedDates = new Set([
      '2024-01-01',
      '2024-01-02',
      '2024-01-03',
      '2024-01-04',
    ]);
    expect(isPerfectStreak(completedDates, 3)).toBe(true);
  });

  it('returns false when not all days are completed', () => {
    const completedDates = new Set(['2024-01-01', '2024-01-03']);
    expect(isPerfectStreak(completedDates, 3)).toBe(false);
  });

  it('returns false for habits younger than 3 days (1 day)', () => {
    const completedDates = new Set(['2024-01-01']);
    expect(isPerfectStreak(completedDates, 1)).toBe(false);
  });

  it('returns false for habits younger than 3 days (2 days)', () => {
    const completedDates = new Set(['2024-01-01', '2024-01-02']);
    expect(isPerfectStreak(completedDates, 2)).toBe(false);
  });

  it('returns false for empty completedDates', () => {
    const completedDates = new Set<string>();
    expect(isPerfectStreak(completedDates, 5)).toBe(false);
  });

  it('works for long streaks', () => {
    const completedDates = new Set<string>();
    for (let i = 1; i <= 100; i++) {
      completedDates.add(`2024-01-${String(i).padStart(2, '0')}`);
    }
    expect(isPerfectStreak(completedDates, 100)).toBe(true);
  });
});

describe('Algorithm Behavior', () => {
  /**
   * These tests verify the algorithm matches Loop Habit Tracker's behavior.
   */

  // Helper to create local timezone dates (avoids UTC midnight issues)
  const localDate = (year: number, month: number, day: number) =>
    new Date(year, month - 1, day); // month is 0-indexed

  it('alternating completions/misses reaches a stable equilibrium', () => {
    // Simulate 60 days of alternating: complete, miss, complete, miss...
    const habitCreatedAt = localDate(2024, 1, 1);
    const completedDates = new Set<string>();

    for (let i = 0; i < 60; i += 2) {
      completedDates.add(formatDateString(addDays(habitCreatedAt, i)));
    }

    const targetDate = addDays(habitCreatedAt, 59);
    const strength = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      targetDate
    );

    // With 50% completion rate, equilibrium should be around 50%
    // The exact value depends on the algorithm, but should stabilize
    expect(strength).toBeGreaterThan(40);
    expect(strength).toBeLessThan(60);
  });

  it('weekend-only completions reach lower equilibrium', () => {
    // Simulate 8 weeks where only Saturday and Sunday are completed
    const habitCreatedAt = localDate(2024, 1, 1); // Monday
    const completedDates = new Set<string>();

    for (let week = 0; week < 8; week++) {
      const saturday = addDays(habitCreatedAt, week * 7 + 5);
      const sunday = addDays(habitCreatedAt, week * 7 + 6);
      completedDates.add(formatDateString(saturday));
      completedDates.add(formatDateString(sunday));
    }

    const targetDate = addDays(habitCreatedAt, 55);
    const strength = calculateStrengthAtDate(
      completedDates,
      habitCreatedAt,
      targetDate
    );

    // 2/7 = ~28.5% completion rate, equilibrium should be around 25-35%
    expect(strength).toBeGreaterThan(20);
    expect(strength).toBeLessThan(40);
  });
});
