/**
 * Toggle Persistence Integration Tests
 * Tests that habit completion toggles persist correctly across component updates
 *
 * Validates:
 * - Toggle state persists after user interaction
 * - Re-renders maintain correct toggle state
 * - Optimistic UI updates work correctly with backend sync
 * - Multiple toggles in sequence persist correctly
 * - Toggle state survives parent re-renders
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { WeekGrid } from '../WeekGrid';
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

describe('Toggle Persistence Integration Tests', () => {
  const mockOnDayPress = jest.fn();

  // Helper: Create a week of CalendarDay objects
  const createWeek = (options: {
    startDate?: string;
    completedDays?: number[];
    todayIndex?: number;
    habitCreatedIndex?: number;
  } = {}): CalendarDay[] => {
    const {
      startDate = '2025-12-21',
      completedDays = [],
      todayIndex = 6, // Saturday is today by default (all past days are toggleable)
      habitCreatedIndex = 0,
    } = options;

    const baseDate = new Date(startDate);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setDate(baseDate.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfMonth = date.getDate();
      const isFuture = i > todayIndex && todayIndex >= 0;
      const isBeforeCreation = i < habitCreatedIndex;

      return {
        date: dateStr,
        dayOfMonth,
        completed: completedDays.includes(i),
        isToday: i === todayIndex,
        isFuture,
        isBeforeCreation,
      };
    });
  };

  // Helper: Create a month grid of CalendarDay objects
  const createMonthGrid = (options: {
    month?: number;
    year?: number;
    completedDates?: string[];
  } = {}): CalendarDay[][] => {
    const { month = 11, year = 2025, completedDates = [] } = options;
    const completedSet = new Set(completedDates);

    // Generate 5 weeks of days for December 2025
    const grid: CalendarDay[][] = [];
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay(); // 0 = Sunday

    let currentDate = new Date(firstDay);
    currentDate.setDate(1 - startPadding);

    for (let week = 0; week < 5; week++) {
      const weekDays: CalendarDay[] = [];
      for (let day = 0; day < 7; day++) {
        const dateStr = currentDate.toISOString().split('T')[0];
        const isInMonth = currentDate.getMonth() === month;
        const dayOfMonth = currentDate.getDate();
        const isToday = dateStr === '2025-12-28'; // Current date
        const isFuture = currentDate > new Date('2025-12-28');

        weekDays.push({
          date: isInMonth ? dateStr : null,
          dayOfMonth: isInMonth ? dayOfMonth : null,
          completed: completedSet.has(dateStr),
          isToday,
          isFuture,
          isBeforeCreation: false,
        });

        currentDate.setDate(currentDate.getDate() + 1);
      }
      grid.push(weekDays);
    }

    return grid;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('WeekGrid Toggle Persistence', () => {
    it('should persist toggle state when parent provides updated completion data', async () => {
      // Start with no completions
      const initialWeek = createWeek({ completedDays: [] });

      const { rerender, getByLabelText } = render(
        <WeekGrid week={initialWeek} onDayPress={mockOnDayPress} />
      );

      // Verify initial state - Sunday not completed
      expect(getByLabelText(/Sunday, 21$/)).toBeTruthy();

      // User taps Sunday to toggle
      const sundayCell = getByLabelText(/Sunday/);
      fireEvent.press(sundayCell);

      // Verify callback was called with correct arguments
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', false);

      // Simulate parent receiving backend response and re-rendering with updated data
      const updatedWeek = createWeek({ completedDays: [0] }); // Sunday now completed
      rerender(<WeekGrid week={updatedWeek} onDayPress={mockOnDayPress} />);

      // Verify persisted state - Sunday should now show as completed
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
    });

    it('should persist un-completion when toggling off a completed day', async () => {
      // Start with Sunday completed
      const initialWeek = createWeek({ completedDays: [0] });

      const { rerender, getByLabelText } = render(
        <WeekGrid week={initialWeek} onDayPress={mockOnDayPress} />
      );

      // Verify initial state - Sunday is completed
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();

      // User taps Sunday to un-complete
      const sundayCell = getByLabelText(/Sunday.*completed/);
      fireEvent.press(sundayCell);

      // Verify callback was called with correct arguments (true = was completed)
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', true);

      // Simulate parent receiving backend response
      const updatedWeek = createWeek({ completedDays: [] }); // Sunday now not completed
      rerender(<WeekGrid week={updatedWeek} onDayPress={mockOnDayPress} />);

      // Verify persisted state - Sunday should no longer show as completed
      expect(() => getByLabelText(/Sunday.*completed/)).toThrow();
      expect(getByLabelText(/Sunday, 21$/)).toBeTruthy();
    });

    it('should maintain correct state through multiple toggles', async () => {
      let completedDays: number[] = [];

      const { rerender, getByLabelText } = render(
        <WeekGrid week={createWeek({ completedDays })} onDayPress={mockOnDayPress} />
      );

      // Toggle 1: Complete Sunday
      fireEvent.press(getByLabelText(/Sunday/));
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', false);
      completedDays = [0];
      rerender(<WeekGrid week={createWeek({ completedDays })} onDayPress={mockOnDayPress} />);
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();

      // Toggle 2: Complete Monday
      fireEvent.press(getByLabelText(/Monday, 22$/));
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-22', false);
      completedDays = [0, 1];
      rerender(<WeekGrid week={createWeek({ completedDays })} onDayPress={mockOnDayPress} />);
      expect(getByLabelText(/Monday.*completed/)).toBeTruthy();

      // Toggle 3: Un-complete Sunday
      fireEvent.press(getByLabelText(/Sunday.*completed/));
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', true);
      completedDays = [1];
      rerender(<WeekGrid week={createWeek({ completedDays })} onDayPress={mockOnDayPress} />);

      // Final state: Monday completed, Sunday not completed
      expect(() => getByLabelText(/Sunday.*completed/)).toThrow();
      expect(getByLabelText(/Monday.*completed/)).toBeTruthy();
    });

    it('should handle optimistic updates followed by backend confirmation', () => {
      const initialWeek = createWeek({ completedDays: [] });

      const { rerender, getByLabelText } = render(
        <WeekGrid week={initialWeek} onDayPress={mockOnDayPress} instantToggle={true} />
      );

      // User taps to complete (optimistic UI shows completion immediately)
      fireEvent.press(getByLabelText(/Sunday/));

      // Verify callback triggered
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', false);

      // Backend confirms the toggle
      const confirmedWeek = createWeek({ completedDays: [0] });
      rerender(<WeekGrid week={confirmedWeek} onDayPress={mockOnDayPress} instantToggle={true} />);

      // State should be consistent after confirmation
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
    });

    it('should handle backend rejection (rollback scenario)', () => {
      const initialWeek = createWeek({ completedDays: [0] }); // Sunday starts completed

      const { rerender, getByLabelText } = render(
        <WeekGrid week={initialWeek} onDayPress={mockOnDayPress} instantToggle={true} />
      );

      // User tries to un-complete (optimistic UI would show uncompleted)
      fireEvent.press(getByLabelText(/Sunday.*completed/));
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', true);

      // Backend rejects - parent re-renders with original state (rollback)
      rerender(<WeekGrid week={initialWeek} onDayPress={mockOnDayPress} instantToggle={true} />);

      // UI should show completed again (rolled back)
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
    });

    it('should survive unrelated parent re-renders', () => {
      const week = createWeek({ completedDays: [0, 2] }); // Sunday, Tuesday completed

      const { rerender, getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} habitColor="#ff5500" />
      );

      // Verify initial state
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
      expect(getByLabelText(/Tuesday.*completed/)).toBeTruthy();

      // Parent re-renders with same data but different habitColor
      rerender(
        <WeekGrid week={week} onDayPress={mockOnDayPress} habitColor="#00ff55" />
      );

      // State should remain unchanged
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
      expect(getByLabelText(/Tuesday.*completed/)).toBeTruthy();
    });
  });

  describe('MonthGrid Toggle Persistence', () => {
    it('should persist toggle state when parent provides updated completion data', () => {
      const initialGrid = createMonthGrid({ completedDates: [] });

      const { rerender, getByLabelText } = render(
        <MonthGrid
          grid={initialGrid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Find and tap December 15
      const day15Cell = getByLabelText(/Monday, 15$/);
      fireEvent.press(day15Cell);

      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-15', false);

      // Simulate backend update
      const updatedGrid = createMonthGrid({ completedDates: ['2025-12-15'] });
      rerender(
        <MonthGrid
          grid={updatedGrid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Verify persisted state
      expect(getByLabelText(/Monday, 15.*completed/)).toBeTruthy();
    });

    it('should maintain state across multiple day toggles', () => {
      let completedDates: string[] = [];

      const { rerender, getByLabelText } = render(
        <MonthGrid
          grid={createMonthGrid({ completedDates })}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Toggle December 1
      fireEvent.press(getByLabelText(/Monday, 1$/));
      completedDates = ['2025-12-01'];
      rerender(
        <MonthGrid
          grid={createMonthGrid({ completedDates })}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );
      expect(getByLabelText(/Monday, 1.*completed/)).toBeTruthy();

      // Toggle December 10
      fireEvent.press(getByLabelText(/Wednesday, 10$/));
      completedDates = ['2025-12-01', '2025-12-10'];
      rerender(
        <MonthGrid
          grid={createMonthGrid({ completedDates })}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Both should be completed
      expect(getByLabelText(/Monday, 1.*completed/)).toBeTruthy();
      expect(getByLabelText(/Wednesday, 10.*completed/)).toBeTruthy();
    });

    it('should handle rapid toggle sequences', () => {
      const grid = createMonthGrid({ completedDates: [] });

      const { rerender, getByLabelText } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Rapid toggles on same day
      const dayCell = getByLabelText(/Monday, 1$/);
      fireEvent.press(dayCell);
      fireEvent.press(dayCell);
      fireEvent.press(dayCell);

      // Should have been called 3 times
      expect(mockOnDayPress).toHaveBeenCalledTimes(3);

      // Final backend state determines UI (odd number of toggles = completed)
      const finalGrid = createMonthGrid({ completedDates: ['2025-12-01'] });
      rerender(
        <MonthGrid
          grid={finalGrid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      expect(getByLabelText(/Monday, 1.*completed/)).toBeTruthy();
    });
  });

  describe('Cross-Component Consistency', () => {
    it('should maintain consistent toggle behavior between WeekGrid and MonthGrid', () => {
      // Both components should call onDayPress with the same signature
      const weekMockOnDayPress = jest.fn();
      const monthMockOnDayPress = jest.fn();

      const week = createWeek({ completedDays: [] });
      const grid = createMonthGrid({ completedDates: [] });

      const { getByLabelText: getWeekByLabel } = render(
        <WeekGrid week={week} onDayPress={weekMockOnDayPress} />
      );

      const { getByLabelText: getMonthByLabel } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={monthMockOnDayPress}
        />
      );

      // Toggle in WeekGrid
      fireEvent.press(getWeekByLabel(/Sunday/));

      // Toggle in MonthGrid (December 1, 2025 is a Monday)
      fireEvent.press(getMonthByLabel(/Monday, 1$/));

      // Both should have been called with (date, completed) signature
      expect(weekMockOnDayPress).toHaveBeenCalledWith(expect.any(String), false);
      expect(monthMockOnDayPress).toHaveBeenCalledWith('2025-12-01', false);
    });

    it('should provide consistent haptic feedback across components', () => {
      const Haptics = require('expo-haptics');

      const week = createWeek({ completedDays: [] });
      const grid = createMonthGrid({ completedDates: [] });

      const { getByLabelText: getWeekByLabel } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      const { getByLabelText: getMonthByLabel } = render(
        <MonthGrid
          grid={grid}
          month={11}
          year={2025}
          onDayPress={mockOnDayPress}
        />
      );

      // Toggle in WeekGrid
      fireEvent.press(getWeekByLabel(/Sunday/));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);

      Haptics.impactAsync.mockClear();

      // Toggle in MonthGrid
      fireEvent.press(getMonthByLabel(/Monday, 1$/));
      expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    });
  });

  describe('Edge Cases', () => {
    it('should not toggle future dates and maintain their state', () => {
      // Week where Thursday (index 4) is today, Friday and Saturday are future
      const week = createWeek({ todayIndex: 4, completedDays: [] });

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Try to toggle Friday (future)
      const fridayCell = getByLabelText(/Friday/);
      fireEvent.press(fridayCell);

      // Should not trigger callback for future dates
      expect(mockOnDayPress).not.toHaveBeenCalled();
    });

    it('should not toggle dates before habit creation and maintain their state', () => {
      // Week where habit was created on Wednesday (index 3)
      const week = createWeek({ habitCreatedIndex: 3, completedDays: [] });

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Try to toggle Monday (before creation)
      const mondayCell = getByLabelText(/Monday/);
      fireEvent.press(mondayCell);

      // Should not trigger callback for pre-creation dates
      expect(mockOnDayPress).not.toHaveBeenCalled();
    });

    it('should handle toggle with network latency (delayed backend response)', async () => {
      const initialWeek = createWeek({ completedDays: [] });

      const { rerender, getByLabelText } = render(
        <WeekGrid week={initialWeek} onDayPress={mockOnDayPress} />
      );

      // User taps
      fireEvent.press(getByLabelText(/Sunday/));
      expect(mockOnDayPress).toHaveBeenCalled();

      // Simulate delay - component might re-render with stale data
      rerender(<WeekGrid week={initialWeek} onDayPress={mockOnDayPress} />);

      // Eventually backend responds
      await waitFor(() => {
        const updatedWeek = createWeek({ completedDays: [0] });
        rerender(<WeekGrid week={updatedWeek} onDayPress={mockOnDayPress} />);
      });

      // Final state should reflect backend
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
    });
  });
});
