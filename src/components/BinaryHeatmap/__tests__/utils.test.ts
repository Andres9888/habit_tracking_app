/**
 * BinaryHeatmap Utilities Unit Tests
 *
 * Tests for grid generation, statistics calculation, and helper utilities.
 */

import { format, subDays } from 'date-fns';
import {
  generateBinaryGrid,
  calculateBinaryGridStats,
  getTimeRangeDays,
  getCellState,
  formatDateForAccessibility,
  getBinaryCellAccessibilityLabel,
  formatTooltipText,
  getTotalCellCount,
  calculateCellAnimationDelay,
  isValidDateString,
  formatDateString,
} from '../utils';
import type { BinaryDay, TimeRange } from '../types';
import { TIME_RANGE_CONFIG } from '../constants';

describe('getTimeRangeDays', () => {
  it('returns 91 days for 3m', () => {
    expect(getTimeRangeDays('3m')).toBe(91);
  });

  it('returns 182 days for 6m', () => {
    expect(getTimeRangeDays('6m')).toBe(182);
  });

  it('returns 365 days for 1y', () => {
    expect(getTimeRangeDays('1y')).toBe(365);
  });
});

describe('getCellState', () => {
  const baseDay: BinaryDay = {
    date: '2025-12-15',
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
  };

  it('returns "beforeCreation" when isBeforeCreation is true', () => {
    const day = { ...baseDay, isBeforeCreation: true };
    expect(getCellState(day)).toBe('beforeCreation');
  });

  it('returns "future" when isFuture is true', () => {
    const day = { ...baseDay, isFuture: true };
    expect(getCellState(day)).toBe('future');
  });

  it('returns "today" when isToday is true', () => {
    const day = { ...baseDay, isToday: true };
    expect(getCellState(day)).toBe('today');
  });

  it('returns "done" when completed is true', () => {
    const day = { ...baseDay, completed: true };
    expect(getCellState(day)).toBe('done');
  });

  it('returns "missed" when completed is false and no other special states', () => {
    expect(getCellState(baseDay)).toBe('missed');
  });

  it('prioritizes isBeforeCreation over other states', () => {
    const day = {
      ...baseDay,
      isBeforeCreation: true,
      isFuture: true,
      isToday: true,
      completed: true,
    };
    expect(getCellState(day)).toBe('beforeCreation');
  });

  it('prioritizes isFuture over today and completed', () => {
    const day = {
      ...baseDay,
      isFuture: true,
      isToday: true,
      completed: true,
    };
    expect(getCellState(day)).toBe('future');
  });

  it('prioritizes isToday over completed', () => {
    const day = {
      ...baseDay,
      isToday: true,
      completed: true,
    };
    expect(getCellState(day)).toBe('today');
  });
});

describe('generateBinaryGrid', () => {
  // Helper to count actual days (non-null) in a grid
  const countActualDays = (weeks: (BinaryDay | null)[][]): number => {
    return weeks.flat().filter((day) => day !== null).length;
  };

  // Helper to get all dates from grid
  const getAllDates = (weeks: (BinaryDay | null)[][]): string[] => {
    return weeks
      .flat()
      .filter((day): day is BinaryDay => day !== null)
      .map((day) => day.date);
  };

  describe('basic grid structure for 3m time range', () => {
    it('generates approximately 91 days for 3m', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );
      const actualDays = countActualDays(weeks);

      expect(actualDays).toBe(91);
    });

    it('generates correct number of weeks for 3m (~13 weeks)', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      // Should have 13-15 weeks depending on alignment
      expect(weeks.length).toBeGreaterThanOrEqual(13);
      expect(weeks.length).toBeLessThanOrEqual(15);
    });

    it('each week has exactly 7 days', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      weeks.forEach((week) => {
        expect(week.length).toBe(7);
      });
    });
  });

  describe('basic grid structure for 6m time range', () => {
    it('generates 182 days for 6m', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '6m',
        new Set(),
        undefined,
        currentDate
      );
      const actualDays = countActualDays(weeks);

      expect(actualDays).toBe(182);
    });

    it('generates correct number of weeks for 6m (~26 weeks)', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '6m',
        new Set(),
        undefined,
        currentDate
      );

      // Should have 26-28 weeks depending on alignment
      expect(weeks.length).toBeGreaterThanOrEqual(26);
      expect(weeks.length).toBeLessThanOrEqual(28);
    });
  });

  describe('basic grid structure for 1y time range', () => {
    it('generates 365 days for 1y', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '1y',
        new Set(),
        undefined,
        currentDate
      );
      const actualDays = countActualDays(weeks);

      expect(actualDays).toBe(365);
    });

    it('generates correct number of weeks for 1y (~52 weeks)', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '1y',
        new Set(),
        undefined,
        currentDate
      );

      // Should have 52-54 weeks depending on alignment
      expect(weeks.length).toBeGreaterThanOrEqual(52);
      expect(weeks.length).toBeLessThanOrEqual(54);
    });
  });

  describe('day-of-week alignment', () => {
    it('organizes days correctly by day of week (index 0 = Sunday)', () => {
      const currentDate = new Date('2025-12-22'); // Monday
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      // Check that each position in the week corresponds to the correct day
      weeks.forEach((week) => {
        week.forEach((day, index) => {
          if (day !== null) {
            // Parse date in local timezone
            const [year, month, dayNum] = day.date.split('-').map(Number);
            const dayDate = new Date(year, month - 1, dayNum);
            expect(dayDate.getDay()).toBe(index); // index 0 = Sunday
          }
        });
      });
    });

    it('ends on the current date', () => {
      const currentDate = new Date('2025-12-22');
      const currentDateStr = format(currentDate, 'yyyy-MM-dd');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      // Find the last non-null date
      const allDates = getAllDates(weeks);
      const lastDate = allDates[allDates.length - 1];

      expect(lastDate).toBe(currentDateStr);
    });
  });

  describe('date format', () => {
    it('generates dates in YYYY-MM-DD format', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );
      const dates = getAllDates(weeks);

      dates.forEach((date) => {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });
  });

  describe('completed dates', () => {
    it('marks completed dates correctly', () => {
      const currentDate = new Date('2025-12-22');
      const completedDates = new Set([
        '2025-12-05',
        '2025-12-10',
        '2025-12-15',
      ]);
      const { weeks } = generateBinaryGrid(
        '3m',
        completedDates,
        undefined,
        currentDate
      );

      const allDays = weeks.flat().filter((d): d is BinaryDay => d !== null);
      const completedDays = allDays.filter((d) => d.completed);

      expect(completedDays.length).toBe(3);
      expect(completedDays.map((d) => d.date).sort()).toEqual([
        '2025-12-05',
        '2025-12-10',
        '2025-12-15',
      ]);
    });

    it('returns completed=false when no dates are in the set', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const allDays = weeks.flat().filter((d): d is BinaryDay => d !== null);
      expect(allDays.every((d) => d.completed === false)).toBe(true);
    });

    it('ignores completed dates outside the time range', () => {
      const currentDate = new Date('2025-12-22');
      // Dates from over 3 months ago (91+ days)
      const completedDates = new Set(['2025-01-01', '2025-02-15']);
      const { weeks } = generateBinaryGrid(
        '3m',
        completedDates,
        undefined,
        currentDate
      );

      const allDays = weeks.flat().filter((d): d is BinaryDay => d !== null);
      expect(allDays.every((d) => d.completed === false)).toBe(true);
    });
  });

  describe('today detection', () => {
    it('marks exactly one day as today for the current date', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const todayDays = weeks.flat().filter((d) => d?.isToday);
      expect(todayDays.length).toBe(1);
    });

    it('marks the correct date as today', () => {
      const currentDate = new Date('2025-12-22');
      const currentDateStr = format(currentDate, 'yyyy-MM-dd');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const todayDay = weeks.flat().find((d) => d?.isToday);
      expect(todayDay?.date).toBe(currentDateStr);
    });

    it('today is not marked as future', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const todayDay = weeks.flat().find((d) => d?.isToday);
      expect(todayDay?.isFuture).toBe(false);
    });
  });

  describe('future dates detection', () => {
    it('does not include future dates beyond today', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const allDays = weeks.flat().filter((d): d is BinaryDay => d !== null);
      const futureDays = allDays.filter((d) => d.isFuture);

      // No future dates should be in the grid since we end at current date
      expect(futureDays.length).toBe(0);
    });
  });

  describe('habitCreatedAt handling', () => {
    it('marks dates before habit creation as isBeforeCreation', () => {
      const currentDate = new Date('2025-12-22');
      // Habit created 30 days ago
      const habitCreatedAt = subDays(currentDate, 30).getTime();
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        habitCreatedAt,
        currentDate
      );

      const beforeCreationDays = weeks
        .flat()
        .filter((d) => d?.isBeforeCreation);
      // Should have 91 - 31 = 60 days before creation (31 days including creation day)
      expect(beforeCreationDays.length).toBe(60);
    });

    it('does not mark creation day as isBeforeCreation', () => {
      const currentDate = new Date('2025-12-22');
      const habitCreatedDate = new Date('2025-12-01');
      const habitCreatedAt = habitCreatedDate.getTime();
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        habitCreatedAt,
        currentDate
      );

      const creationDay = weeks.flat().find((d) => d?.date === '2025-12-01');
      expect(creationDay?.isBeforeCreation).toBe(false);
    });

    it('does not mark days after creation as isBeforeCreation', () => {
      const currentDate = new Date('2025-12-22');
      const habitCreatedAt = new Date('2025-12-01').getTime();
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        habitCreatedAt,
        currentDate
      );

      const afterCreationDays = weeks
        .flat()
        .filter((d): d is BinaryDay => d !== null)
        .filter((d) => d.date >= '2025-12-01');

      expect(afterCreationDays.every((d) => d.isBeforeCreation === false)).toBe(
        true
      );
    });

    it('marks all days as before creation when habit created after end of range', () => {
      const currentDate = new Date('2025-12-22');
      // Habit created in the future (shouldn't happen, but handle gracefully)
      const habitCreatedAt = new Date('2026-01-01').getTime();
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        habitCreatedAt,
        currentDate
      );

      const allDays = weeks.flat().filter((d): d is BinaryDay => d !== null);
      expect(allDays.every((d) => d.isBeforeCreation === true)).toBe(true);
    });

    it('handles undefined habitCreatedAt by not marking any days as before creation', () => {
      const currentDate = new Date('2025-12-22');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const allDays = weeks.flat().filter((d): d is BinaryDay => d !== null);
      expect(allDays.every((d) => d.isBeforeCreation === false)).toBe(true);
    });
  });

  describe('month labels', () => {
    it('generates month labels for displayed months', () => {
      const currentDate = new Date('2025-12-22');
      const { monthLabels } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      // 3 months should have 3-4 month labels
      expect(monthLabels.length).toBeGreaterThanOrEqual(3);
      expect(monthLabels.length).toBeLessThanOrEqual(4);
    });

    it('month labels have correct format (short name)', () => {
      const currentDate = new Date('2025-12-22');
      const { monthLabels } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      monthLabels.forEach((label) => {
        expect(label.label).toMatch(/^[A-Z][a-z]{2}$/); // e.g., "Oct", "Nov"
      });
    });

    it('month labels have incrementing week indices', () => {
      const currentDate = new Date('2025-12-22');
      const { monthLabels } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      for (let i = 1; i < monthLabels.length; i++) {
        expect(monthLabels[i].weekIndex).toBeGreaterThan(
          monthLabels[i - 1].weekIndex
        );
      }
    });

    it('generates more month labels for 6m vs 3m', () => {
      const currentDate = new Date('2025-12-22');
      const { monthLabels: labels3m } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );
      const { monthLabels: labels6m } = generateBinaryGrid(
        '6m',
        new Set(),
        undefined,
        currentDate
      );

      expect(labels6m.length).toBeGreaterThan(labels3m.length);
    });

    it('generates approximately 12 month labels for 1y', () => {
      const currentDate = new Date('2025-12-22');
      const { monthLabels } = generateBinaryGrid(
        '1y',
        new Set(),
        undefined,
        currentDate
      );

      expect(monthLabels.length).toBeGreaterThanOrEqual(12);
      expect(monthLabels.length).toBeLessThanOrEqual(13);
    });
  });

  describe('statistics', () => {
    it('calculates correct completion count', () => {
      const currentDate = new Date('2025-12-22');
      const completedDates = new Set([
        '2025-12-01',
        '2025-12-10',
        '2025-12-15',
        '2025-12-20',
      ]);
      const { stats } = generateBinaryGrid(
        '3m',
        completedDates,
        undefined,
        currentDate
      );

      expect(stats.completions).toBe(4);
    });

    it('calculates correct eligible days', () => {
      const currentDate = new Date('2025-12-22');
      const { stats } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      expect(stats.eligibleDays).toBe(91);
    });

    it('excludes before-creation days from eligible days', () => {
      const currentDate = new Date('2025-12-22');
      // Habit created 30 days ago
      const habitCreatedAt = subDays(currentDate, 30).getTime();
      const { stats } = generateBinaryGrid(
        '3m',
        new Set(),
        habitCreatedAt,
        currentDate
      );

      expect(stats.eligibleDays).toBe(31); // 31 days including creation day
    });

    it('calculates completion rate correctly', () => {
      const currentDate = new Date('2025-12-22');
      // Complete every day for the last month
      const completedDates = new Set<string>();
      for (let i = 0; i < 30; i++) {
        const date = subDays(currentDate, i);
        completedDates.add(format(date, 'yyyy-MM-dd'));
      }

      const { stats } = generateBinaryGrid(
        '3m',
        completedDates,
        undefined,
        currentDate
      );

      // 30 completions out of 91 eligible days = ~33%
      expect(stats.completionRate).toBe(33);
    });

    it('returns 0% completion rate when no completions', () => {
      const currentDate = new Date('2025-12-22');
      const { stats } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      expect(stats.completionRate).toBe(0);
    });

    it('returns 100% completion rate when all days completed', () => {
      const currentDate = new Date('2025-12-22');
      const completedDates = new Set<string>();

      // Complete all 91 days
      for (let i = 0; i < 91; i++) {
        const date = subDays(currentDate, i);
        completedDates.add(format(date, 'yyyy-MM-dd'));
      }

      const { stats } = generateBinaryGrid(
        '3m',
        completedDates,
        undefined,
        currentDate
      );

      expect(stats.completionRate).toBe(100);
    });
  });

  describe('edge cases', () => {
    it('handles current date at beginning of month', () => {
      const currentDate = new Date('2025-12-01');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const actualDays = countActualDays(weeks);
      expect(actualDays).toBe(91);
    });

    it('handles current date at end of month', () => {
      const currentDate = new Date('2025-12-31');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const actualDays = countActualDays(weeks);
      expect(actualDays).toBe(91);
    });

    it('handles year boundary correctly', () => {
      const currentDate = new Date('2025-01-15');
      const { weeks, monthLabels } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const actualDays = countActualDays(weeks);
      expect(actualDays).toBe(91);

      // Should include months from previous year
      const labels = monthLabels.map((l) => l.label);
      expect(labels).toContain('Oct');
      expect(labels).toContain('Nov');
      expect(labels).toContain('Dec');
      expect(labels).toContain('Jan');
    });

    it('handles leap year correctly', () => {
      // 2024 is a leap year, Feb has 29 days
      const currentDate = new Date('2024-03-15');
      const { weeks } = generateBinaryGrid(
        '3m',
        new Set(),
        undefined,
        currentDate
      );

      const dates = getAllDates(weeks);
      expect(dates).toContain('2024-02-29');
    });
  });
});

describe('calculateBinaryGridStats', () => {
  const createMockDay = (overrides: Partial<BinaryDay> = {}): BinaryDay => ({
    date: '2025-12-15',
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
    ...overrides,
  });

  describe('basic calculations', () => {
    it('returns 0 completions for empty grid', () => {
      const weeks: (BinaryDay | null)[][] = [[null, null]];
      const stats = calculateBinaryGridStats(weeks);

      expect(stats.completions).toBe(0);
      expect(stats.eligibleDays).toBe(0);
    });

    it('counts completions correctly', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({ date: '2025-12-01', completed: true }),
          createMockDay({ date: '2025-12-02', completed: false }),
          createMockDay({ date: '2025-12-03', completed: true }),
          createMockDay({ date: '2025-12-04', completed: true }),
        ],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.completions).toBe(3);
    });

    it('counts eligible days correctly', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({ date: '2025-12-01' }),
          createMockDay({ date: '2025-12-02' }),
          null, // Padding
        ],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.eligibleDays).toBe(2);
    });
  });

  describe('excluded days', () => {
    it('excludes null cells from eligible days', () => {
      const weeks: (BinaryDay | null)[][] = [
        [null, createMockDay({ date: '2025-12-01' }), null],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.eligibleDays).toBe(1);
    });

    it('excludes future days from eligible days', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({ date: '2025-12-15' }),
          createMockDay({ date: '2025-12-16', isFuture: true }),
          createMockDay({ date: '2025-12-17', isFuture: true }),
        ],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.eligibleDays).toBe(1);
    });

    it('excludes before-creation days from eligible days', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({ date: '2025-12-01', isBeforeCreation: true }),
          createMockDay({ date: '2025-12-02', isBeforeCreation: true }),
          createMockDay({ date: '2025-12-03' }),
        ],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.eligibleDays).toBe(1);
    });

    it('does not count completions on excluded days', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({
            date: '2025-12-01',
            isBeforeCreation: true,
            completed: true,
          }),
          createMockDay({
            date: '2025-12-02',
            isFuture: true,
            completed: true,
          }),
          createMockDay({ date: '2025-12-03', completed: true }),
        ],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.completions).toBe(1);
    });
  });

  describe('completion rate calculation', () => {
    it('calculates 100% rate when all eligible days completed', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({ date: '2025-12-01', completed: true }),
          createMockDay({ date: '2025-12-02', completed: true }),
          createMockDay({ date: '2025-12-03', completed: true }),
        ],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.completionRate).toBe(100);
    });

    it('calculates 0% rate when no days completed', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({ date: '2025-12-01', completed: false }),
          createMockDay({ date: '2025-12-02', completed: false }),
        ],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.completionRate).toBe(0);
    });

    it('calculates 50% rate correctly', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({ date: '2025-12-01', completed: true }),
          createMockDay({ date: '2025-12-02', completed: false }),
        ],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.completionRate).toBe(50);
    });

    it('rounds completion rate correctly', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({ date: '2025-12-01', completed: true }),
          createMockDay({ date: '2025-12-02', completed: false }),
          createMockDay({ date: '2025-12-03', completed: false }),
        ],
      ];

      const stats = calculateBinaryGridStats(weeks);
      // 1/3 = 33.33... rounds to 33
      expect(stats.completionRate).toBe(33);
    });

    it('returns 0% rate when no eligible days', () => {
      const weeks: (BinaryDay | null)[][] = [
        [null, createMockDay({ date: '2025-12-15', isFuture: true })],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.completionRate).toBe(0);
    });
  });

  describe('multi-week grid', () => {
    it('handles multiple weeks correctly', () => {
      const weeks: (BinaryDay | null)[][] = [
        [
          createMockDay({ date: '2025-12-01', completed: true }),
          createMockDay({ date: '2025-12-02', completed: false }),
        ],
        [
          createMockDay({ date: '2025-12-08', completed: true }),
          createMockDay({ date: '2025-12-09', completed: true }),
        ],
        [createMockDay({ date: '2025-12-15', completed: false })],
      ];

      const stats = calculateBinaryGridStats(weeks);
      expect(stats.completions).toBe(3);
      expect(stats.eligibleDays).toBe(5);
      expect(stats.completionRate).toBe(60);
    });
  });
});

describe('formatDateForAccessibility', () => {
  it('formats date in full human-readable format', () => {
    expect(formatDateForAccessibility('2025-12-20')).toBe(
      'Saturday, December 20, 2025'
    );
  });

  it('handles first day of month', () => {
    expect(formatDateForAccessibility('2025-01-01')).toBe(
      'Wednesday, January 1, 2025'
    );
  });

  it('handles last day of month', () => {
    expect(formatDateForAccessibility('2025-12-31')).toBe(
      'Wednesday, December 31, 2025'
    );
  });

  it('handles leap year date', () => {
    expect(formatDateForAccessibility('2024-02-29')).toBe(
      'Thursday, February 29, 2024'
    );
  });
});

describe('getBinaryCellAccessibilityLabel', () => {
  const baseDay: BinaryDay = {
    date: '2025-12-15',
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
  };

  it('returns "Empty cell" for null', () => {
    expect(getBinaryCellAccessibilityLabel(null)).toBe('Empty cell');
  });

  it('indicates before habit tracking started', () => {
    const day = { ...baseDay, isBeforeCreation: true };
    const label = getBinaryCellAccessibilityLabel(day);
    expect(label).toContain('Before habit tracking started');
  });

  it('indicates future date', () => {
    const day = { ...baseDay, isFuture: true };
    const label = getBinaryCellAccessibilityLabel(day);
    expect(label).toContain('Future date');
  });

  it('indicates completed status', () => {
    const day = { ...baseDay, completed: true };
    const label = getBinaryCellAccessibilityLabel(day);
    expect(label).toContain('Completed');
  });

  it('indicates not completed status', () => {
    const label = getBinaryCellAccessibilityLabel(baseDay);
    expect(label).toContain('Not completed');
  });

  it('includes "Today" prefix for today', () => {
    const day = { ...baseDay, isToday: true };
    const label = getBinaryCellAccessibilityLabel(day);
    expect(label).toMatch(/^Today,/);
  });

  it('includes day name in label', () => {
    const label = getBinaryCellAccessibilityLabel(baseDay);
    expect(label).toContain('Monday'); // Dec 15, 2025 is a Monday
  });
});

describe('formatTooltipText', () => {
  const baseDay: BinaryDay = {
    date: '2025-12-15',
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
  };

  it('formats completed day correctly', () => {
    const day = { ...baseDay, completed: true };
    expect(formatTooltipText(day)).toBe('Dec 15: Done ✓');
  });

  it('formats missed day correctly', () => {
    expect(formatTooltipText(baseDay)).toBe('Dec 15: Missed');
  });

  it('formats today correctly', () => {
    const day = { ...baseDay, isToday: true };
    expect(formatTooltipText(day)).toBe('Dec 15: Today');
  });

  it('formats future day correctly', () => {
    const day = { ...baseDay, isFuture: true };
    expect(formatTooltipText(day)).toBe('Dec 15: Future');
  });

  it('formats before creation day correctly', () => {
    const day = { ...baseDay, isBeforeCreation: true };
    expect(formatTooltipText(day)).toBe('Dec 15: Before tracking');
  });
});

describe('getTotalCellCount', () => {
  it('counts all cells including nulls', () => {
    const weeks: (BinaryDay | null)[][] = [
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
    ];

    expect(getTotalCellCount(weeks)).toBe(14);
  });

  it('handles empty grid', () => {
    expect(getTotalCellCount([])).toBe(0);
  });
});

describe('calculateCellAnimationDelay', () => {
  it('returns 0 for first cell', () => {
    expect(calculateCellAnimationDelay(0, 0, 5)).toBe(0);
  });

  it('calculates linear delay based on position', () => {
    // Week 0, Day 1 = index 1
    expect(calculateCellAnimationDelay(0, 1, 5)).toBe(5);

    // Week 0, Day 6 = index 6
    expect(calculateCellAnimationDelay(0, 6, 5)).toBe(30);

    // Week 1, Day 0 = index 7
    expect(calculateCellAnimationDelay(1, 0, 5)).toBe(35);

    // Week 2, Day 3 = index 17
    expect(calculateCellAnimationDelay(2, 3, 5)).toBe(85);
  });

  it('uses default stagger delay of 5ms', () => {
    expect(calculateCellAnimationDelay(1, 0)).toBe(35);
  });

  it('respects custom stagger delay', () => {
    expect(calculateCellAnimationDelay(1, 0, 10)).toBe(70);
  });
});

describe('isValidDateString', () => {
  it('returns true for valid date strings', () => {
    expect(isValidDateString('2025-12-15')).toBe(true);
    expect(isValidDateString('2024-02-29')).toBe(true);
    expect(isValidDateString('2000-01-01')).toBe(true);
  });

  it('returns false for invalid format', () => {
    expect(isValidDateString('2025/12/15')).toBe(false);
    expect(isValidDateString('12-15-2025')).toBe(false);
    expect(isValidDateString('2025-1-15')).toBe(false);
    expect(isValidDateString('2025-12-5')).toBe(false);
    expect(isValidDateString('invalid')).toBe(false);
  });

  it('returns false for invalid dates', () => {
    expect(isValidDateString('2025-13-01')).toBe(false);
    expect(isValidDateString('2025-00-01')).toBe(false);
    expect(isValidDateString('2025-02-30')).toBe(false);
    expect(isValidDateString('2023-02-29')).toBe(false); // Not a leap year
  });
});

describe('formatDateString', () => {
  it('formats Date to YYYY-MM-DD', () => {
    const date = new Date(2025, 11, 15); // Month is 0-indexed
    expect(formatDateString(date)).toBe('2025-12-15');
  });

  it('pads single-digit months correctly', () => {
    const date = new Date(2025, 0, 15); // January
    expect(formatDateString(date)).toBe('2025-01-15');
  });

  it('pads single-digit days correctly', () => {
    const date = new Date(2025, 11, 5);
    expect(formatDateString(date)).toBe('2025-12-05');
  });
});
