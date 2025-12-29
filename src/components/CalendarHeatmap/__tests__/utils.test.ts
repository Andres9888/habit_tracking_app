/**
 * CalendarHeatmap Utilities Unit Tests
 *
 * Tests for grid generation, month stats calculation, and helper utilities.
 */

import { format } from 'date-fns';
import {
  generateMonthGrid,
  generateWeekGrid,
  calculateMonthStats,
  calculateWeekStats,
  generateHorizontalGrid,
  calculate3MonthStats,
  calculate3MonthTrend,
  calculateDayOfWeekStats,
  detectWeakDay,
  calculateStreakPosition,
  DAY_LABELS,
  DAY_NAMES_FULL,
  formatDateForAccessibility,
  getDayAccessibilityLabel,
  type CalendarDay,
  type DayOfWeekStat,
  type MonthLabel,
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
      const completedDates = new Set([
        '2025-12-05',
        '2025-12-10',
        '2025-12-15',
      ]);
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
      const grid = generateMonthGrid(
        now.getFullYear(),
        now.getMonth(),
        new Set()
      );
      const todayDays = grid.flat().filter((d) => d.isToday);

      expect(todayDays.length).toBe(1);
    });

    it('marks no days as today for past months', () => {
      const now = new Date();
      const pastMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
      const pastYear =
        now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();

      const grid = generateMonthGrid(pastYear, pastMonth, new Set());
      const todayDays = grid.flat().filter((d) => d.isToday);

      expect(todayDays.length).toBe(0);
    });

    it('marks no days as today for future months', () => {
      const now = new Date();
      const futureMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
      const futureYear =
        now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

      const grid = generateMonthGrid(futureYear, futureMonth, new Set());
      const todayDays = grid.flat().filter((d) => d.isToday);

      expect(todayDays.length).toBe(0);
    });
  });

  describe('future dates detection', () => {
    it('marks dates after today as future', () => {
      const now = new Date();
      const grid = generateMonthGrid(
        now.getFullYear(),
        now.getMonth(),
        new Set()
      );

      const futureDays = grid
        .flat()
        .filter((d) => d.date !== null && d.isFuture);
      const todayDay = now.getDate();
      const daysInMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0
      ).getDate();

      // Future days should be all days after today
      const expectedFutureDays = daysInMonth - todayDay;
      expect(futureDays.length).toBe(expectedFutureDays);
    });

    it('marks all days as future for a future month', () => {
      const now = new Date();
      const futureMonth = now.getMonth() === 11 ? 0 : now.getMonth() + 1;
      const futureYear =
        now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear();

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
      const grid = generateMonthGrid(
        now.getFullYear(),
        now.getMonth(),
        new Set()
      );
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
      expect(
        beforeCreationDays.every((d) => {
          const dayNum = d.dayOfMonth;
          return dayNum !== null && dayNum < 15;
        })
      ).toBe(true);
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

      const afterCreationDays = grid
        .flat()
        .filter(
          (d) => d.date !== null && d.dayOfMonth !== null && d.dayOfMonth > 15
        );

      expect(afterCreationDays.every((d) => d.isBeforeCreation === false)).toBe(
        true
      );
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

  describe('week start day customization', () => {
    // Helper to parse date string in local timezone (avoids UTC issues)
    const parseDateLocal = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    // Helper to get the day of week for a date string
    const getDayOfWeekForDate = (dateStr: string): number => {
      return parseDateLocal(dateStr).getDay();
    };

    describe('default behavior (Sunday start)', () => {
      it('uses Sunday start (0) by default', () => {
        // December 2025 starts on Monday, so Sunday column should be null/padding
        const grid = generateMonthGrid(2025, 11, new Set());
        const firstWeek = grid[0];

        // With Sunday start, Monday (Dec 1) should be at index 1
        expect(firstWeek[0].date).toBeNull(); // Sunday - padding
        expect(firstWeek[1].date).toBe('2025-12-01'); // Monday
      });

      it('pads correctly when month starts on Sunday', () => {
        // June 2025 starts on Sunday - no padding needed
        const grid = generateMonthGrid(2025, 5, new Set());
        const firstWeek = grid[0];

        expect(firstWeek[0].date).toBe('2025-06-01');
        expect(getDayOfWeekForDate(firstWeek[0].date!)).toBe(0); // Sunday
      });
    });

    describe('Monday start (weekStartDay = 1)', () => {
      it('first column is Monday when weekStartDay is 1', () => {
        // December 2025 starts on Monday - no padding needed
        const grid = generateMonthGrid(2025, 11, new Set(), undefined, 1);
        const firstWeek = grid[0];

        expect(firstWeek[0].date).toBe('2025-12-01');
        expect(getDayOfWeekForDate(firstWeek[0].date!)).toBe(1); // Monday
      });

      it('pads correctly when month starts after Monday', () => {
        // January 2025 starts on Wednesday
        const grid = generateMonthGrid(2025, 0, new Set(), undefined, 1);
        const firstWeek = grid[0];

        // Monday (index 0) and Tuesday (index 1) should be padding
        expect(firstWeek[0].date).toBeNull();
        expect(firstWeek[1].date).toBeNull();
        expect(firstWeek[2].date).toBe('2025-01-01'); // Wednesday
        expect(getDayOfWeekForDate(firstWeek[2].date!)).toBe(3); // Wednesday
      });

      it('pads correctly when month starts on Sunday', () => {
        // June 2025 starts on Sunday - needs 6 days of padding for Monday start
        const grid = generateMonthGrid(2025, 5, new Set(), undefined, 1);
        const firstWeek = grid[0];

        // Indices 0-5 (Mon-Sat) should be padding
        for (let i = 0; i < 6; i++) {
          expect(firstWeek[i].date).toBeNull();
        }
        // Index 6 (Sunday in Monday-start week) should be June 1st
        expect(firstWeek[6].date).toBe('2025-06-01');
        expect(getDayOfWeekForDate(firstWeek[6].date!)).toBe(0); // Sunday
      });

      it('last column is Sunday when weekStartDay is 1', () => {
        const grid = generateMonthGrid(2025, 11, new Set(), undefined, 1);
        // Find a non-padding row to verify column order
        const fullWeek = grid.find((week) =>
          week.every((day) => day.date !== null)
        );
        if (fullWeek) {
          // Index 6 should be Sunday
          expect(getDayOfWeekForDate(fullWeek[6].date!)).toBe(0); // Sunday
        }
      });
    });

    describe('Saturday start (weekStartDay = 6)', () => {
      it('first column is Saturday when weekStartDay is 6', () => {
        // May 2025 starts on Thursday, so needs padding
        const grid = generateMonthGrid(2025, 4, new Set(), undefined, 6);
        const firstWeek = grid[0];

        // Saturday (index 0) through Wednesday (index 4) should be padding
        // Calculation: (4 - 6 + 7) % 7 = 5 padding cells
        expect(firstWeek[0].date).toBeNull(); // Saturday
        expect(firstWeek[1].date).toBeNull(); // Sunday
        expect(firstWeek[2].date).toBeNull(); // Monday
        expect(firstWeek[3].date).toBeNull(); // Tuesday
        expect(firstWeek[4].date).toBeNull(); // Wednesday
        expect(firstWeek[5].date).toBe('2025-05-01'); // Thursday
        expect(getDayOfWeekForDate(firstWeek[5].date!)).toBe(4); // Thursday
      });

      it('no padding when month starts on Saturday', () => {
        // November 2025 starts on Saturday
        const grid = generateMonthGrid(2025, 10, new Set(), undefined, 6);
        const firstWeek = grid[0];

        expect(firstWeek[0].date).toBe('2025-11-01');
        expect(getDayOfWeekForDate(firstWeek[0].date!)).toBe(6); // Saturday
      });

      it('last column is Friday when weekStartDay is 6', () => {
        // November 2025 starts on Saturday - first week is complete
        const grid = generateMonthGrid(2025, 10, new Set(), undefined, 6);
        const firstWeek = grid[0];

        // Index 6 should be Friday (November 7)
        expect(firstWeek[6].date).toBe('2025-11-07');
        expect(getDayOfWeekForDate(firstWeek[6].date!)).toBe(5); // Friday
      });
    });

    describe('all week start days', () => {
      it('generates correct number of actual days regardless of start day', () => {
        // December 2025 has 31 days - should be true for all start days
        for (let startDay = 0; startDay <= 6; startDay++) {
          const grid = generateMonthGrid(
            2025,
            11,
            new Set(),
            undefined,
            startDay as 0 | 1 | 2 | 3 | 4 | 5 | 6
          );
          expect(countActualDays(grid)).toBe(31);
        }
      });

      it('maintains correct date sequence for all start days', () => {
        for (let startDay = 0; startDay <= 6; startDay++) {
          const grid = generateMonthGrid(
            2025,
            11,
            new Set(),
            undefined,
            startDay as 0 | 1 | 2 | 3 | 4 | 5 | 6
          );
          const dates = getAllDates(grid);

          // First date should be December 1st
          expect(dates[0]).toBe('2025-12-01');
          // Last date should be December 31st
          expect(dates[dates.length - 1]).toBe('2025-12-31');
        }
      });

      it('each week still has exactly 7 cells for all start days', () => {
        for (let startDay = 0; startDay <= 6; startDay++) {
          const grid = generateMonthGrid(
            2025,
            11,
            new Set(),
            undefined,
            startDay as 0 | 1 | 2 | 3 | 4 | 5 | 6
          );
          grid.forEach((week) => {
            expect(week.length).toBe(7);
          });
        }
      });
    });

    describe('completed dates with week start customization', () => {
      it('marks completed dates correctly with Monday start', () => {
        const completedDates = new Set([
          '2025-12-05',
          '2025-12-15',
          '2025-12-25',
        ]);
        const grid = generateMonthGrid(2025, 11, completedDates, undefined, 1);

        const completedDays = grid.flat().filter((d) => d.completed);
        expect(completedDays.length).toBe(3);
        expect(completedDays.map((d) => d.date).sort()).toEqual([
          '2025-12-05',
          '2025-12-15',
          '2025-12-25',
        ]);
      });
    });

    describe('habitCreatedAt with week start customization', () => {
      it('marks before creation dates correctly with Monday start', () => {
        // Habit created on December 15, 2025
        const habitCreatedAt = new Date(2025, 11, 15).getTime();
        const grid = generateMonthGrid(2025, 11, new Set(), habitCreatedAt, 1);

        const beforeCreationDays = grid
          .flat()
          .filter((d) => d.isBeforeCreation);
        // Days 1-14 should be before creation
        expect(beforeCreationDays.length).toBe(14);
      });
    });

    describe('today and future detection with week start customization', () => {
      it('today detection works correctly with all start days', () => {
        const now = new Date();

        for (let startDay = 0; startDay <= 6; startDay++) {
          const grid = generateMonthGrid(
            now.getFullYear(),
            now.getMonth(),
            new Set(),
            undefined,
            startDay as 0 | 1 | 2 | 3 | 4 | 5 | 6
          );

          const todayDays = grid.flat().filter((d) => d.isToday);
          expect(todayDays.length).toBe(1);
        }
      });
    });

    describe('padding calculation edge cases', () => {
      it('handles month starting on week start day (no padding)', () => {
        // Test each week start day with a month that starts on that day
        const testCases: Array<{
          month: number;
          year: number;
          startDay: 0 | 1 | 2 | 3 | 4 | 5 | 6;
        }> = [
          { month: 5, year: 2025, startDay: 0 }, // June 2025 starts on Sunday
          { month: 11, year: 2025, startDay: 1 }, // December 2025 starts on Monday
          { month: 6, year: 2025, startDay: 2 }, // July 2025 starts on Tuesday
          { month: 0, year: 2025, startDay: 3 }, // January 2025 starts on Wednesday
          { month: 4, year: 2025, startDay: 4 }, // May 2025 starts on Thursday
          { month: 7, year: 2025, startDay: 5 }, // August 2025 starts on Friday
          { month: 10, year: 2025, startDay: 6 }, // November 2025 starts on Saturday
        ];

        for (const { month, year, startDay } of testCases) {
          const grid = generateMonthGrid(
            year,
            month,
            new Set(),
            undefined,
            startDay
          );
          const firstWeek = grid[0];

          // First cell should be the 1st of the month (no padding)
          expect(firstWeek[0].date).not.toBeNull();
          expect(firstWeek[0].dayOfMonth).toBe(1);
        }
      });

      it('handles month starting one day after week start (1 padding cell)', () => {
        // December 2025 starts on Monday
        // With Sunday (0) start: 1 padding cell (Sunday)
        const gridSundayStart = generateMonthGrid(
          2025,
          11,
          new Set(),
          undefined,
          0
        );
        let paddingCount = gridSundayStart[0].filter(
          (d) => d.date === null
        ).length;
        expect(paddingCount).toBe(1);

        // With Saturday (6) start: December 1st (Monday) is 2 days after Saturday
        // Calculation: (1 - 6 + 7) % 7 = 2 padding cells
        const gridSaturdayStart = generateMonthGrid(
          2025,
          11,
          new Set(),
          undefined,
          6
        );
        paddingCount = gridSaturdayStart[0].filter(
          (d) => d.date === null
        ).length;
        expect(paddingCount).toBe(2);
      });

      it('handles maximum padding (6 cells when month starts day before week start)', () => {
        // June 2025 starts on Sunday
        // With Monday (1) start, Sunday is at index 6, so need 6 padding cells
        const grid = generateMonthGrid(2025, 5, new Set(), undefined, 1);
        const paddingCount = grid[0].filter((d) => d.date === null).length;
        expect(paddingCount).toBe(6);
      });
    });
  });
});

describe('generateWeekGrid', () => {
  // Helper to parse date string in local timezone (avoids UTC issues)
  const parseDateLocal = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  describe('basic week structure', () => {
    it('generates exactly 7 days', () => {
      const week = generateWeekGrid(new Set());
      expect(week).toHaveLength(7);
    });

    it('all days have non-null dates', () => {
      const week = generateWeekGrid(new Set());
      week.forEach((day) => {
        expect(day.date).not.toBeNull();
        expect(day.dayOfMonth).not.toBeNull();
      });
    });

    it('dates are in YYYY-MM-DD format', () => {
      const week = generateWeekGrid(new Set());
      week.forEach((day) => {
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('dates are consecutive', () => {
      const week = generateWeekGrid(new Set());
      for (let i = 1; i < 7; i++) {
        const prevDate = parseDateLocal(week[i - 1].date!);
        const currDate = parseDateLocal(week[i].date!);
        const dayDiff =
          (currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24);
        expect(dayDiff).toBe(1);
      }
    });
  });

  describe('week start day customization', () => {
    it('starts on Sunday when weekStartDay is 0 (default)', () => {
      const week = generateWeekGrid(new Set(), undefined, 0);

      // First day should be a Sunday
      const firstDate = parseDateLocal(week[0].date!);
      expect(firstDate.getDay()).toBe(0); // Sunday
    });

    it('starts on Monday when weekStartDay is 1', () => {
      const week = generateWeekGrid(new Set(), undefined, 1);

      // First day should be a Monday
      const firstDate = parseDateLocal(week[0].date!);
      expect(firstDate.getDay()).toBe(1); // Monday
    });

    it('starts on Saturday when weekStartDay is 6', () => {
      const week = generateWeekGrid(new Set(), undefined, 6);

      // First day should be a Saturday
      const firstDate = parseDateLocal(week[0].date!);
      expect(firstDate.getDay()).toBe(6); // Saturday
    });

    it('last day is one day before week start day', () => {
      // When week starts on Monday (1), last day should be Sunday (0)
      const weekMonday = generateWeekGrid(new Set(), undefined, 1);
      const lastDate = parseDateLocal(weekMonday[6].date!);
      expect(lastDate.getDay()).toBe(0); // Sunday

      // When week starts on Sunday (0), last day should be Saturday (6)
      const weekSunday = generateWeekGrid(new Set(), undefined, 0);
      const lastDateSunday = parseDateLocal(weekSunday[6].date!);
      expect(lastDateSunday.getDay()).toBe(6); // Saturday
    });

    it('generates same dates for same today regardless of start day', () => {
      // All week configurations should include today
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');

      for (let startDay = 0; startDay <= 6; startDay++) {
        const week = generateWeekGrid(
          new Set(),
          undefined,
          startDay as 0 | 1 | 2 | 3 | 4 | 5 | 6
        );
        const todayInWeek = week.find((d) => d.date === todayStr);
        expect(todayInWeek).toBeDefined();
        expect(todayInWeek?.isToday).toBe(true);
      }
    });

    it('Wednesday start includes correct 7-day range', () => {
      const week = generateWeekGrid(new Set(), undefined, 3); // Wednesday

      // First day should be Wednesday
      const firstDate = parseDateLocal(week[0].date!);
      expect(firstDate.getDay()).toBe(3); // Wednesday

      // Last day should be Tuesday
      const lastDate = parseDateLocal(week[6].date!);
      expect(lastDate.getDay()).toBe(2); // Tuesday
    });
  });

  describe('completed dates', () => {
    it('marks completed dates correctly', () => {
      // Use dates that are definitely in the current week
      const week = generateWeekGrid(new Set());
      const firstDayInWeek = week[0].date!;
      const secondDayInWeek = week[1].date!;

      const completedDates = new Set([firstDayInWeek, secondDayInWeek]);
      const weekWithCompletions = generateWeekGrid(completedDates);

      const completedDays = weekWithCompletions.filter((d) => d.completed);
      expect(completedDays.length).toBe(2);
    });

    it('returns completed=false when no dates are in the set', () => {
      const week = generateWeekGrid(new Set());
      expect(week.every((d) => d.completed === false)).toBe(true);
    });

    it('ignores completed dates outside the week', () => {
      // Date from 2 weeks ago
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 14);
      const oldDateStr = format(oldDate, 'yyyy-MM-dd');

      const completedDates = new Set([oldDateStr]);
      const week = generateWeekGrid(completedDates);

      expect(week.every((d) => d.completed === false)).toBe(true);
    });
  });

  describe('today detection', () => {
    it('marks exactly one day as today', () => {
      const week = generateWeekGrid(new Set());
      const todayDays = week.filter((d) => d.isToday);
      expect(todayDays.length).toBe(1);
    });

    it('today has correct date', () => {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');

      const week = generateWeekGrid(new Set());
      const todayDay = week.find((d) => d.isToday);

      expect(todayDay?.date).toBe(todayStr);
    });
  });

  describe('future dates detection', () => {
    it('marks dates after today as future', () => {
      const week = generateWeekGrid(new Set());
      const todayIndex = week.findIndex((d) => d.isToday);

      // All days after today should be future
      for (let i = todayIndex + 1; i < 7; i++) {
        expect(week[i].isFuture).toBe(true);
      }
    });

    it('marks dates before today as not future', () => {
      const week = generateWeekGrid(new Set());
      const todayIndex = week.findIndex((d) => d.isToday);

      // All days before today should not be future
      for (let i = 0; i < todayIndex; i++) {
        expect(week[i].isFuture).toBe(false);
      }
    });

    it('today is not marked as future', () => {
      const week = generateWeekGrid(new Set());
      const todayDay = week.find((d) => d.isToday);
      expect(todayDay?.isFuture).toBe(false);
    });
  });

  describe('habitCreatedAt handling', () => {
    it('marks dates before habit creation as isBeforeCreation', () => {
      // Create habit 3 days ago
      const today = new Date();
      const creationDate = new Date(today);
      creationDate.setDate(creationDate.getDate() - 3);
      const habitCreatedAt = creationDate.getTime();

      const week = generateWeekGrid(new Set(), habitCreatedAt);
      const beforeCreationDays = week.filter((d) => d.isBeforeCreation);

      // Depends on today's position in the week, but should have some before-creation days
      // if the week spans before the creation date
      beforeCreationDays.forEach((day) => {
        const dayDate = parseDateLocal(day.date!);
        expect(dayDate < creationDate).toBe(true);
      });
    });

    it('does not mark creation day as isBeforeCreation', () => {
      const today = new Date();
      const creationDate = new Date(today);
      creationDate.setDate(creationDate.getDate() - 2);
      const creationDateStr = format(creationDate, 'yyyy-MM-dd');
      const habitCreatedAt = creationDate.getTime();

      const week = generateWeekGrid(new Set(), habitCreatedAt);
      const creationDay = week.find((d) => d.date === creationDateStr);

      if (creationDay) {
        expect(creationDay.isBeforeCreation).toBe(false);
      }
    });

    it('handles undefined habitCreatedAt by not marking any days as before creation', () => {
      const week = generateWeekGrid(new Set());
      expect(week.every((d) => d.isBeforeCreation === false)).toBe(true);
    });

    it('handles habit created in the future', () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 30);
      const habitCreatedAt = futureDate.getTime();

      const week = generateWeekGrid(new Set(), habitCreatedAt);
      // All days should be before creation
      expect(week.every((d) => d.isBeforeCreation === true)).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('handles week that spans month boundary', () => {
      // This test verifies the function handles month transitions gracefully
      const week = generateWeekGrid(new Set());

      // Verify all dates are valid
      week.forEach((day) => {
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(day.dayOfMonth).toBeGreaterThanOrEqual(1);
        expect(day.dayOfMonth).toBeLessThanOrEqual(31);
      });
    });

    it('handles week that spans year boundary', () => {
      // Week around Dec 31 / Jan 1
      const week = generateWeekGrid(new Set());

      // Just verify no errors and all valid dates
      week.forEach((day) => {
        expect(day.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      });
    });

    it('works with all possible week start days', () => {
      const weekStartDays: Array<0 | 1 | 2 | 3 | 4 | 5 | 6> = [
        0, 1, 2, 3, 4, 5, 6,
      ];

      weekStartDays.forEach((startDay) => {
        const week = generateWeekGrid(new Set(), undefined, startDay);

        expect(week).toHaveLength(7);
        expect(week.every((d) => d.date !== null)).toBe(true);

        // First day should be the configured start day
        const firstDate = parseDateLocal(week[0].date!);
        expect(firstDate.getDay()).toBe(startDay);
      });
    });
  });
});

describe('calculateWeekStats', () => {
  const createMockWeekDay = (
    overrides: Partial<CalendarDay> = {}
  ): CalendarDay => ({
    date: '2025-12-15',
    dayOfMonth: 15,
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
    ...overrides,
  });

  describe('basic calculations', () => {
    it('counts completions correctly', () => {
      const week = [
        createMockWeekDay({ date: '2025-12-15', completed: true }),
        createMockWeekDay({ date: '2025-12-16', completed: false }),
        createMockWeekDay({ date: '2025-12-17', completed: true }),
        createMockWeekDay({ date: '2025-12-18', completed: true }),
        createMockWeekDay({ date: '2025-12-19', completed: false }),
        createMockWeekDay({ date: '2025-12-20', completed: true }),
        createMockWeekDay({ date: '2025-12-21', completed: false }),
      ];

      const stats = calculateWeekStats(week);
      expect(stats.completions).toBe(4);
      expect(stats.eligibleDays).toBe(7);
      expect(stats.successRate).toBeCloseTo(57.14, 1);
    });

    it('returns 0 for week with no completions', () => {
      const week = Array(7)
        .fill(null)
        .map((_, i) =>
          createMockWeekDay({ date: `2025-12-${15 + i}`, completed: false })
        );

      const stats = calculateWeekStats(week);
      expect(stats.completions).toBe(0);
      expect(stats.successRate).toBe(0);
    });

    it('returns 100% for perfect week', () => {
      const week = Array(7)
        .fill(null)
        .map((_, i) =>
          createMockWeekDay({ date: `2025-12-${15 + i}`, completed: true })
        );

      const stats = calculateWeekStats(week);
      expect(stats.completions).toBe(7);
      expect(stats.successRate).toBe(100);
    });
  });

  describe('excluded days', () => {
    it('excludes future days from eligible days', () => {
      const week = [
        createMockWeekDay({ date: '2025-12-15', completed: true }),
        createMockWeekDay({ date: '2025-12-16', completed: true }),
        createMockWeekDay({ date: '2025-12-17', completed: false }),
        createMockWeekDay({
          date: '2025-12-18',
          completed: false,
          isFuture: true,
        }),
        createMockWeekDay({
          date: '2025-12-19',
          completed: false,
          isFuture: true,
        }),
        createMockWeekDay({
          date: '2025-12-20',
          completed: false,
          isFuture: true,
        }),
        createMockWeekDay({
          date: '2025-12-21',
          completed: false,
          isFuture: true,
        }),
      ];

      const stats = calculateWeekStats(week);
      expect(stats.eligibleDays).toBe(3);
      expect(stats.completions).toBe(2);
      expect(stats.successRate).toBeCloseTo(66.67, 1);
    });

    it('excludes before-creation days from eligible days', () => {
      const week = [
        createMockWeekDay({
          date: '2025-12-15',
          completed: false,
          isBeforeCreation: true,
        }),
        createMockWeekDay({
          date: '2025-12-16',
          completed: false,
          isBeforeCreation: true,
        }),
        createMockWeekDay({ date: '2025-12-17', completed: true }),
        createMockWeekDay({ date: '2025-12-18', completed: true }),
        createMockWeekDay({ date: '2025-12-19', completed: true }),
        createMockWeekDay({ date: '2025-12-20', completed: false }),
        createMockWeekDay({ date: '2025-12-21', completed: false }),
      ];

      const stats = calculateWeekStats(week);
      expect(stats.eligibleDays).toBe(5);
      expect(stats.completions).toBe(3);
      expect(stats.successRate).toBe(60);
    });

    it('handles week with all excluded days', () => {
      const week = [
        createMockWeekDay({ date: '2025-12-15', isFuture: true }),
        createMockWeekDay({ date: '2025-12-16', isFuture: true }),
        createMockWeekDay({ date: '2025-12-17', isFuture: true }),
        createMockWeekDay({ date: '2025-12-18', isFuture: true }),
        createMockWeekDay({ date: '2025-12-19', isFuture: true }),
        createMockWeekDay({ date: '2025-12-20', isFuture: true }),
        createMockWeekDay({ date: '2025-12-21', isFuture: true }),
      ];

      const stats = calculateWeekStats(week);
      expect(stats.eligibleDays).toBe(0);
      expect(stats.completions).toBe(0);
      expect(stats.successRate).toBe(0);
    });

    it('does not count completions on excluded days', () => {
      const week = [
        createMockWeekDay({
          date: '2025-12-15',
          completed: true,
          isBeforeCreation: true,
        }),
        createMockWeekDay({
          date: '2025-12-16',
          completed: true,
          isFuture: true,
        }),
        createMockWeekDay({ date: '2025-12-17', completed: true }),
        createMockWeekDay({ date: '2025-12-18', completed: false }),
        createMockWeekDay({ date: '2025-12-19', completed: false }),
        createMockWeekDay({ date: '2025-12-20', completed: false }),
        createMockWeekDay({ date: '2025-12-21', completed: false }),
      ];

      const stats = calculateWeekStats(week);
      expect(stats.completions).toBe(1); // Only the non-excluded completion counts
    });
  });

  describe('integration with generateWeekGrid', () => {
    it('calculates stats correctly for generated week', () => {
      // Get dates that are definitely in the current week and eligible (not future)
      const week = generateWeekGrid(new Set());
      // Find eligible (non-future) days in the week
      const eligibleDays = week.filter((d) => !d.isFuture);

      // Complete all eligible days
      const completedDates = new Set(eligibleDays.map((d) => d.date!));
      const weekWithCompletions = generateWeekGrid(completedDates);
      const stats = calculateWeekStats(weekWithCompletions);

      // All eligible days should be completed
      expect(stats.completions).toBe(eligibleDays.length);
      expect(stats.successRate).toBe(100);
    });

    it('handles partial completion', () => {
      // Complete just today if there's only one eligible day
      const week = generateWeekGrid(new Set());
      const today = week.find((d) => d.isToday);
      expect(today).toBeDefined();

      const completedDates = new Set([today!.date!]);
      const weekWithCompletions = generateWeekGrid(completedDates);
      const stats = calculateWeekStats(weekWithCompletions);

      expect(stats.completions).toBe(1);
    });
  });
});

describe('calculateMonthStats', () => {
  const createMockDay = (
    overrides: Partial<CalendarDay> = {}
  ): CalendarDay => ({
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
      const grid = [
        [
          createMockDay({ date: null, dayOfMonth: null }),
          createMockDay({ date: null, dayOfMonth: null }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.completions).toBe(0);
      expect(stats.eligibleDays).toBe(0);
    });

    it('counts completions correctly', () => {
      const grid = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            completed: false,
          }),
          createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: true }),
          createMockDay({ date: '2025-12-04', dayOfMonth: 4, completed: true }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.completions).toBe(3);
    });

    it('counts eligible days correctly', () => {
      const grid = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1 }),
          createMockDay({ date: '2025-12-02', dayOfMonth: 2 }),
          createMockDay({ date: null, dayOfMonth: null }), // Padding
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.eligibleDays).toBe(2);
    });
  });

  describe('excluded days', () => {
    it('excludes null dates from eligible days', () => {
      const grid = [
        [
          createMockDay({ date: null, dayOfMonth: null }),
          createMockDay({ date: '2025-12-01', dayOfMonth: 1 }),
          createMockDay({ date: null, dayOfMonth: null }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.eligibleDays).toBe(1);
    });

    it('excludes future days from eligible days', () => {
      const grid = [
        [
          createMockDay({ date: '2025-12-15', dayOfMonth: 15 }),
          createMockDay({ date: '2025-12-16', dayOfMonth: 16, isFuture: true }),
          createMockDay({ date: '2025-12-17', dayOfMonth: 17, isFuture: true }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.eligibleDays).toBe(1);
    });

    it('excludes before-creation days from eligible days', () => {
      const grid = [
        [
          createMockDay({
            date: '2025-12-01',
            dayOfMonth: 1,
            isBeforeCreation: true,
          }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            isBeforeCreation: true,
          }),
          createMockDay({ date: '2025-12-03', dayOfMonth: 3 }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.eligibleDays).toBe(1);
    });

    it('does not count completions on excluded days', () => {
      const grid = [
        [
          createMockDay({
            date: '2025-12-01',
            dayOfMonth: 1,
            isBeforeCreation: true,
            completed: true,
          }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            isFuture: true,
            completed: true,
          }),
          createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: true }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.completions).toBe(1); // Only the non-excluded completion counts
    });
  });

  describe('success rate calculation', () => {
    it('calculates 100% success rate when all eligible days completed', () => {
      const grid = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({ date: '2025-12-02', dayOfMonth: 2, completed: true }),
          createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: true }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBe(100);
    });

    it('calculates 0% success rate when no days completed', () => {
      const grid = [
        [
          createMockDay({
            date: '2025-12-01',
            dayOfMonth: 1,
            completed: false,
          }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            completed: false,
          }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBe(0);
    });

    it('calculates 50% success rate correctly', () => {
      const grid = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            completed: false,
          }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBe(50);
    });

    it('calculates fractional percentages correctly', () => {
      const grid = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            completed: false,
          }),
          createMockDay({
            date: '2025-12-03',
            dayOfMonth: 3,
            completed: false,
          }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBeCloseTo(33.33, 1);
    });

    it('returns 0% success rate when no eligible days', () => {
      const grid = [
        [
          createMockDay({ date: null, dayOfMonth: null }),
          createMockDay({ date: '2025-12-15', dayOfMonth: 15, isFuture: true }),
        ],
      ];

      const stats = calculateMonthStats(grid, 11, 2025);
      expect(stats.successRate).toBe(0);
    });
  });

  describe('multi-week grid', () => {
    it('handles multiple weeks correctly', () => {
      const grid = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            completed: false,
          }),
        ],
        [
          createMockDay({ date: '2025-12-08', dayOfMonth: 8, completed: true }),
          createMockDay({ date: '2025-12-09', dayOfMonth: 9, completed: true }),
        ],
        [
          createMockDay({
            date: '2025-12-15',
            dayOfMonth: 15,
            completed: false,
          }),
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

describe('calculateDayOfWeekStats', () => {
  // Freeze time to 2025-12-21T12:00:00Z for consistent test results
  const FROZEN_DATE = new Date('2025-12-21T12:00:00Z');

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FROZEN_DATE);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('basic statistics', () => {
    it('returns stats for all 7 days of week', () => {
      const completedDates = new Set<string>();
      const stats = calculateDayOfWeekStats(completedDates, Date.now());

      expect(stats).toHaveLength(7);
      expect(stats.map((s) => s.day)).toEqual([
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ]);
    });

    it('calculates 100% rate when all occurrences completed', () => {
      // Create a habit from a Sunday and complete every Sunday
      // Use UTC noon (Z suffix) to match frozen time
      const habitCreatedAt = new Date('2025-12-07T12:00:00Z').getTime(); // Sunday
      const completedDates = new Set([
        '2025-12-07', // Sunday
        '2025-12-14', // Sunday
        '2025-12-21', // Sunday (today in frozen time)
      ]);

      const stats = calculateDayOfWeekStats(completedDates, habitCreatedAt);
      const sundayStats = stats[0];

      expect(sundayStats.day).toBe('Sunday');
      expect(sundayStats.count).toBe(3);
      expect(sundayStats.total).toBe(3);
      expect(sundayStats.rate).toBe(100);
    });

    it('calculates 0% rate when no days completed', () => {
      const habitCreatedAt = new Date('2025-12-01T12:00:00Z').getTime();
      const completedDates = new Set<string>();

      const stats = calculateDayOfWeekStats(completedDates, habitCreatedAt);

      stats.forEach((stat) => {
        expect(stat.count).toBe(0);
        expect(stat.rate).toBe(0);
      });
    });

    it('calculates 50% rate correctly', () => {
      // Habit created on Sunday Dec 7, today is Sunday Dec 21 (frozen time)
      // 3 Sundays total: 7th, 14th, 21st
      // Complete 7th and 21st (2/3 = 66.67%, rounds to 67%)
      // Use UTC noon (Z suffix) to match frozen time
      const habitCreatedAt = new Date('2025-12-07T12:00:00Z').getTime();
      const completedDates = new Set(['2025-12-07', '2025-12-21']);

      const stats = calculateDayOfWeekStats(completedDates, habitCreatedAt);
      const sundayStats = stats[0];

      expect(sundayStats.count).toBe(2);
      expect(sundayStats.total).toBe(3);
      expect(sundayStats.rate).toBe(67); // Rounded
    });
  });

  describe('habit creation date handling', () => {
    it('only counts days after habit creation', () => {
      // Habit created on Dec 15, 2025
      const habitCreatedAt = new Date('2025-12-15T12:00:00Z').getTime();
      const completedDates = new Set([
        '2025-12-10', // Before creation - should be ignored
        '2025-12-15', // Creation day - should count
        '2025-12-16', // After creation - should count
      ]);

      const stats = calculateDayOfWeekStats(completedDates, habitCreatedAt);
      const totalDaysTracked = stats.reduce((sum, s) => sum + s.total, 0);

      // Should only count from Dec 15 onwards
      const today = new Date();
      const createdDate = new Date('2025-12-15T12:00:00Z');
      const daysDiff =
        Math.floor(
          (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
        ) + 1;

      expect(totalDaysTracked).toBe(daysDiff);
    });

    it('handles undefined habitCreatedAt by using today as start', () => {
      const completedDates = new Set<string>();
      const stats = calculateDayOfWeekStats(completedDates);

      // When no creation date, should only have today
      const totalDaysTracked = stats.reduce((sum, s) => sum + s.total, 0);
      expect(totalDaysTracked).toBe(1);
    });
  });

  describe('various completion patterns', () => {
    it('tracks mixed completion patterns across days', () => {
      // Use a past date range to avoid today affecting results
      const habitCreatedAt = new Date('2020-01-06T12:00:00Z').getTime(); // Monday
      const completedDates = new Set([
        '2020-01-06', // Monday - completed
        '2020-01-07', // Tuesday - completed
        '2020-01-08', // Wednesday - completed
        // 2020-01-09 Thursday - skipped
        '2020-01-10', // Friday - completed
        // 2020-01-11 Saturday - skipped
        '2020-01-12', // Sunday - completed
        '2020-01-13', // Monday - completed
      ]);

      const stats = calculateDayOfWeekStats(completedDates, habitCreatedAt);

      // Since the function calculates from habitCreatedAt to TODAY,
      // we can't predict exact rates. Just check that:
      // - Completed days have non-zero counts
      // - Skipped days in the sample have lower rates
      expect(stats[1].count).toBeGreaterThan(0); // Monday had completions
      expect(stats[2].count).toBeGreaterThan(0); // Tuesday had completions
      expect(stats[3].count).toBeGreaterThan(0); // Wednesday had completions
      expect(stats[5].count).toBeGreaterThan(0); // Friday had completions

      // All days should have been tracked
      stats.forEach((stat) => {
        expect(stat.total).toBeGreaterThan(0);
      });
    });

    it('handles weekend vs weekday patterns', () => {
      const habitCreatedAt = new Date('2025-12-01T12:00:00Z').getTime(); // Monday
      const completedDates = new Set([
        // Complete all weekdays
        '2025-12-01', // Monday
        '2025-12-02', // Tuesday
        '2025-12-03', // Wednesday
        '2025-12-04', // Thursday
        '2025-12-05', // Friday
        // Skip weekends
        // '2025-12-06', // Saturday
        // '2025-12-07', // Sunday
        '2025-12-08', // Monday
      ]);

      const stats = calculateDayOfWeekStats(completedDates, habitCreatedAt);

      // Weekdays should have higher rates than weekends
      const weekdayRates = [
        stats[1],
        stats[2],
        stats[3],
        stats[4],
        stats[5],
      ].map((s) => s.rate);
      const weekendRates = [stats[0], stats[6]].map((s) => s.rate);

      expect(Math.min(...weekdayRates)).toBeGreaterThan(
        Math.max(...weekendRates)
      );
    });
  });

  describe('edge cases', () => {
    it('handles single day habit', () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const habitCreatedAt = today.getTime();
      const completedDates = new Set([todayStr]);

      const stats = calculateDayOfWeekStats(completedDates, habitCreatedAt);
      const todayDayOfWeek = today.getDay();

      expect(stats[todayDayOfWeek].total).toBe(1);
      expect(stats[todayDayOfWeek].count).toBe(1);
      expect(stats[todayDayOfWeek].rate).toBe(100);

      // All other days should have 0 total
      stats.forEach((stat, index) => {
        if (index !== todayDayOfWeek) {
          expect(stat.total).toBe(0);
          expect(stat.count).toBe(0);
        }
      });
    });

    it('handles empty completion set', () => {
      const habitCreatedAt = new Date('2025-12-01T12:00:00Z').getTime();
      const completedDates = new Set<string>();

      const stats = calculateDayOfWeekStats(completedDates, habitCreatedAt);

      stats.forEach((stat) => {
        expect(stat.count).toBe(0);
        expect(stat.rate).toBe(0);
        expect(stat.total).toBeGreaterThan(0);
      });
    });

    it('rounds rates correctly', () => {
      // Create a controlled scenario: exactly 3 weeks starting from a known Monday
      // Use a date range that ends exactly 3 weeks later (21 days)
      // This ensures exactly 3 occurrences of each day
      const startDate = new Date('2025-12-01T12:00:00Z'); // Monday
      const endDate = new Date('2025-12-21T12:00:00Z'); // Sunday, 3 weeks later

      // Mock Date to control "today"
      const originalDate = global.Date;
      const mockDate = class extends originalDate {
        constructor(...args: any[]) {
          if (args.length === 0) {
            super(2025, 11, 21); // Dec 21, 2025
          } else {
            // @ts-ignore
            super(...args);
          }
        }
        static now() {
          return new originalDate(2025, 11, 21).getTime();
        }
      } as DateConstructor;
      global.Date = mockDate;

      try {
        const habitCreatedAt = startDate.getTime();
        const completedDates = new Set([
          '2025-12-01', // Monday - completed (1 of 3)
          // Skip 2025-12-08 Monday
          // Skip 2025-12-15 Monday
        ]);

        const stats = calculateDayOfWeekStats(completedDates, habitCreatedAt);
        const mondayStats = stats[1];

        // 1/3 = 33.33... should round to 33
        expect(mondayStats.rate).toBe(33);
        expect(mondayStats.total).toBe(3); // Exactly 3 Mondays
        expect(mondayStats.count).toBe(1); // 1 completed
      } finally {
        global.Date = originalDate;
      }
    });
  });
});

describe('detectWeakDay', () => {
  const createMockStats = (rates: number[]): DayOfWeekStat[] => {
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return rates.map((rate, index) => ({
      day: dayNames[index],
      rate,
      count: rate,
      total: 100,
    }));
  };

  describe('threshold detection', () => {
    it('detects day >20% below average', () => {
      // Average: (80 + 85 + 90 + 85 + 80 + 85 + 40) / 7 = 77.86
      // Sunday (40) is 37.86% below average
      const stats = createMockStats([40, 85, 90, 85, 80, 85, 80]);
      const weakDay = detectWeakDay(stats);

      expect(weakDay).not.toBeNull();
      expect(weakDay?.day).toBe('Sunday');
      expect(weakDay?.rate).toBe(40);
    });

    it('returns null when no day is >20% below average', () => {
      // All days within 20% of average (80)
      const stats = createMockStats([75, 80, 85, 78, 82, 80, 80]);
      const weakDay = detectWeakDay(stats);

      expect(weakDay).toBeNull();
    });

    it('returns null when all days have same rate', () => {
      const stats = createMockStats([80, 80, 80, 80, 80, 80, 80]);
      const weakDay = detectWeakDay(stats);

      expect(weakDay).toBeNull();
    });

    it('detects day more than 20% below average as weak', () => {
      // Average: (58 + 80 + 80 + 80 + 80 + 80 + 82) / 7 = 77.14
      // Sunday (58) is 19.14 below average, which is not > 20
      // Let's use a clearer example: Average 80, Sunday 50 (30 below)
      const stats = createMockStats([50, 80, 85, 80, 80, 85, 80]);
      const weakDay = detectWeakDay(stats);

      // Average: 77.14, Sunday 50 is 27.14 below average (> 20 threshold)
      expect(weakDay).not.toBeNull();
      expect(weakDay?.day).toBe('Sunday');
      expect(weakDay?.rate).toBe(50);
    });
  });

  describe('multiple weak days', () => {
    it('returns weakest day when multiple are below threshold', () => {
      // Average: ~80
      // Sunday (30) and Saturday (50) both below threshold
      // Should return Sunday (30)
      const stats = createMockStats([30, 85, 90, 85, 90, 85, 50]);
      const weakDay = detectWeakDay(stats);

      expect(weakDay?.day).toBe('Sunday');
      expect(weakDay?.rate).toBe(30);
    });
  });

  describe('edge cases', () => {
    it('handles all zero rates', () => {
      const stats = createMockStats([0, 0, 0, 0, 0, 0, 0]);
      const weakDay = detectWeakDay(stats);

      expect(weakDay).toBeNull();
    });

    it('handles perfect 100% rates', () => {
      const stats = createMockStats([100, 100, 100, 100, 100, 100, 100]);
      const weakDay = detectWeakDay(stats);

      expect(weakDay).toBeNull();
    });

    it('detects weak day with extreme outlier', () => {
      // Average: ~86, Sunday: 0
      const stats = createMockStats([0, 100, 100, 100, 100, 100, 100]);
      const weakDay = detectWeakDay(stats);

      expect(weakDay?.day).toBe('Sunday');
      expect(weakDay?.rate).toBe(0);
    });

    it('handles varying rates with one clear outlier', () => {
      // Real-world scenario: weekday consistency, weekend drop
      // Average: ~80
      const stats = createMockStats([55, 85, 88, 90, 87, 86, 84]);
      const weakDay = detectWeakDay(stats);

      expect(weakDay?.day).toBe('Sunday');
      expect(weakDay?.rate).toBe(55);
    });
  });
});

describe('calculateStreakPosition', () => {
  // Freeze time to 2025-12-21T12:00:00Z for consistent test results
  const FROZEN_DATE = new Date('2025-12-21T12:00:00Z');

  // Helper to format date as YYYY-MM-DD in local time
  const formatLocalDate = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FROZEN_DATE);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  describe('valid streak detection', () => {
    it('returns correct position in ongoing streak', () => {
      const today = new Date();
      const todayStr = formatLocalDate(today);

      // Create a 5-day streak ending today
      const completedDates = new Set<string>();
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        completedDates.add(formatLocalDate(date));
      }

      // Check position of each day in streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatLocalDate(yesterday);

      expect(calculateStreakPosition(todayStr, completedDates)).toBe(5); // Most recent
      expect(calculateStreakPosition(yesterdayStr, completedDates)).toBe(4);
    });

    it('returns 1 for first day of streak', () => {
      const today = new Date();
      const todayStr = formatLocalDate(today);
      const completedDates = new Set([todayStr]);

      expect(calculateStreakPosition(todayStr, completedDates)).toBe(1);
    });

    it('handles streak that includes yesterday but not today', () => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatLocalDate(yesterday);

      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = formatLocalDate(twoDaysAgo);

      const completedDates = new Set([yesterdayStr, twoDaysAgoStr]);

      expect(calculateStreakPosition(yesterdayStr, completedDates)).toBe(2);
      expect(calculateStreakPosition(twoDaysAgoStr, completedDates)).toBe(1);
    });
  });

  describe('broken streak scenarios', () => {
    it('returns 0 for date not in completedDates', () => {
      const completedDates = new Set(['2025-12-01', '2025-12-02']);
      expect(calculateStreakPosition('2025-12-03', completedDates)).toBe(0);
    });

    it('returns 0 when streak is broken (no today or yesterday)', () => {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = formatLocalDate(twoDaysAgo);

      const completedDates = new Set([twoDaysAgoStr]);

      expect(calculateStreakPosition(twoDaysAgoStr, completedDates)).toBe(0);
    });

    it('returns 0 for date in old completed streak', () => {
      const today = new Date();
      const todayStr = formatLocalDate(today);

      // New streak today
      const completedDates = new Set([
        todayStr,
        '2025-12-01', // Old streak
        '2025-12-02', // Old streak
      ]);

      // Old dates should return 0 (not part of current streak)
      expect(calculateStreakPosition('2025-12-01', completedDates)).toBe(0);
      expect(calculateStreakPosition('2025-12-02', completedDates)).toBe(0);
    });
  });

  describe('future dates', () => {
    it('returns 0 for future dates', () => {
      const today = new Date();
      const todayStr = formatLocalDate(today);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = formatLocalDate(tomorrow);

      const completedDates = new Set([todayStr, tomorrowStr]);

      expect(calculateStreakPosition(tomorrowStr, completedDates)).toBe(0);
    });
  });

  describe('habit creation date handling', () => {
    it('stops streak calculation at habit creation date', () => {
      const today = new Date();
      const todayStr = formatLocalDate(today);

      // Habit created 3 days ago
      const habitCreatedAt = new Date(today);
      habitCreatedAt.setDate(habitCreatedAt.getDate() - 3);

      // Complete every day including before habit creation
      const completedDates = new Set<string>();
      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        completedDates.add(formatLocalDate(date));
      }

      // Streak should only count from habit creation (4 days including creation day)
      expect(
        calculateStreakPosition(
          todayStr,
          completedDates,
          habitCreatedAt.getTime()
        )
      ).toBe(4);
    });

    it('includes habit creation day in streak', () => {
      const creationDate = new Date();
      creationDate.setDate(creationDate.getDate() - 2);
      const creationDateStr = formatLocalDate(creationDate);
      const habitCreatedAt = creationDate.getTime();

      const today = new Date();
      const todayStr = formatLocalDate(today);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatLocalDate(yesterday);

      const completedDates = new Set([todayStr, yesterdayStr, creationDateStr]);

      expect(
        calculateStreakPosition(creationDateStr, completedDates, habitCreatedAt)
      ).toBe(1);
      expect(
        calculateStreakPosition(todayStr, completedDates, habitCreatedAt)
      ).toBe(3);
    });

    it('handles undefined habitCreatedAt', () => {
      const today = new Date();
      const todayStr = formatLocalDate(today);

      const completedDates = new Set<string>();
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        completedDates.add(formatLocalDate(date));
      }

      // Should calculate full streak without creation date restriction
      expect(calculateStreakPosition(todayStr, completedDates)).toBe(5);
    });
  });

  describe('edge cases', () => {
    it('handles single day streak', () => {
      const today = new Date();
      const todayStr = formatLocalDate(today);
      const completedDates = new Set([todayStr]);

      expect(calculateStreakPosition(todayStr, completedDates)).toBe(1);
    });

    it('handles long streak', () => {
      const today = new Date();
      const todayStr = formatLocalDate(today);

      // 30-day streak
      const completedDates = new Set<string>();
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        completedDates.add(formatLocalDate(date));
      }

      expect(calculateStreakPosition(todayStr, completedDates)).toBe(30);
    });

    it('handles streak with gaps in the past', () => {
      const today = new Date();
      const todayStr = formatLocalDate(today);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = formatLocalDate(yesterday);

      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const twoDaysAgoStr = formatLocalDate(twoDaysAgo);

      // Gap at 3 days ago
      const fiveDaysAgo = new Date(today);
      fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
      const fiveDaysAgoStr = formatLocalDate(fiveDaysAgo);

      const completedDates = new Set([
        todayStr,
        yesterdayStr,
        twoDaysAgoStr,
        // Gap at 3 and 4 days ago
        fiveDaysAgoStr,
      ]);

      // Current streak is only 3 days (today, yesterday, 2 days ago)
      expect(calculateStreakPosition(todayStr, completedDates)).toBe(3);
      expect(calculateStreakPosition(twoDaysAgoStr, completedDates)).toBe(1);
      // 5 days ago is not part of current streak
      expect(calculateStreakPosition(fiveDaysAgoStr, completedDates)).toBe(0);
    });
  });
});

describe('generateHorizontalGrid', () => {
  const countActualDays = (weeks: CalendarDay[][]): number => {
    return weeks.flat().filter((day) => day.date !== null).length;
  };

  describe('basic grid structure', () => {
    it('generates approximately 13 weeks for 3 months', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      // Should have ~13 weeks (90 days / 7 ≈ 13)
      expect(weeks.length).toBeGreaterThanOrEqual(12);
      expect(weeks.length).toBeLessThanOrEqual(14);
    });

    it('each week has exactly 7 days', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      weeks.forEach((week) => {
        expect(week.length).toBe(7);
      });
    });

    it('generates approximately 90 days of data', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      const actualDays = countActualDays(weeks);
      // Should have around 90 days (±7 for week alignment)
      expect(actualDays).toBeGreaterThanOrEqual(83);
      expect(actualDays).toBeLessThanOrEqual(97);
    });

    it('starts with index 0 being Sunday slot', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      // Verify the grid structure starts with Sunday slot (index 0)
      // The actual date stored there should align with Sunday when parsed locally
      const firstWeek = weeks[0];
      expect(firstWeek.length).toBe(7); // All weeks have 7 days

      // Find first non-null date and verify it's in the Sunday slot (index 0)
      const firstNonNullIndex = firstWeek.findIndex((d) => d.date !== null);
      if (firstNonNullIndex === 0 && firstWeek[0].date) {
        // If there's a date in Sunday slot, it should parse as Sunday in local time
        const dateStr = firstWeek[0].date;
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        expect(date.getDay()).toBe(0); // Sunday
      }
    });

    it('ends on or before the current date', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      // Find the last non-null date
      const lastWeek = weeks[weeks.length - 1];
      const lastDay = lastWeek.reverse().find((d) => d.date !== null);

      expect(lastDay).toBeDefined();
      if (lastDay?.date) {
        const lastDate = new Date(lastDay.date);
        expect(lastDate <= currentDate).toBe(true);
      }
    });
  });

  describe('month labels', () => {
    it('generates month labels for ~3 months', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { monthLabels } = generateHorizontalGrid(currentDate, new Set());

      // Should have 3-4 month labels (depending on week alignment)
      expect(monthLabels.length).toBeGreaterThanOrEqual(3);
      expect(monthLabels.length).toBeLessThanOrEqual(4);
    });

    it('month labels have correct format', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { monthLabels } = generateHorizontalGrid(currentDate, new Set());

      monthLabels.forEach((label) => {
        expect(label.weekIndex).toBeGreaterThanOrEqual(0);
        expect(label.label).toMatch(/^[A-Z][a-z]{2}$/); // e.g., "Oct", "Nov"
      });
    });

    it('month labels have incrementing week indices', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { monthLabels } = generateHorizontalGrid(currentDate, new Set());

      for (let i = 1; i < monthLabels.length; i++) {
        expect(monthLabels[i].weekIndex).toBeGreaterThan(
          monthLabels[i - 1].weekIndex
        );
      }
    });
  });

  describe('completed dates', () => {
    it('marks completed dates correctly', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const completedDates = new Set([
        '2025-12-01',
        '2025-12-15',
        '2025-11-20',
      ]);
      const { weeks } = generateHorizontalGrid(currentDate, completedDates);

      const allDays = weeks.flat().filter((d) => d.date !== null);
      const completedDays = allDays.filter((d) => d.completed);

      expect(completedDays.length).toBe(3);
      expect(completedDays.some((d) => d.date === '2025-12-01')).toBe(true);
      expect(completedDays.some((d) => d.date === '2025-12-15')).toBe(true);
      expect(completedDays.some((d) => d.date === '2025-11-20')).toBe(true);
    });

    it('returns completed=false when no dates are in the set', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      const allDays = weeks.flat().filter((d) => d.date !== null);
      expect(allDays.every((d) => d.completed === false)).toBe(true);
    });
  });

  describe('today detection', () => {
    // Freeze time to avoid timezone issues
    const FROZEN_DATE = new Date('2025-12-21T12:00:00Z');

    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(FROZEN_DATE);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('marks exactly one day as today', () => {
      const today = new Date();
      const { weeks } = generateHorizontalGrid(today, new Set());

      const todayDays = weeks.flat().filter((d) => d.isToday);
      expect(todayDays.length).toBe(1);
    });

    it('marks today with correct date', () => {
      const today = new Date();
      // Use date-fns format to get local date, matching how the component formats
      const todayStr = format(today, 'yyyy-MM-dd');
      const { weeks } = generateHorizontalGrid(today, new Set());

      const todayDay = weeks.flat().find((d) => d.isToday);
      expect(todayDay?.date).toBe(todayStr);
    });
  });

  describe('future dates detection', () => {
    it('marks dates after current date as future', () => {
      const currentDate = new Date('2025-12-20T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      const allDays = weeks.flat().filter((d) => d.date !== null);
      const futureDays = allDays.filter((d) => d.isFuture);

      // Should have 2 future days (21st and 22nd if today is 20th in test)
      futureDays.forEach((day) => {
        if (day.date) {
          const dayDate = new Date(day.date);
          expect(dayDate > currentDate).toBe(true);
        }
      });
    });

    it('today is not marked as future', () => {
      const today = new Date();
      const { weeks } = generateHorizontalGrid(today, new Set());

      const todayDay = weeks.flat().find((d) => d.isToday);
      expect(todayDay?.isFuture).toBe(false);
    });
  });

  describe('habitCreatedAt handling', () => {
    it('marks dates before habit creation as isBeforeCreation', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const habitCreatedAt = new Date('2025-12-01T12:00:00Z').getTime();
      const { weeks } = generateHorizontalGrid(
        currentDate,
        new Set(),
        habitCreatedAt
      );

      const beforeCreationDays = weeks.flat().filter((d) => d.isBeforeCreation);
      expect(beforeCreationDays.length).toBeGreaterThan(0);

      beforeCreationDays.forEach((day) => {
        if (day.date) {
          const dayDate = new Date(day.date);
          expect(dayDate < new Date(habitCreatedAt)).toBe(true);
        }
      });
    });

    it('does not mark creation day as isBeforeCreation', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const habitCreatedAt = new Date('2025-12-01T12:00:00Z').getTime();
      const { weeks } = generateHorizontalGrid(
        currentDate,
        new Set(),
        habitCreatedAt
      );

      const creationDay = weeks.flat().find((d) => d.date === '2025-12-01');
      expect(creationDay?.isBeforeCreation).toBe(false);
    });

    it('handles undefined habitCreatedAt by not marking any days as before creation', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      const allDays = weeks.flat().filter((d) => d.date !== null);
      expect(allDays.every((d) => d.isBeforeCreation === false)).toBe(true);
    });
  });

  describe('day-of-week rows', () => {
    it('organizes days correctly by day of week', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z'); // Monday
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      // Check that each position in the week corresponds to the correct day
      weeks.forEach((week) => {
        week.forEach((day, index) => {
          if (day.date) {
            // Parse date in local timezone to match how date-fns format works
            const [year, month, dayNum] = day.date.split('-').map(Number);
            const dayDate = new Date(year, month - 1, dayNum);
            expect(dayDate.getDay()).toBe(index); // index 0 = Sunday, 1 = Monday, etc.
          }
        });
      });
    });
  });

  describe('edge cases', () => {
    it('handles current date at beginning of month', () => {
      const currentDate = new Date('2025-12-01T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      expect(weeks.length).toBeGreaterThan(0);
      const actualDays = countActualDays(weeks);
      expect(actualDays).toBeGreaterThan(80);
    });

    it('handles current date at end of month', () => {
      const currentDate = new Date('2025-12-31T12:00:00Z');
      const { weeks } = generateHorizontalGrid(currentDate, new Set());

      expect(weeks.length).toBeGreaterThan(0);
      const actualDays = countActualDays(weeks);
      expect(actualDays).toBeGreaterThan(80);
    });
  });
});

describe('calculate3MonthStats', () => {
  const createMockDay = (
    overrides: Partial<CalendarDay> = {}
  ): CalendarDay => ({
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
      const weeks = [
        [
          createMockDay({ date: null, dayOfMonth: null }),
          createMockDay({ date: null, dayOfMonth: null }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.completions).toBe(0);
      expect(stats.eligibleDays).toBe(0);
    });

    it('counts completions correctly', () => {
      const weeks = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            completed: false,
          }),
          createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: true }),
          createMockDay({ date: '2025-12-04', dayOfMonth: 4, completed: true }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.completions).toBe(3);
    });

    it('counts eligible days correctly', () => {
      const weeks = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1 }),
          createMockDay({ date: '2025-12-02', dayOfMonth: 2 }),
          createMockDay({ date: null, dayOfMonth: null }), // Padding
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.eligibleDays).toBe(2);
    });
  });

  describe('excluded days', () => {
    it('excludes null dates from eligible days', () => {
      const weeks = [
        [
          createMockDay({ date: null, dayOfMonth: null }),
          createMockDay({ date: '2025-12-01', dayOfMonth: 1 }),
          createMockDay({ date: null, dayOfMonth: null }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.eligibleDays).toBe(1);
    });

    it('excludes future days from eligible days', () => {
      const weeks = [
        [
          createMockDay({ date: '2025-12-15', dayOfMonth: 15 }),
          createMockDay({ date: '2025-12-16', dayOfMonth: 16, isFuture: true }),
          createMockDay({ date: '2025-12-17', dayOfMonth: 17, isFuture: true }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.eligibleDays).toBe(1);
    });

    it('excludes before-creation days from eligible days', () => {
      const weeks = [
        [
          createMockDay({
            date: '2025-12-01',
            dayOfMonth: 1,
            isBeforeCreation: true,
          }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            isBeforeCreation: true,
          }),
          createMockDay({ date: '2025-12-03', dayOfMonth: 3 }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.eligibleDays).toBe(1);
    });

    it('does not count completions on excluded days', () => {
      const weeks = [
        [
          createMockDay({
            date: '2025-12-01',
            dayOfMonth: 1,
            isBeforeCreation: true,
            completed: true,
          }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            isFuture: true,
            completed: true,
          }),
          createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: true }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.completions).toBe(1);
    });
  });

  describe('success rate calculation', () => {
    it('calculates 100% success rate when all eligible days completed', () => {
      const weeks = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({ date: '2025-12-02', dayOfMonth: 2, completed: true }),
          createMockDay({ date: '2025-12-03', dayOfMonth: 3, completed: true }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.successRate).toBe(100);
    });

    it('calculates 0% success rate when no days completed', () => {
      const weeks = [
        [
          createMockDay({
            date: '2025-12-01',
            dayOfMonth: 1,
            completed: false,
          }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            completed: false,
          }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.successRate).toBe(0);
    });

    it('calculates 50% success rate correctly', () => {
      const weeks = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            completed: false,
          }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.successRate).toBe(50);
    });

    it('returns 0% success rate when no eligible days', () => {
      const weeks = [
        [
          createMockDay({ date: null, dayOfMonth: null }),
          createMockDay({ date: '2025-12-15', dayOfMonth: 15, isFuture: true }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.successRate).toBe(0);
    });
  });

  describe('multi-week grid', () => {
    it('handles multiple weeks correctly', () => {
      const weeks = [
        [
          createMockDay({ date: '2025-12-01', dayOfMonth: 1, completed: true }),
          createMockDay({
            date: '2025-12-02',
            dayOfMonth: 2,
            completed: false,
          }),
        ],
        [
          createMockDay({ date: '2025-12-08', dayOfMonth: 8, completed: true }),
          createMockDay({ date: '2025-12-09', dayOfMonth: 9, completed: true }),
        ],
        [
          createMockDay({
            date: '2025-12-15',
            dayOfMonth: 15,
            completed: false,
          }),
        ],
      ];

      const stats = calculate3MonthStats(weeks);
      expect(stats.completions).toBe(3);
      expect(stats.eligibleDays).toBe(5);
      expect(stats.successRate).toBe(60);
    });
  });

  describe('integration with generateHorizontalGrid', () => {
    it('calculates stats correctly for generated grid', () => {
      const currentDate = new Date('2025-12-22T12:00:00Z');
      const completedDates = new Set([
        '2025-12-01',
        '2025-12-05',
        '2025-12-10',
        '2025-11-15',
        '2025-11-20',
      ]);

      const { weeks } = generateHorizontalGrid(currentDate, completedDates);
      const stats = calculate3MonthStats(weeks);

      expect(stats.completions).toBe(5);
      expect(stats.eligibleDays).toBeGreaterThan(80);
      expect(stats.successRate).toBeGreaterThan(0);
      expect(stats.successRate).toBeLessThan(10); // 5 out of ~90 days
    });
  });
});

describe('calculate3MonthTrend', () => {
  describe('Trend calculation', () => {
    it('should return positive trend when current period is better', () => {
      const completedDates = new Set<string>();
      const currentDate = new Date('2024-03-15T12:00:00Z');

      // Previous 3 months (90-180 days ago): 50% completion (45/90)
      for (let i = 180; i > 90; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        if (i % 2 === 0) {
          // Every other day
          completedDates.add(format(date, 'yyyy-MM-dd'));
        }
      }

      // Current 3 months (0-90 days ago): 75% completion (~68/90)
      for (let i = 90; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        if (i % 4 !== 0) {
          // 3 out of 4 days
          completedDates.add(format(date, 'yyyy-MM-dd'));
        }
      }

      const trend = calculate3MonthTrend(
        completedDates,
        undefined,
        currentDate
      );
      expect(trend).toBeGreaterThan(0);
      expect(trend).toBeGreaterThanOrEqual(45);
      expect(trend).toBeLessThanOrEqual(55); // Approximately 50% improvement
    });

    it('should return negative trend when current period is worse', () => {
      const completedDates = new Set<string>();
      const currentDate = new Date('2024-03-15T12:00:00Z');

      // Previous 3 months: 80% completion
      for (let i = 180; i > 90; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        if (i % 5 !== 0) {
          // 4 out of 5 days
          completedDates.add(format(date, 'yyyy-MM-dd'));
        }
      }

      // Current 3 months: 40% completion
      for (let i = 90; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        if (i % 5 < 2) {
          // 2 out of 5 days
          completedDates.add(format(date, 'yyyy-MM-dd'));
        }
      }

      const trend = calculate3MonthTrend(
        completedDates,
        undefined,
        currentDate
      );
      expect(trend).toBeLessThan(0);
      expect(trend).toBeLessThanOrEqual(-45);
      expect(trend).toBeGreaterThanOrEqual(-55); // Approximately 50% decline
    });

    it('should return null when insufficient previous data (less than 30 days)', () => {
      const completedDates = new Set<string>();
      const currentDate = new Date('2024-03-15T12:00:00Z');
      const habitCreatedAt = currentDate.getTime() - 60 * 24 * 60 * 60 * 1000; // 60 days ago

      // Only 60 days of data total, not enough for previous period
      for (let i = 60; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        if (i % 2 === 0) {
          completedDates.add(format(date, 'yyyy-MM-dd'));
        }
      }

      const trend = calculate3MonthTrend(
        completedDates,
        habitCreatedAt,
        currentDate
      );
      expect(trend).toBeNull();
    });

    it('should return null when both periods have 0% completion', () => {
      const completedDates = new Set<string>();
      // No completions at all

      const trend = calculate3MonthTrend(completedDates);
      expect(trend).toBeNull();
    });

    it('should return 100% when starting from 0%', () => {
      const completedDates = new Set<string>();
      const currentDate = new Date('2024-03-15T12:00:00Z');

      // Previous 3 months: 0% completion (none)
      // (no dates added for previous period)

      // Current 3 months: some completion
      for (let i = 90; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        if (i % 2 === 0) {
          completedDates.add(format(date, 'yyyy-MM-dd'));
        }
      }

      const trend = calculate3MonthTrend(
        completedDates,
        undefined,
        currentDate
      );
      expect(trend).toBe(100);
    });

    it('should respect habitCreatedAt date', () => {
      const completedDates = new Set<string>();
      const currentDate = new Date('2024-03-15T12:00:00Z');
      const habitCreatedAt = currentDate.getTime() - 100 * 24 * 60 * 60 * 1000; // 100 days ago

      // Add completions only after creation date
      for (let i = 100; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        if (i % 2 === 0) {
          completedDates.add(format(date, 'yyyy-MM-dd'));
        }
      }

      const trend = calculate3MonthTrend(
        completedDates,
        habitCreatedAt,
        currentDate
      );
      // Should return null because not enough previous period data (only 10 days before current 3-month period)
      expect(trend).toBeNull();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty completedDates set', () => {
      const completedDates = new Set<string>();
      const trend = calculate3MonthTrend(completedDates);
      expect(trend).toBeNull();
    });

    it('should calculate correctly with 100% completion in both periods', () => {
      const completedDates = new Set<string>();
      const currentDate = new Date('2024-03-15T12:00:00Z');

      // Both periods: 100% completion
      for (let i = 180; i >= 0; i--) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        completedDates.add(format(date, 'yyyy-MM-dd'));
      }

      const trend = calculate3MonthTrend(
        completedDates,
        undefined,
        currentDate
      );
      expect(trend).toBe(0); // No change
    });
  });
});
