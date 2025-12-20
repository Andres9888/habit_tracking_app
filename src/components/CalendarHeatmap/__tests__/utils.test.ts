/**
 * CalendarHeatmap Utilities Unit Tests
 *
 * Tests for grid generation, month stats calculation, and helper utilities.
 */

import {
  generateMonthGrid,
  calculateMonthStats,
  DAY_LABELS,
  DAY_NAMES_FULL,
  formatDateForAccessibility,
  getDayAccessibilityLabel,
  type CalendarDay,
} from '../utils';

describe('generateMonthGrid', () => {
  // Helper to count actual days (non-null) in a grid
  const countActualDays = (grid: CalendarDay[][]): number => {
    return grid.flat().filter((day) => day.date !== null).length;
  };

  // Helper to get all dates from grid
  const getAllDates = (grid: CalendarDay[][]): string[] => {
    return grid
      .flat()
      .filter((day) => day.date !== null)
      .map((day) => day.date as string);
  };

  describe('basic grid structure', () => {
    it('generates correct number of days for a 31-day month', () => {
      // December 2025 has 31 days
      const grid = generateMonthGrid(2025, 11, new Set());
      expect(countActualDays(grid)).toBe(31);
    });

    it('generates correct number of days for a 30-day month', () => {
      // November 2025 has 30 days
      const grid = generateMonthGrid(2025, 10, new Set());
      expect(countActualDays(grid)).toBe(30);
    });

    it('generates correct number of days for February in a non-leap year', () => {
      // February 2025 has 28 days
      const grid = generateMonthGrid(2025, 1, new Set());
      expect(countActualDays(grid)).toBe(28);
    });

    it('generates correct number of days for February in a leap year', () => {
      // February 2024 has 29 days (leap year)
      const grid = generateMonthGrid(2024, 1, new Set());
      expect(countActualDays(grid)).toBe(29);
    });

    it('each week has exactly 7 days', () => {
      const grid = generateMonthGrid(2025, 11, new Set());
      grid.forEach((week, index) => {
        expect(week.length).toBe(7);
      });
    });

    it('pads beginning of month correctly when month starts mid-week', () => {
      // December 2025 starts on Monday (1 padding day for Sunday)
      const grid = generateMonthGrid(2025, 11, new Set());
      const firstWeek = grid[0];

      // Sunday (index 0) should be null (padding)
      expect(firstWeek[0].date).toBeNull();
      // Monday (index 1) should be December 1st
      expect(firstWeek[1].date).toBe('2025-12-01');
      expect(firstWeek[1].dayOfMonth).toBe(1);
    });

    it('pads end of month correctly', () => {
      // December 2025 ends on Wednesday
      const grid = generateMonthGrid(2025, 11, new Set());
      const lastWeek = grid[grid.length - 1];

      // Wednesday should be December 31st
      expect(lastWeek[3].date).toBe('2025-12-31');
      // Thursday through Saturday should be null
      expect(lastWeek[4].date).toBeNull();
      expect(lastWeek[5].date).toBeNull();
      expect(lastWeek[6].date).toBeNull();
    });

    it('handles month starting on Sunday (no padding at start)', () => {
      // June 2025 starts on Sunday
      const grid = generateMonthGrid(2025, 5, new Set());
      const firstWeek = grid[0];

      expect(firstWeek[0].date).toBe('2025-06-01');
      expect(firstWeek[0].dayOfMonth).toBe(1);
    });

    it('handles month ending on Saturday (no padding at end)', () => {
      // August 2025 ends on Sunday, so August 2022 (ends Saturday) is better
      // Actually, let's check May 2025 which ends on Saturday
      const grid = generateMonthGrid(2025, 4, new Set());
      const lastWeek = grid[grid.length - 1];

      expect(lastWeek[6].date).toBe('2025-05-31');
      expect(lastWeek[6].dayOfMonth).toBe(31);
    });
  });

  describe('date format', () => {
    it('generates dates in YYYY-MM-DD format', () => {
      const grid = generateMonthGrid(2025, 0, new Set());
      const dates = getAllDates(grid);

      dates.forEach((date) => {
        expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('pads month correctly (01-12)', () => {
      // January should be 01
      const janGrid = generateMonthGrid(2025, 0, new Set());
      expect(janGrid[0].some((d) => d.date?.startsWith('2025-01'))).toBe(true);

      // December should be 12
      const decGrid = generateMonthGrid(2025, 11, new Set());
      expect(decGrid[0].some((d) => d.date?.startsWith('2025-12'))).toBe(true);
    });

    it('pads day correctly (01-31)', () => {
      const grid = generateMonthGrid(2025, 11, new Set());
      const dates = getAllDates(grid);

      expect(dates).toContain('2025-12-01');
      expect(dates).toContain('2025-12-09');
      expect(dates).toContain('2025-12-10');
      expect(dates).toContain('2025-12-31');
    });
  });

  describe('completed dates', () => {
    it('marks completed dates correctly', () => {
      const completedDates = new Set(['2025-12-05', '2025-12-10', '2025-12-15']);
      const grid = generateMonthGrid(2025, 11, completedDates);

      const days = grid.flat().filter((d) => d.date !== null);
      const completedDays = days.filter((d) => d.completed);

      expect(completedDays.length).toBe(3);
      expect(completedDays.map((d) => d.date)).toEqual([
        '2025-12-05',
        '2025-12-10',
        '2025-12-15',
      ]);
    });

    it('returns completed=false when no dates are in the set', () => {
      const grid = generateMonthGrid(2025, 11, new Set());
      const days = grid.flat().filter((d) => d.date !== null);

      expect(days.every((d) => d.completed === false)).toBe(true);
    });

    it('ignores completed dates from other months', () => {
      const completedDates = new Set(['2025-11-15', '2026-01-05']);
      const grid = generateMonthGrid(2025, 11, completedDates);
      const days = grid.flat().filter((d) => d.date !== null);

      expect(days.every((d) => d.completed === false)).toBe(true);
    });

    it('marks all days completed when all dates are in set', () => {
      const completedDates = new Set<string>();
      for (let i = 1; i <= 31; i++) {
        completedDates.add(`2025-12-${String(i).padStart(2, '0')}`);
      }

      const grid = generateMonthGrid(2025, 11, completedDates);
      const days = grid.flat().filter((d) => d.date !== null);

      expect(days.every((d) => d.completed === true)).toBe(true);
    });
  });

  describe('today detection', () => {
    // Note: These tests depend on the current date, so we use date-aware assertions

    it('marks exactly one day as today for the current month', () => {
      const now = new Date();
      const grid = generateMonthGrid(now.getFullYear(), now.getMonth(), new Set());
      const todayDays = grid.flat().filter((d) => d.isToday);

      expect(todayDays.length).toBe(1);
    });

    it('marks no days as today for past months', () => {
      const now = new Date();
      const pastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const pastYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      const grid = generateMonthGrid(pastYear, pastMonth, new Set());
      const todayDays = grid.flat().filter((d) => d.isToday);

      expect(todayDays.length).toBe(0);
    });

    it('marks no days as today for future months', () => {
      const now = new Date();
      const futureMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
      const futureYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

      const grid = generateMonthGrid(futureYear, futureMonth, new Set());
      const todayDays = grid.flat().filter((d) => d.isToday);

      expect(todayDays.length).toBe(0);
    });
  });

  describe('future dates detection', () => {
    it('marks dates after today as future', () => {
      const now = new Date();
      const grid = generateMonthGrid(now.getFullYear(), now.getMonth(), new Set());

      const futureDays = grid.flat().filter((d) => d.date !== null && d.isFuture);
      const todayDay = now.getDate();
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

      // Future days should be all days after today
      const expectedFutureDays = daysInMonth - todayDay;
      expect(futureDays.length).toBe(expectedFutureDays);
    });

    it('marks all days as future for a future month', () => {
      const now = new Date();
      const futureMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
      const futureYear = now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

      const grid = generateMonthGrid(futureYear, futureMonth, new Set());
      const actualDays = grid.flat().filter((d) => d.date !== null);

      expect(actualDays.every((d) => d.isFuture === true)).toBe(true);
    });

    it('marks no days as future for a past month', () => {
      const grid = generateMonthGrid(2020, 0, new Set()); // January 2020
      const actualDays = grid.flat().filter((d) => d.date !== null);

      expect(actualDays.every((d) => d.isFuture === false)).toBe(true);
    });

    it('today is not marked as future', () => {
      const now = new Date();
      const grid = generateMonthGrid(now.getFullYear(), now.getMonth(), new Set());
      const todayDay = grid.flat().find((d) => d.isToday);

      expect(todayDay?.isFuture).toBe(false);
    });
  });

  describe('habitCreatedAt handling', () => {
    it('marks dates before habit creation as isBeforeCreation', () => {
      // Habit created on December 15, 2025
      const habitCreatedAt = new Date(2025, 11, 15).getTime();
      const grid = generateMonthGrid(2025, 11, new Set(), habitCreatedAt);

      const beforeCreationDays = grid.flat().filter((d) => d.isBeforeCreation);
      // Days 1-14 should be before creation
      expect(beforeCreationDays.length).toBe(14);
      expect(beforeCreationDays.every((d) => {
        const dayNum = d.dayOfMonth;
        return dayNum !== null && dayNum < 15;
      })).toBe(true);
    });

    it('does not mark creation day as isBeforeCreation', () => {
      const habitCreatedAt = new Date(2025, 11, 15).getTime();
      const grid = generateMonthGrid(2025, 11, new Set(), habitCreatedAt);

      const day15 = grid.flat().find((d) => d.dayOfMonth === 15);
      expect(day15?.isBeforeCreation).toBe(false);
    });

    it('does not mark days after creation as isBeforeCreation', () => {
      const habitCreatedAt = new Date(2025, 11, 15).getTime();
      const grid = generateMonthGrid(2025, 11, new Set(), habitCreatedAt);

      const afterCreationDays = grid.flat().filter(
        (d) => d.date !== null && d.dayOfMonth !== null && d.dayOfMonth > 15
      );

      expect(afterCreationDays.every((d) => d.isBeforeCreation === false)).toBe(true);
    });

    it('marks all days as before creation when habit created in a future month', () => {
      // Habit created in February 2026, checking December 2025
      const habitCreatedAt = new Date(2026, 1, 1).getTime();
      const grid = generateMonthGrid(2025, 11, new Set(), habitCreatedAt);

      const actualDays = grid.flat().filter((d) => d.date !== null);
      expect(actualDays.every((d) => d.isBeforeCreation === true)).toBe(true);
    });

    it('marks no days as before creation when habit was created before the month', () => {
      // Habit created in November 2025, checking December 2025
      const habitCreatedAt = new Date(2025, 10, 1).getTime();
      const grid = generateMonthGrid(2025, 11, new Set(), habitCreatedAt);

      const actualDays = grid.flat().filter((d) => d.date !== null);
      expect(actualDays.every((d) => d.isBeforeCreation === false)).toBe(true);
    });

    it('handles undefined habitCreatedAt by not marking any days as before creation', () => {
      const grid = generateMonthGrid(2025, 11, new Set());
      const actualDays = grid.flat().filter((d) => d.date !== null);

      expect(actualDays.every((d) => d.isBeforeCreation === false)).toBe(true);
    });
  });

  describe('dayOfMonth property', () => {
    it('sets correct dayOfMonth for each day', () => {
      const grid = generateMonthGrid(2025, 11, new Set());
      const actualDays = grid.flat().filter((d) => d.date !== null);

      actualDays.forEach((day, index) => {
        expect(day.dayOfMonth).toBe(index + 1);
      });
    });

    it('sets null dayOfMonth for padding cells', () => {
      const grid = generateMonthGrid(2025, 11, new Set());
      const paddingDays = grid.flat().filter((d) => d.date === null);

      paddingDays.forEach((day) => {
        expect(day.dayOfMonth).toBeNull();
      });
    });
  });

  describe('edge cases', () => {
    it('handles month 0 (January) correctly', () => {
      const grid = generateMonthGrid(2025, 0, new Set());
      const dates = getAllDates(grid);

      expect(dates[0]).toBe('2025-01-01');
      expect(dates[dates.length - 1]).toBe('2025-01-31');
    });

    it('handles month 11 (December) correctly', () => {
      const grid = generateMonthGrid(2025, 11, new Set());
      const dates = getAllDates(grid);

      expect(dates[0]).toBe('2025-12-01');
      expect(dates[dates.length - 1]).toBe('2025-12-31');
    });

    it('handles year boundary correctly', () => {
      // December 2024
      const decGrid = generateMonthGrid(2024, 11, new Set());
      expect(getAllDates(decGrid)[0]).toBe('2024-12-01');

      // January 2025
      const janGrid = generateMonthGrid(2025, 0, new Set());
      expect(getAllDates(janGrid)[0]).toBe('2025-01-01');
    });
  });
});

describe('calculateMonthStats', () => {
  const createMockDay = (overrides: Partial<CalendarDay> = {}): CalendarDay => ({
    date: '2025-12-15',
    dayOfMonth: 15,
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
    ...overrides,
  });

  describe('basic calculations', () => {
    it('returns 0 completions for empty grid', () => {
      const grid = [[
        createMockDay({ date: null, dayOfMonth: null }),
        createMockDay({ date: null, dayOfMonth: null }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.completions).toBe(0);
      expect(stats.eligibleDays).toBe(0);
    });

    it('counts completions correctly', () => {
      const grid = [[
        createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
        createMockDay({ date: '2025-12-02', dayOfMonth: 2, completed: false }),
        createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: true }),
        createMockDay({ date: '2025-12-04', dayOfMonth: 4, completed: true }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.completions).toBe(3);
    });

    it('counts eligible days correctly', () => {
      const grid = [[
        createMockDay({ date: '2025-12-01', dayOfMonth: 1 }),
        createMockDay({ date: '2025-12-02', dayOfMonth: 2 }),
        createMockDay({ date: null, dayOfMonth: null }), // Padding
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.eligibleDays).toBe(2);
    });
  });

  describe('excluded days', () => {
    it('excludes null dates from eligible days', () => {
      const grid = [[
        createMockDay({ date: null, dayOfMonth: null }),
        createMockDay({ date: '2025-12-01', dayOfMonth: 1 }),
        createMockDay({ date: null, dayOfMonth: null }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.eligibleDays).toBe(1);
    });

    it('excludes future days from eligible days', () => {
      const grid = [[
        createMockDay({ date: '2025-12-15', dayOfMonth: 15 }),
        createMockDay({ date: '2025-12-16', dayOfMonth: 16, isFuture: true }),
        createMockDay({ date: '2025-12-17', dayOfMonth: 17, isFuture: true }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.eligibleDays).toBe(1);
    });

    it('excludes before-creation days from eligible days', () => {
      const grid = [[
        createMockDay({ date: '2025-12-01', dayOfMonth: 1, isBeforeCreation: true }),
        createMockDay({ date: '2025-12-02', dayOfMonth: 2, isBeforeCreation: true }),
        createMockDay({ date: '2025-12-03', dayOfMonth: 3 }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.eligibleDays).toBe(1);
    });

    it('does not count completions on excluded days', () => {
      const grid = [[
        createMockDay({ date: '2025-12-01', dayOfMonth: 1, isBeforeCreation: true, completed: true }),
        createMockDay({ date: '2025-12-02', dayOfMonth: 2, isFuture: true, completed: true }),
        createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: true }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.completions).toBe(1); // Only the non-excluded completion counts
    });
  });

  describe('success rate calculation', () => {
    it('calculates 100% success rate when all eligible days completed', () => {
      const grid = [[
        createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
        createMockDay({ date: '2025-12-02', dayOfMonth: 2, completed: true }),
        createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: true }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBe(100);
    });

    it('calculates 0% success rate when no days completed', () => {
      const grid = [[
        createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: false }),
        createMockDay({ date: '2025-12-02', dayOfMonth: 2, completed: false }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBe(0);
    });

    it('calculates 50% success rate correctly', () => {
      const grid = [[
        createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
        createMockDay({ date: '2025-12-02', dayOfMonth: 2, completed: false }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBe(50);
    });

    it('calculates fractional percentages correctly', () => {
      const grid = [[
        createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
        createMockDay({ date: '2025-12-02', dayOfMonth: 2, completed: false }),
        createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: false }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBeCloseTo(33.33, 1);
    });

    it('returns 0% success rate when no eligible days', () => {
      const grid = [[
        createMockDay({ date: null, dayOfMonth: null }),
        createMockDay({ date: '2025-12-15', dayOfMonth: 15, isFuture: true }),
      ]];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBe(0);
    });
  });

  describe('multi-week grid', () => {
    it('handles multiple weeks correctly', () => {
      const grid = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({ date: '2025-12-02', dayOfMonth: 2, completed: false }),
        ],
        [
          createMockDay({ date: '2025-12-08', dayOfMonth: 8, completed: true }),
          createMockDay({ date: '2025-12-09', dayOfMonth: 9, completed: true }),
        ],
        [
          createMockDay({ date: '2025-12-15', dayOfMonth: 15, completed: false }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.completions).toBe(3);
      expect(stats.eligibleDays).toBe(5);
      expect(stats.successRate).toBe(60);
    });
  });

  describe('integration with generateMonthGrid', () => {
    it('calculates stats correctly for generated grid', () => {
      const completedDates = new Set([
        '2025-12-01',
        '2025-12-05',
        '2025-12-10',
        '2025-12-15',
        '2025-12-20',
      ]);

      // Use a past month to avoid "today" and "future" affecting the test
      const grid = generateMonthGrid(2020, 11, completedDates);
      const stats = calculateMonthStats(grid, 11, 2020);

      // December 2020 had 31 days, but these are 2025 dates so won't match
      // Let's use 2020 dates
      const completedDates2020 = new Set([
        '2020-12-01',
        '2020-12-05',
        '2020-12-10',
        '2020-12-15',
        '2020-12-20',
      ]);
      const grid2020 = generateMonthGrid(2020, 11, completedDates2020);
      const stats2020 = calculateMonthStats(grid2020, 11, 2020);

      expect(stats2020.completions).toBe(5);
      expect(stats2020.eligibleDays).toBe(31);
      expect(stats2020.successRate).toBeCloseTo(16.13, 1);
    });
  });
});

describe('DAY_LABELS', () => {
  it('has exactly 7 days', () => {
    expect(DAY_LABELS).toHaveLength(7);
  });

  it('starts with Sunday', () => {
    expect(DAY_LABELS[0]).toBe('S');
  });

  it('ends with Saturday', () => {
    expect(DAY_LABELS[6]).toBe('S');
  });

  it('has correct abbreviated day names', () => {
    expect(DAY_LABELS).toEqual(['S', 'M', 'T', 'W', 'T', 'F', 'S']);
  });
});

describe('DAY_NAMES_FULL', () => {
  it('has exactly 7 days', () => {
    expect(DAY_NAMES_FULL).toHaveLength(7);
  });

  it('starts with Sunday', () => {
    expect(DAY_NAMES_FULL[0]).toBe('Sunday');
  });

  it('ends with Saturday', () => {
    expect(DAY_NAMES_FULL[6]).toBe('Saturday');
  });

  it('has all full day names in correct order', () => {
    expect(DAY_NAMES_FULL).toEqual([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]);
  });

  it('matches DAY_LABELS indices', () => {
    // Sunday is S at index 0
    expect(DAY_LABELS[0]).toBe('S');
    expect(DAY_NAMES_FULL[0]).toBe('Sunday');

    // Monday is M at index 1
    expect(DAY_LABELS[1]).toBe('M');
    expect(DAY_NAMES_FULL[1]).toBe('Monday');

    // Wednesday is W at index 3
    expect(DAY_LABELS[3]).toBe('W');
    expect(DAY_NAMES_FULL[3]).toBe('Wednesday');

    // Friday is F at index 5
    expect(DAY_LABELS[5]).toBe('F');
    expect(DAY_NAMES_FULL[5]).toBe('Friday');
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

  it('handles all months', () => {
    const months = [
      { date: '2025-01-15', expected: 'January' },
      { date: '2025-02-15', expected: 'February' },
      { date: '2025-03-15', expected: 'March' },
      { date: '2025-04-15', expected: 'April' },
      { date: '2025-05-15', expected: 'May' },
      { date: '2025-06-15', expected: 'June' },
      { date: '2025-07-15', expected: 'July' },
      { date: '2025-08-15', expected: 'August' },
      { date: '2025-09-15', expected: 'September' },
      { date: '2025-10-15', expected: 'October' },
      { date: '2025-11-15', expected: 'November' },
      { date: '2025-12-15', expected: 'December' },
    ];

    months.forEach(({ date, expected }) => {
      expect(formatDateForAccessibility(date)).toContain(expected);
    });
  });
});

describe('getDayAccessibilityLabel', () => {
  const baseDay: CalendarDay = {
    date: '2025-12-15',
    dayOfMonth: 15,
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
  };

  it('returns "Empty cell" for null date', () => {
    const day: CalendarDay = { ...baseDay, date: null, dayOfMonth: null };
    expect(getDayAccessibilityLabel(day)).toBe('Empty cell');
  });

  it('indicates before habit tracking started', () => {
    const day: CalendarDay = { ...baseDay, isBeforeCreation: true };
    const label = getDayAccessibilityLabel(day);
    expect(label).toContain('Before habit tracking started');
    expect(label).toContain('December 15, 2025');
  });

  it('indicates future date', () => {
    const day: CalendarDay = { ...baseDay, isFuture: true };
    const label = getDayAccessibilityLabel(day);
    expect(label).toContain('Future date');
  });

  it('indicates completed status', () => {
    const day: CalendarDay = { ...baseDay, completed: true };
    const label = getDayAccessibilityLabel(day);
    expect(label).toContain('Completed');
    expect(label).not.toContain('Not completed');
  });

  it('indicates not completed status', () => {
    const day: CalendarDay = { ...baseDay, completed: false };
    const label = getDayAccessibilityLabel(day);
    expect(label).toContain('Not completed');
  });

  it('includes "Today" prefix for today', () => {
    const day: CalendarDay = { ...baseDay, isToday: true };
    const label = getDayAccessibilityLabel(day);
    expect(label).toMatch(/^Today,/);
  });

  it('does not include "Today" prefix for non-today dates', () => {
    const day: CalendarDay = { ...baseDay, isToday: false };
    const label = getDayAccessibilityLabel(day);
    expect(label).not.toMatch(/^Today,/);
  });

  it('combines today with completed status', () => {
    const day: CalendarDay = { ...baseDay, isToday: true, completed: true };
    const label = getDayAccessibilityLabel(day);
    expect(label).toContain('Today');
    expect(label).toContain('Completed');
  });

  it('prioritizes isBeforeCreation over other states', () => {
    const day: CalendarDay = {
      ...baseDay,
      isBeforeCreation: true,
      completed: true, // Should be ignored
    };
    const label = getDayAccessibilityLabel(day);
    expect(label).toContain('Before habit tracking started');
    expect(label).not.toContain('Completed');
  });

  it('prioritizes isFuture over completion state', () => {
    const day: CalendarDay = {
      ...baseDay,
      isFuture: true,
      completed: true, // Should be ignored
    };
    const label = getDayAccessibilityLabel(day);
    expect(label).toContain('Future date');
    expect(label).not.toContain('Completed');
  });
});
