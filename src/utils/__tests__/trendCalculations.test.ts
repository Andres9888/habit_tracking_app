/**
 * Trend Calculation Utility Tests
 *
 * Tests for week-over-week and month-over-month trend calculation functions.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitTrackingEntry } from '../../features/habits/types';
import {
  getWeekStart,
  getWeekEnd,
  calculateWeekOverWeekTrend,
  calculateMonthOverMonthTrend,
  calculateMonthlyChangeForStatsGrid,
} from '../trendCalculations';

/**
 * Helper to create mock tracking entries
 */
function createTrackingEntry(
  date: string,
  completed: boolean
): HabitTrackingEntry {
  return {
    id: `tracking-${date}`,
    date,
    completed,
    habitId: 'test-habit' as Id<'habits'>,
    createdAt: new Date(date).getTime(),
    updatedAt: new Date(date).getTime(),
    notes: null,
  } as HabitTrackingEntry;
}

/**
 * Helper to format date to YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Helper to get a date relative to a reference date
 */
function getRelativeDate(referenceDate: Date, daysOffset: number): Date {
  const date = new Date(referenceDate);
  date.setDate(date.getDate() + daysOffset);
  return date;
}

describe('getWeekStart', () => {
  it('returns Monday for a Monday date', () => {
    // 2024-01-08 is a Monday
    const monday = new Date(2024, 0, 8);
    const result = getWeekStart(monday);
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(8);
  });

  it('returns Monday for a Wednesday date', () => {
    // 2024-01-10 is a Wednesday
    const wednesday = new Date(2024, 0, 10);
    const result = getWeekStart(wednesday);
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(8);
  });

  it('returns Monday for a Sunday date', () => {
    // 2024-01-14 is a Sunday
    const sunday = new Date(2024, 0, 14);
    const result = getWeekStart(sunday);
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(8);
  });

  it('returns Monday for a Saturday date', () => {
    // 2024-01-13 is a Saturday
    const saturday = new Date(2024, 0, 13);
    const result = getWeekStart(saturday);
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getDate()).toBe(8);
  });

  it('handles month boundaries correctly', () => {
    // 2024-02-01 is a Thursday, week starts on 2024-01-29 (Monday)
    const thursday = new Date(2024, 1, 1);
    const result = getWeekStart(thursday);
    expect(result.getDay()).toBe(1); // Monday
    expect(result.getMonth()).toBe(0); // January
    expect(result.getDate()).toBe(29);
  });
});

describe('getWeekEnd', () => {
  it('returns Sunday for a Monday date', () => {
    // 2024-01-08 is a Monday
    const monday = new Date(2024, 0, 8);
    const result = getWeekEnd(monday);
    expect(result.getDay()).toBe(0); // Sunday
    expect(result.getDate()).toBe(14);
  });

  it('returns Sunday for a Wednesday date', () => {
    // 2024-01-10 is a Wednesday
    const wednesday = new Date(2024, 0, 10);
    const result = getWeekEnd(wednesday);
    expect(result.getDay()).toBe(0); // Sunday
    expect(result.getDate()).toBe(14);
  });

  it('returns Sunday for a Sunday date (same day)', () => {
    // 2024-01-14 is a Sunday
    const sunday = new Date(2024, 0, 14);
    const result = getWeekEnd(sunday);
    expect(result.getDay()).toBe(0); // Sunday
    expect(result.getDate()).toBe(14);
  });
});

describe('calculateWeekOverWeekTrend', () => {
  describe('basic calculations', () => {
    it('returns zeros for empty tracking', () => {
      const result = calculateWeekOverWeekTrend([]);
      expect(result.thisWeekCompleted).toBe(0);
      expect(result.lastWeekCompleted).toBe(0);
      expect(result.countChange).toBe(0);
      expect(result.rateChange).toBe(0);
    });

    it('calculates correct counts for this week', () => {
      // Use a fixed reference date: Wednesday, January 10, 2024
      const referenceDate = new Date(2024, 0, 10);

      // This week: Monday Jan 8 to Wednesday Jan 10
      const tracking = [
        createTrackingEntry('2024-01-08', true), // Monday - completed
        createTrackingEntry('2024-01-09', true), // Tuesday - completed
        createTrackingEntry('2024-01-10', false), // Wednesday - not completed
      ];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.thisWeekCompleted).toBe(2);
      expect(result.thisWeekTotal).toBe(3); // Monday to Wednesday
    });

    it('calculates correct counts for last week', () => {
      // Use a fixed reference date: Wednesday, January 10, 2024
      const referenceDate = new Date(2024, 0, 10);

      // Last week: Monday Jan 1 to Sunday Jan 7
      const tracking = [
        createTrackingEntry('2024-01-01', true), // Monday
        createTrackingEntry('2024-01-02', true), // Tuesday
        createTrackingEntry('2024-01-03', true), // Wednesday
        createTrackingEntry('2024-01-04', false), // Thursday
        createTrackingEntry('2024-01-05', true), // Friday
        createTrackingEntry('2024-01-06', false), // Saturday
        createTrackingEntry('2024-01-07', true), // Sunday
      ];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.lastWeekCompleted).toBe(5);
      expect(result.lastWeekTotal).toBe(7);
    });

    it('calculates positive count change correctly', () => {
      const referenceDate = new Date(2024, 0, 14); // Sunday

      const tracking = [
        // Last week: 3 completions
        createTrackingEntry('2024-01-01', true),
        createTrackingEntry('2024-01-02', true),
        createTrackingEntry('2024-01-03', true),
        // This week: 5 completions
        createTrackingEntry('2024-01-08', true),
        createTrackingEntry('2024-01-09', true),
        createTrackingEntry('2024-01-10', true),
        createTrackingEntry('2024-01-11', true),
        createTrackingEntry('2024-01-12', true),
      ];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.countChange).toBe(2); // 5 - 3
    });

    it('calculates negative count change correctly', () => {
      const referenceDate = new Date(2024, 0, 14); // Sunday

      const tracking = [
        // Last week: 6 completions
        createTrackingEntry('2024-01-01', true),
        createTrackingEntry('2024-01-02', true),
        createTrackingEntry('2024-01-03', true),
        createTrackingEntry('2024-01-04', true),
        createTrackingEntry('2024-01-05', true),
        createTrackingEntry('2024-01-06', true),
        // This week: 2 completions
        createTrackingEntry('2024-01-08', true),
        createTrackingEntry('2024-01-09', true),
      ];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.countChange).toBe(-4); // 2 - 6
    });
  });

  describe('rate calculations', () => {
    it('calculates this week rate correctly', () => {
      const referenceDate = new Date(2024, 0, 10); // Wednesday

      const tracking = [
        createTrackingEntry('2024-01-08', true), // Monday
        createTrackingEntry('2024-01-09', true), // Tuesday
        createTrackingEntry('2024-01-10', true), // Wednesday
      ];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.thisWeekRate).toBe(100); // 3/3 = 100%
    });

    it('calculates last week rate correctly', () => {
      const referenceDate = new Date(2024, 0, 10);

      const tracking = [
        createTrackingEntry('2024-01-01', true), // 1/7
        createTrackingEntry('2024-01-03', true), // 2/7
        createTrackingEntry('2024-01-05', true), // 3/7
        createTrackingEntry('2024-01-07', true), // 4/7
      ];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.lastWeekRate).toBe(57); // 4/7 ≈ 57%
    });

    it('calculates rate change correctly', () => {
      const referenceDate = new Date(2024, 0, 14); // Sunday (full week)

      const tracking = [
        // Last week: 4/7 = 57%
        createTrackingEntry('2024-01-01', true),
        createTrackingEntry('2024-01-02', true),
        createTrackingEntry('2024-01-03', true),
        createTrackingEntry('2024-01-04', true),
        // This week: 6/7 = 86%
        createTrackingEntry('2024-01-08', true),
        createTrackingEntry('2024-01-09', true),
        createTrackingEntry('2024-01-10', true),
        createTrackingEntry('2024-01-11', true),
        createTrackingEntry('2024-01-12', true),
        createTrackingEntry('2024-01-13', true),
      ];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.rateChange).toBe(29); // 86 - 57
    });
  });

  describe('edge cases', () => {
    it('handles no completions in either week', () => {
      const referenceDate = new Date(2024, 0, 10);
      const tracking: HabitTrackingEntry[] = [];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.thisWeekRate).toBe(0);
      expect(result.lastWeekRate).toBe(0);
      expect(result.rateChange).toBe(0);
    });

    it('handles perfect week both weeks', () => {
      const referenceDate = new Date(2024, 0, 14); // Sunday

      const tracking = [
        // Last week: 7/7
        createTrackingEntry('2024-01-01', true),
        createTrackingEntry('2024-01-02', true),
        createTrackingEntry('2024-01-03', true),
        createTrackingEntry('2024-01-04', true),
        createTrackingEntry('2024-01-05', true),
        createTrackingEntry('2024-01-06', true),
        createTrackingEntry('2024-01-07', true),
        // This week: 7/7
        createTrackingEntry('2024-01-08', true),
        createTrackingEntry('2024-01-09', true),
        createTrackingEntry('2024-01-10', true),
        createTrackingEntry('2024-01-11', true),
        createTrackingEntry('2024-01-12', true),
        createTrackingEntry('2024-01-13', true),
        createTrackingEntry('2024-01-14', true),
      ];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.thisWeekRate).toBe(100);
      expect(result.lastWeekRate).toBe(100);
      expect(result.rateChange).toBe(0);
    });

    it('handles Monday reference date correctly', () => {
      // Monday is day 1 of the week, so this week only has 1 day
      const referenceDate = new Date(2024, 0, 8); // Monday

      const tracking = [
        createTrackingEntry('2024-01-08', true), // This Monday
      ];

      const result = calculateWeekOverWeekTrend(tracking, referenceDate);

      expect(result.thisWeekTotal).toBe(1);
      expect(result.thisWeekCompleted).toBe(1);
      expect(result.thisWeekRate).toBe(100);
    });
  });
});

describe('calculateMonthOverMonthTrend', () => {
  describe('basic calculations', () => {
    it('returns zeros for empty tracking', () => {
      const result = calculateMonthOverMonthTrend([]);
      expect(result.thisMonthCompleted).toBe(0);
      expect(result.lastMonthCompleted).toBe(0);
      expect(result.countChange).toBe(0);
      expect(result.rateChange).toBe(0);
    });

    it('calculates correct counts for this month', () => {
      // Reference: January 15, 2024
      const referenceDate = new Date(2024, 0, 15);

      const tracking = [
        createTrackingEntry('2024-01-01', true),
        createTrackingEntry('2024-01-05', true),
        createTrackingEntry('2024-01-10', true),
        createTrackingEntry('2024-01-15', true),
      ];

      const result = calculateMonthOverMonthTrend(tracking, referenceDate);

      expect(result.thisMonthCompleted).toBe(4);
      expect(result.thisMonthTotal).toBe(15); // Jan 1 to Jan 15
    });

    it('calculates correct counts for last month', () => {
      // Reference: February 10, 2024
      const referenceDate = new Date(2024, 1, 10);

      const tracking = [
        // January: 20 completions
        createTrackingEntry('2024-01-01', true),
        createTrackingEntry('2024-01-02', true),
        createTrackingEntry('2024-01-03', true),
        createTrackingEntry('2024-01-04', true),
        createTrackingEntry('2024-01-05', true),
        createTrackingEntry('2024-01-06', true),
        createTrackingEntry('2024-01-07', true),
        createTrackingEntry('2024-01-08', true),
        createTrackingEntry('2024-01-09', true),
        createTrackingEntry('2024-01-10', true),
        createTrackingEntry('2024-01-11', true),
        createTrackingEntry('2024-01-12', true),
        createTrackingEntry('2024-01-13', true),
        createTrackingEntry('2024-01-14', true),
        createTrackingEntry('2024-01-15', true),
        createTrackingEntry('2024-01-16', true),
        createTrackingEntry('2024-01-17', true),
        createTrackingEntry('2024-01-18', true),
        createTrackingEntry('2024-01-19', true),
        createTrackingEntry('2024-01-20', true),
      ];

      const result = calculateMonthOverMonthTrend(tracking, referenceDate);

      expect(result.lastMonthCompleted).toBe(20);
      expect(result.lastMonthTotal).toBe(31); // January has 31 days
    });

    it('calculates positive count change correctly', () => {
      // Reference: February 10, 2024
      const referenceDate = new Date(2024, 1, 10);

      const tracking = [
        // January: 10 completions
        ...Array.from({ length: 10 }, (_, i) =>
          createTrackingEntry(`2024-01-${String(i + 1).padStart(2, '0')}`, true)
        ),
        // February: 8 completions (in 10 days = 80%)
        ...Array.from({ length: 8 }, (_, i) =>
          createTrackingEntry(`2024-02-${String(i + 1).padStart(2, '0')}`, true)
        ),
      ];

      const result = calculateMonthOverMonthTrend(tracking, referenceDate);

      // January: 10/31 = 32%, February: 8/10 = 80%
      expect(result.rateChange).toBe(48); // 80 - 32
    });
  });

  describe('rate calculations', () => {
    it('calculates this month rate correctly', () => {
      const referenceDate = new Date(2024, 0, 20); // Jan 20

      const tracking = Array.from({ length: 10 }, (_, i) =>
        createTrackingEntry(`2024-01-${String(i + 1).padStart(2, '0')}`, true)
      );

      const result = calculateMonthOverMonthTrend(tracking, referenceDate);

      expect(result.thisMonthRate).toBe(50); // 10/20 = 50%
    });

    it('calculates last month rate correctly', () => {
      const referenceDate = new Date(2024, 1, 5); // Feb 5

      // December 2023: 15 completions out of 31 days
      const tracking = Array.from({ length: 15 }, (_, i) =>
        createTrackingEntry(`2024-01-${String(i + 1).padStart(2, '0')}`, true)
      );

      const result = calculateMonthOverMonthTrend(tracking, referenceDate);

      expect(result.lastMonthRate).toBe(48); // 15/31 ≈ 48%
    });
  });

  describe('edge cases', () => {
    it('handles first day of month', () => {
      const referenceDate = new Date(2024, 1, 1); // Feb 1

      const tracking = [createTrackingEntry('2024-02-01', true)];

      const result = calculateMonthOverMonthTrend(tracking, referenceDate);

      expect(result.thisMonthTotal).toBe(1);
      expect(result.thisMonthCompleted).toBe(1);
      expect(result.thisMonthRate).toBe(100);
    });

    it('handles February correctly (28 or 29 days)', () => {
      // Reference: March 5, 2024 (2024 is a leap year, so Feb has 29 days)
      const referenceDate = new Date(2024, 2, 5); // March 5

      const tracking: HabitTrackingEntry[] = [];

      const result = calculateMonthOverMonthTrend(tracking, referenceDate);

      expect(result.lastMonthTotal).toBe(29); // Leap year
    });

    it('handles year boundary (January looking at December)', () => {
      const referenceDate = new Date(2024, 0, 15); // Jan 15, 2024

      const tracking = [
        // December 2023
        createTrackingEntry('2023-12-01', true),
        createTrackingEntry('2023-12-15', true),
        createTrackingEntry('2023-12-25', true),
      ];

      const result = calculateMonthOverMonthTrend(tracking, referenceDate);

      expect(result.lastMonthCompleted).toBe(3);
      expect(result.lastMonthTotal).toBe(31); // December
    });
  });
});

describe('calculateMonthlyChangeForStatsGrid', () => {
  it('returns rate change for display in stats grid', () => {
    const referenceDate = new Date(2024, 1, 10); // Feb 10

    const tracking = [
      // January: 10/31 = 32%
      ...Array.from({ length: 10 }, (_, i) =>
        createTrackingEntry(`2024-01-${String(i + 1).padStart(2, '0')}`, true)
      ),
      // February: 8/10 = 80%
      ...Array.from({ length: 8 }, (_, i) =>
        createTrackingEntry(`2024-02-${String(i + 1).padStart(2, '0')}`, true)
      ),
    ];

    const result = calculateMonthlyChangeForStatsGrid(tracking, referenceDate);

    expect(result).toBe(48); // 80% - 32% = 48%
  });

  it('returns 0 for empty tracking', () => {
    const result = calculateMonthlyChangeForStatsGrid([]);
    expect(result).toBe(0);
  });

  it('returns negative value when this month is worse', () => {
    const referenceDate = new Date(2024, 1, 10); // Feb 10

    const tracking = [
      // January: 25/31 = 81%
      ...Array.from({ length: 25 }, (_, i) =>
        createTrackingEntry(`2024-01-${String(i + 1).padStart(2, '0')}`, true)
      ),
      // February: 3/10 = 30%
      ...Array.from({ length: 3 }, (_, i) =>
        createTrackingEntry(`2024-02-${String(i + 1).padStart(2, '0')}`, true)
      ),
    ];

    const result = calculateMonthlyChangeForStatsGrid(tracking, referenceDate);

    expect(result).toBe(-51); // 30% - 81% = -51%
  });
});
