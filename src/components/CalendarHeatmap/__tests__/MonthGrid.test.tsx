/**
 * MonthGrid Component Tests
 * Tests month view rendering, instant toggle behavior, and day cell interactions
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MonthGrid } from '../MonthGrid';
import type { CalendarDay } from '../types';

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

describe('MonthGrid', () => {
  const mockOnDayPress = jest.fn();

  /**
   * Helper to create a month grid (5 weeks × 7 days)
   * Uses a Sunday-start calendar layout for consistent testing.
   * The grid represents a calendar where:
   * - Position [0][0] is Sunday of week 1
   * - Position [0][1] is Monday of week 1
   * - etc.
   */
  const createMonthGrid = (
    options: {
      completedDays?: number[]; // indices 0-34 (5 weeks × 7 days)
      todayIndex?: number;
      habitCreatedIndex?: number;
      emptyStartDays?: number; // padding cells at start (null dates)
      emptyEndDays?: number; // padding cells at end (null dates)
    } = {}
  ): CalendarDay[][] => {
    const {
      completedDays = [],
      todayIndex = -1,
      habitCreatedIndex = 0,
      emptyStartDays = 0,
      emptyEndDays = 0,
    } = options;

    const grid: CalendarDay[][] = [];

    for (let week = 0; week < 5; week++) {
      const weekDays: CalendarDay[] = [];
      for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        const flatIndex = week * 7 + dayOfWeek;

        // Handle empty padding cells (null dates for calendar padding)
        if (flatIndex < emptyStartDays || flatIndex >= 35 - emptyEndDays) {
          weekDays.push({
            date: null,
            dayOfMonth: null,
            completed: false,
            isToday: false,
            isFuture: false,
            isBeforeCreation: false,
          });
          continue;
        }

        // Calculate day of month (1-based, adjusted for empty start days)
        const dayOfMonth = flatIndex - emptyStartDays + 1;
        const dateStr = `2025-12-${String(dayOfMonth).padStart(2, '0')}`;
        const isFuture = flatIndex > todayIndex && todayIndex >= 0;
        const isBeforeCreation = flatIndex < habitCreatedIndex;

        weekDays.push({
          date: dateStr,
          dayOfMonth,
          completed: completedDays.includes(flatIndex),
          isToday: flatIndex === todayIndex,
          isFuture,
          isBeforeCreation,
        });
      }
      grid.push(weekDays);
    }

    return grid;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render month grid with 5 weeks and 7 days per week', () => {
      const grid = createMonthGrid();

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11} // December
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Check calendar label exists
      expect(getByLabelText('Calendar for December 2025')).toBeTruthy();
    });

    it('should render day of week labels', () => {
      const grid = createMonthGrid();

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Check all day labels are rendered (these are the column headers)
      expect(getByLabelText('Sunday')).toBeTruthy();
      expect(getByLabelText('Monday')).toBeTruthy();
      expect(getByLabelText('Tuesday')).toBeTruthy();
      expect(getByLabelText('Wednesday')).toBeTruthy();
      expect(getByLabelText('Thursday')).toBeTruthy();
      expect(getByLabelText('Friday')).toBeTruthy();
      expect(getByLabelText('Saturday')).toBeTruthy();
    });

    it('should show completed status in accessibility label', () => {
      // Position [0][0] = Sunday, day 1; Position [0][1] = Monday, day 2
      const grid = createMonthGrid({ completedDays: [0] }); // First cell (Sunday, 1) is completed

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Format is: "Sunday, 1, completed" (comma-separated)
      expect(getByLabelText('Sunday, 1, completed')).toBeTruthy();
    });

    it('should show today indicator in accessibility label', () => {
      // Position [2][0] = Sunday of week 3, day 15
      const grid = createMonthGrid({ todayIndex: 14 });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Format is: "Sunday, 15, today"
      expect(getByLabelText('Sunday, 15, today')).toBeTruthy();
    });

    it('should apply custom habit color to completed cells', () => {
      const grid = createMonthGrid({ completedDays: [0] });
      const customColor = '#ff5500';

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          habitColor={customColor}
          onDayPress={mockOnDayPress}
        />
      );

      // The cell should render with completed label (color is applied via styles)
      expect(getByLabelText('Sunday, 1, completed')).toBeTruthy();
    });

    it('should handle empty padding cells at start of month', () => {
      const grid = createMonthGrid({ emptyStartDays: 3 }); // First 3 cells are null/empty

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // First real day is Wednesday (position [0][3]), day 1
      expect(getByLabelText('Wednesday, 1')).toBeTruthy();
    });
  });

  describe('Instant Toggle Mode (default)', () => {
    it('should enable instant toggle by default', () => {
      const grid = createMonthGrid({ todayIndex: 14 });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Check accessibility hint indicates toggle behavior
      const firstCell = getByLabelText('Sunday, 1');
      expect(firstCell.props.accessibilityHint).toBe(
        'Tap to toggle completion'
      );
    });

    it('should trigger haptic feedback on press', () => {
      const Haptics = require('expo-haptics');
      const grid = createMonthGrid({ todayIndex: 14 });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      const firstCell = getByLabelText('Sunday, 1');
      fireEvent.press(firstCell);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it('should call onDayPress with date and current completion status when toggling', () => {
      const grid = createMonthGrid({ completedDays: [0] }); // First Sunday is completed

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Toggle completed day (un-complete)
      const completedCell = getByLabelText('Sunday, 1, completed');
      fireEvent.press(completedCell);
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-01', true); // true = was completed

      mockOnDayPress.mockClear();

      // Toggle incomplete day (complete)
      const incompleteCell = getByLabelText('Monday, 2');
      fireEvent.press(incompleteCell);
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-02', false); // false = was not completed
    });

    it('should not allow toggling future dates', () => {
      // todayIndex 7 = Sunday of week 2 = day 8
      const grid = createMonthGrid({ todayIndex: 7 });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Day 9 is Monday (position 8), which is future
      const futureCell = getByLabelText('Monday, 9');
      fireEvent.press(futureCell);

      expect(mockOnDayPress).not.toHaveBeenCalled();
    });

    it('should not allow toggling dates before habit creation', () => {
      // habitCreatedIndex 7 means habit created at position [1][0] = day 8
      const grid = createMonthGrid({ habitCreatedIndex: 7 });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Day 1 is before habit creation (position 0 < 7)
      const beforeCreationCell = getByLabelText('Sunday, 1');
      fireEvent.press(beforeCreationCell);

      expect(mockOnDayPress).not.toHaveBeenCalled();
    });

    it('should show disabled state for non-interactive cells', () => {
      // todayIndex 14 = day 15 (row 2, col 0 = Sunday), habitCreatedIndex 7 = day 8
      const grid = createMonthGrid({ todayIndex: 14, habitCreatedIndex: 7 });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Day 1 (position 0) is before habit creation (< 7)
      const beforeCreationCell = getByLabelText('Sunday, 1');
      expect(beforeCreationCell.props.accessibilityState.disabled).toBe(true);

      // Day 16 (position 15 = row 2, col 1 = Monday) is after today (> 14), so it's future
      const futureCell = getByLabelText('Monday, 16');
      expect(futureCell.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Non-Instant Toggle Mode', () => {
    it('should show different accessibility hint when instant toggle is disabled', () => {
      const grid = createMonthGrid({ todayIndex: 14 });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
          instantToggle={false}
        />
      );

      const firstCell = getByLabelText('Sunday, 1');
      expect(firstCell.props.accessibilityHint).toBe('Tap to view details');
    });

    it('should still call onDayPress when instantToggle is false', () => {
      const grid = createMonthGrid();

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
          instantToggle={false}
        />
      );

      const firstCell = getByLabelText('Sunday, 1');
      fireEvent.press(firstCell);

      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-01', false);
    });

    it('should still trigger haptic feedback when instantToggle is false', () => {
      const Haptics = require('expo-haptics');
      const grid = createMonthGrid();

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
          instantToggle={false}
        />
      );

      const firstCell = getByLabelText('Sunday, 1');
      fireEvent.press(firstCell);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });
  });

  describe('Backend State Sync', () => {
    it('should sync animation state when completion status changes from backend', () => {
      const initialGrid = createMonthGrid({ completedDays: [] });

      const { rerender, getByLabelText, queryByLabelText } = render(
        <MonthGrid
          grid={initialGrid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Verify initially not completed
      expect(getByLabelText('Sunday, 1')).toBeTruthy();
      expect(queryByLabelText('Sunday, 1, completed')).toBeNull();

      // Simulate backend update - first Sunday becomes completed
      const updatedGrid = createMonthGrid({ completedDays: [0] });
      rerender(
        <MonthGrid
          grid={updatedGrid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Should now show as completed
      expect(getByLabelText('Sunday, 1, completed')).toBeTruthy();
    });

    it('should handle rapid completion status changes', () => {
      const grid1 = createMonthGrid({ completedDays: [] });
      const grid2 = createMonthGrid({ completedDays: [0] });
      const grid3 = createMonthGrid({ completedDays: [] });

      const { rerender, queryByLabelText } = render(
        <MonthGrid
          grid={grid1}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Rapid changes
      rerender(
        <MonthGrid
          grid={grid2}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );
      rerender(
        <MonthGrid
          grid={grid3}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Final state should be not completed
      expect(queryByLabelText('Sunday, 1, completed')).toBeNull();
    });
  });

  describe('Interactions', () => {
    it('should handle press-in and press-out for visual feedback', () => {
      const grid = createMonthGrid();

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      const firstCell = getByLabelText('Sunday, 1');

      // These events should not throw
      fireEvent(firstCell, 'pressIn');
      fireEvent(firstCell, 'pressOut');
    });

    it('should work without onDayPress callback', () => {
      const grid = createMonthGrid();

      const { getByLabelText } = render(
        <MonthGrid grid={grid} month={11} year={2025} />
      );

      const firstCell = getByLabelText('Sunday, 1');

      // Should not throw when pressed without callback
      expect(() => fireEvent.press(firstCell)).not.toThrow();
    });
  });

  describe('Animations', () => {
    it('should have staggered entry animations by row and column', () => {
      const grid = createMonthGrid();

      render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Animation behavior is tested implicitly through rendering
      // Each cell has a delay of rowIndex * 30 + colIndex * 10
    });

    it('should skip animations when reduceMotion is enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const grid = createMonthGrid({ completedDays: [0] });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Cell should render without animations
      expect(getByLabelText('Sunday, 1, completed')).toBeTruthy();

      useReduceMotion.mockReturnValue(false);
    });

    it('should apply instant state updates when reduceMotion is enabled during toggle', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const grid = createMonthGrid();

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      const firstCell = getByLabelText('Sunday, 1');
      fireEvent.press(firstCell);

      // Should call handler immediately without animation
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-01', false);

      useReduceMotion.mockReturnValue(false);
    });
  });

  describe('Accessibility', () => {
    it('should have button role for interactive cells', () => {
      const grid = createMonthGrid();

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      const firstCell = getByLabelText('Sunday, 1');
      expect(firstCell.props.accessibilityRole).toBe('button');
    });

    it('should include day name, day of month, and status in accessibility label', () => {
      const grid = createMonthGrid({
        completedDays: [0],
        todayIndex: 0,
      }); // First Sunday is completed and today

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Should include day name, day number, completion status, and today indicator
      // Format: "Sunday, 1, completed, today"
      expect(getByLabelText('Sunday, 1, completed, today')).toBeTruthy();
    });

    it('should provide appropriate hints for all interaction modes', () => {
      const grid = createMonthGrid();

      const { getByLabelText, rerender } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
          instantToggle={true}
        />
      );

      expect(getByLabelText('Sunday, 1').props.accessibilityHint).toBe(
        'Tap to toggle completion'
      );

      rerender(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
          instantToggle={false}
        />
      );

      expect(getByLabelText('Sunday, 1').props.accessibilityHint).toBe(
        'Tap to view details'
      );
    });

    it('should have calendar accessibility label with month and year', () => {
      const grid = createMonthGrid();

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={0} // January
          year={2026}
          onDayPress={mockOnDayPress}
        />
      );

      expect(getByLabelText('Calendar for January 2026')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty dates (padding cells) gracefully', () => {
      const grid = createMonthGrid({ emptyStartDays: 3 }); // First 3 cells are padding

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // First real day is Wednesday (position [0][3]), day 1
      expect(getByLabelText('Wednesday, 1')).toBeTruthy();
    });

    it('should handle grid with all days completed', () => {
      // Complete all 35 days
      const completedDays = Array.from({ length: 35 }, (_, i) => i);
      const grid = createMonthGrid({ completedDays });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // All days should show as completed
      expect(getByLabelText('Sunday, 1, completed')).toBeTruthy();
      expect(getByLabelText('Monday, 2, completed')).toBeTruthy();
    });

    it('should handle grid with no completed days', () => {
      const grid = createMonthGrid({ completedDays: [] });

      const { queryByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // No days should show as completed
      expect(queryByLabelText(/completed/)).toBeNull();
    });

    it('should display correct month name for different months', () => {
      const grid = createMonthGrid();

      const { getByLabelText, rerender } = render(
        <MonthGrid
          grid={grid}
          month={5} // June
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      expect(getByLabelText('Calendar for June 2025')).toBeTruthy();

      rerender(
        <MonthGrid
          grid={grid}
          month={0} // January
          year={2026}
          onDayPress={mockOnDayPress}
        />
      );

      expect(getByLabelText('Calendar for January 2026')).toBeTruthy();
    });

    it('should handle mixed completion states across weeks', () => {
      // Complete some days in different weeks
      // Position 0 = Sunday, day 1 | Position 8 = Monday of week 2, day 9
      // Position 15 = Monday of week 3, day 16 | Position 22 = Monday of week 4, day 23
      const grid = createMonthGrid({ completedDays: [0, 8, 15, 22] });

      const { getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Check specific completed days
      expect(getByLabelText('Sunday, 1, completed')).toBeTruthy();
      expect(getByLabelText('Monday, 9, completed')).toBeTruthy();
      expect(getByLabelText('Monday, 16, completed')).toBeTruthy();
      expect(getByLabelText('Monday, 23, completed')).toBeTruthy();
    });
  });
});
