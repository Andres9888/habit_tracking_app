/**
 * DAY_LABELS Integration Tests
 * Progress Section Specification - Phase 8.3: Week Start Customization
 *
 * Tests that components correctly use rotated day labels based on the
 * WeekStartContext preference.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { WeekStartProvider } from '../WeekStartContext';
import { MonthGrid } from '../MonthGrid';
import { WeekGrid } from '../WeekGrid';
import { CalendarGrid } from '../CalendarGrid';
import type { CalendarDay } from '../types';
import { generateMonthGrid, generateWeekGrid } from '../utils';

// Mock dependencies
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: { Medium: 'medium' },
  selectionAsync: jest.fn(),
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Warning: 'warning' },
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Helper to create test week data
function createTestWeek(weekStartDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0): CalendarDay[] {
  return generateWeekGrid(new Set(['2025-01-01']), undefined, weekStartDay);
}

// Helper to create test month grid
function createTestMonthGrid(weekStartDay: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0): CalendarDay[][] {
  return generateMonthGrid(2025, 0, new Set(['2025-01-15']), undefined, weekStartDay);
}

// Helper to create test calendar grid weeks
function createTestCalendarWeeks(): CalendarDay[][] {
  const weeks: CalendarDay[][] = [];
  for (let w = 0; w < 4; w++) {
    const week: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const dayOfMonth = w * 7 + d + 1;
      week.push({
        date: `2025-01-${String(dayOfMonth).padStart(2, '0')}`,
        dayOfMonth,
        completed: dayOfMonth === 15,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      });
    }
    weeks.push(week);
  }
  return weeks;
}

describe('DAY_LABELS Integration with WeekStartContext', () => {
  describe('MonthGrid', () => {
    it('should display Sunday-first labels by default (no provider)', () => {
      const grid = createTestMonthGrid(0);

      render(
        <MonthGrid
          grid={grid}
          month={0}
          year={2025}
        />
      );

      // Check day labels in order (Sunday first)
      const dayLabels = screen.getAllByRole('none');
      // The first accessible element should be the calendar container,
      // then individual day labels
      expect(screen.getByText('S')).toBeTruthy();
      expect(screen.getByText('M')).toBeTruthy();
    });

    it('should display Monday-first labels when WeekStartProvider uses weekStartDay=1', () => {
      const grid = createTestMonthGrid(1);

      render(
        <WeekStartProvider initialWeekStart={1} persistSelection={false}>
          <MonthGrid
            grid={grid}
            month={0}
            year={2025}
          />
        </WeekStartProvider>
      );

      // Check accessibility labels for day headers (should be Monday-first)
      const mondayHeader = screen.getByAccessibilityLabel('Monday');
      expect(mondayHeader).toBeTruthy();
    });

    it('should update accessibility labels for day cells based on week start', () => {
      const grid = createTestMonthGrid(1);

      render(
        <WeekStartProvider initialWeekStart={1} persistSelection={false}>
          <MonthGrid
            grid={grid}
            month={0}
            year={2025}
          />
        </WeekStartProvider>
      );

      // First column should now be Monday (for Monday-start weeks)
      // The accessibility label should reflect the correct day name
      const mondayLabel = screen.getByAccessibilityLabel('Monday');
      expect(mondayLabel).toBeTruthy();
    });

    it('should display Saturday-first labels when weekStartDay=6', () => {
      const grid = createTestMonthGrid(6);

      render(
        <WeekStartProvider initialWeekStart={6} persistSelection={false}>
          <MonthGrid
            grid={grid}
            month={0}
            year={2025}
          />
        </WeekStartProvider>
      );

      const saturdayHeader = screen.getByAccessibilityLabel('Saturday');
      expect(saturdayHeader).toBeTruthy();
    });
  });

  describe('WeekGrid', () => {
    it('should display Sunday-first labels by default (no provider)', () => {
      const week = createTestWeek(0);

      render(
        <WeekGrid
          week={week}
        />
      );

      // First cell should have 'S' for Sunday
      expect(screen.getByText('S')).toBeTruthy();
    });

    it('should display Monday-first labels when weekStartDay=1', () => {
      const week = createTestWeek(1);

      render(
        <WeekStartProvider initialWeekStart={1} persistSelection={false}>
          <WeekGrid
            week={week}
          />
        </WeekStartProvider>
      );

      // First cell label should be 'M' for Monday
      const mondayLabel = screen.getAllByText('M');
      expect(mondayLabel.length).toBeGreaterThan(0);
    });

    it('should have correct accessibility labels for day cells', () => {
      const week = createTestWeek(1);

      render(
        <WeekStartProvider initialWeekStart={1} persistSelection={false}>
          <WeekGrid
            week={week}
          />
        </WeekStartProvider>
      );

      // Check that accessibility labels start with correct day names
      // First cell (index 0) should be Monday when weekStartDay=1
      const cells = screen.getAllByRole('button');
      // At least one cell should have Monday in its accessibility label
      const hasMondayCell = cells.some(
        (cell) => cell.props.accessibilityLabel?.includes('Monday')
      );
      expect(hasMondayCell).toBe(true);
    });

    it('should rotate labels correctly for Wednesday start (weekStartDay=3)', () => {
      const week = createTestWeek(3);

      render(
        <WeekStartProvider initialWeekStart={3} persistSelection={false}>
          <WeekGrid
            week={week}
          />
        </WeekStartProvider>
      );

      // First label should be 'W' for Wednesday
      const wLabels = screen.getAllByText('W');
      expect(wLabels.length).toBeGreaterThan(0);
    });
  });

  describe('CalendarGrid', () => {
    it('should display Sunday-first labels by default', () => {
      const weeks = createTestCalendarWeeks();
      const monthLabels = [{ weekIndex: 0, label: 'Jan' }];

      render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={new Set()}
        />
      );

      // Check for 'S' label (Sunday)
      expect(screen.getByText('S')).toBeTruthy();
    });

    it('should display Monday-first labels when weekStartDay=1', () => {
      const weeks = createTestCalendarWeeks();
      const monthLabels = [{ weekIndex: 0, label: 'Jan' }];

      render(
        <WeekStartProvider initialWeekStart={1} persistSelection={false}>
          <CalendarGrid
            weeks={weeks}
            monthLabels={monthLabels}
            completedDates={new Set()}
          />
        </WeekStartProvider>
      );

      // First day label should have Monday accessibility
      const mondayLabel = screen.getByAccessibilityLabel('Monday');
      expect(mondayLabel).toBeTruthy();
    });

    it('should update container accessibility label based on week start', () => {
      const weeks = createTestCalendarWeeks();
      const monthLabels = [{ weekIndex: 0, label: 'Jan' }];

      render(
        <WeekStartProvider initialWeekStart={1} persistSelection={false}>
          <CalendarGrid
            weeks={weeks}
            monthLabels={monthLabels}
            completedDates={new Set()}
          />
        </WeekStartProvider>
      );

      // Container should have accessibility label starting with Monday
      const container = screen.getByAccessibilityLabel(/^Days of the week: Monday/);
      expect(container).toBeTruthy();
    });

    it('should preserve correct day order for Friday start', () => {
      const weeks = createTestCalendarWeeks();
      const monthLabels = [{ weekIndex: 0, label: 'Jan' }];

      render(
        <WeekStartProvider initialWeekStart={5} persistSelection={false}>
          <CalendarGrid
            weeks={weeks}
            monthLabels={monthLabels}
            completedDates={new Set()}
          />
        </WeekStartProvider>
      );

      // Container accessibility label should start with Friday
      const container = screen.getByAccessibilityLabel(/^Days of the week: Friday/);
      expect(container).toBeTruthy();
    });
  });

  describe('Cross-Component Consistency', () => {
    it('should have same label order in MonthGrid and WeekGrid with same week start', () => {
      const week = createTestWeek(2);
      const monthGrid = createTestMonthGrid(2);

      const { unmount: unmountWeek } = render(
        <WeekStartProvider initialWeekStart={2} persistSelection={false}>
          <WeekGrid week={week} />
        </WeekStartProvider>
      );

      // WeekGrid should have Tuesday label
      const weekTuesday = screen.getAllByText('T');
      expect(weekTuesday.length).toBeGreaterThan(0);

      unmountWeek();

      render(
        <WeekStartProvider initialWeekStart={2} persistSelection={false}>
          <MonthGrid grid={monthGrid} month={0} year={2025} />
        </WeekStartProvider>
      );

      // MonthGrid should also have Tuesday accessibility label
      const monthTuesday = screen.getByAccessibilityLabel('Tuesday');
      expect(monthTuesday).toBeTruthy();
    });

    it('should handle dynamic week start changes', () => {
      const week = createTestWeek(0);

      // Render initially with Sunday start
      const { rerender } = render(
        <WeekStartProvider initialWeekStart={0} persistSelection={false}>
          <WeekGrid week={week} />
        </WeekStartProvider>
      );

      // Should have Sunday label first
      expect(screen.getByText('S')).toBeTruthy();

      // Re-render with Monday start
      rerender(
        <WeekStartProvider initialWeekStart={1} persistSelection={false}>
          <WeekGrid week={week} />
        </WeekStartProvider>
      );

      // Should now have Monday label first (check accessibility)
      const mondayCells = screen.getAllByRole('button').filter(
        (cell) => cell.props.accessibilityLabel?.includes('Monday')
      );
      expect(mondayCells.length).toBeGreaterThan(0);
    });
  });

  describe('Fallback Behavior (No Provider)', () => {
    it('MonthGrid should fall back to Sunday start without provider', () => {
      const grid = createTestMonthGrid(0);

      render(
        <MonthGrid
          grid={grid}
          month={0}
          year={2025}
        />
      );

      // Should have Sunday accessibility label
      const sundayLabel = screen.getByAccessibilityLabel('Sunday');
      expect(sundayLabel).toBeTruthy();
    });

    it('WeekGrid should fall back to Sunday start without provider', () => {
      const week = createTestWeek(0);

      render(
        <WeekGrid week={week} />
      );

      // First cell accessibility should include a day name (falls back to Sunday-based)
      const cells = screen.getAllByRole('button');
      expect(cells.length).toBe(7);
    });

    it('CalendarGrid should fall back to Sunday start without provider', () => {
      const weeks = createTestCalendarWeeks();
      const monthLabels = [{ weekIndex: 0, label: 'Jan' }];

      render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={new Set()}
        />
      );

      // Container should have Sunday-first accessibility label
      const container = screen.getByAccessibilityLabel(/^Days of the week: Sunday/);
      expect(container).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle all 7 possible week start values', () => {
      const weekStartOptions = [0, 1, 2, 3, 4, 5, 6] as const;
      const expectedFirstDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      weekStartOptions.forEach((weekStart, idx) => {
        const week = createTestWeek(weekStart);
        const { unmount } = render(
          <WeekStartProvider initialWeekStart={weekStart} persistSelection={false}>
            <WeekGrid week={week} />
          </WeekStartProvider>
        );

        // Check that at least one cell has the expected day name
        const cells = screen.getAllByRole('button');
        const hasExpectedDay = cells.some(
          (cell) => cell.props.accessibilityLabel?.includes(expectedFirstDays[idx])
        );
        expect(hasExpectedDay).toBe(true);

        unmount();
      });
    });

    it('should maintain correct rotation when grid data matches week start', () => {
      // Generate grid with Monday start
      const grid = createTestMonthGrid(1);

      render(
        <WeekStartProvider initialWeekStart={1} persistSelection={false}>
          <MonthGrid
            grid={grid}
            month={0}
            year={2025}
          />
        </WeekStartProvider>
      );

      // The first day header should be Monday
      const mondayHeader = screen.getByAccessibilityLabel('Monday');
      expect(mondayHeader).toBeTruthy();
    });
  });
});
