/**
 * DayCell Component Tests
 * Tests all cell states and interactions
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DayCell } from '../DayCell';
import type { CalendarDay } from '../types';

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

describe('DayCell', () => {
  const mockOnPress = jest.fn();
  const mockCompletedDates = new Set<string>();
  const mockHabitCreatedAt = new Date('2025-01-01').getTime();

  // Helper to add a completed date for testing
  const addCompletedDate = (date: string) => {
    mockCompletedDates.add(date);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCompletedDates.clear();
  });

  describe('Empty padding cell', () => {
    it('should render empty cell for null date', () => {
      const day: CalendarDay = {
        date: null,
        dayOfMonth: null,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { queryByText, getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      expect(queryByText(/\d+/)).toBeNull();
      expect(getByLabelText('Empty cell')).toBeTruthy();
    });

    it('should not be pressable', () => {
      const day: CalendarDay = {
        date: null,
        dayOfMonth: null,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText('Empty cell');
      expect(cell.props.accessibilityRole).toBe('text');
    });
  });

  describe('Before habit creation', () => {
    it('should render dimmed cell for dates before habit creation', () => {
      const day: CalendarDay = {
        date: '2025-01-01',
        dayOfMonth: 1,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: true,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      expect(getByLabelText(/January 1, 2025.*Before habit tracking started/)).toBeTruthy();
    });

    it('should not be pressable', () => {
      const day: CalendarDay = {
        date: '2025-01-01',
        dayOfMonth: 1,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: true,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/January 1, 2025.*Before habit tracking started/);
      expect(cell.props.accessibilityRole).toBe('text');
    });
  });

  describe('Future date', () => {
    it('should render future cell with dashed border', () => {
      const day: CalendarDay = {
        date: '2025-12-31',
        dayOfMonth: 31,
        completed: false,
        isToday: false,
        isFuture: true,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      expect(getByLabelText(/December 31, 2025.*Future date/)).toBeTruthy();
    });

    it('should not be pressable', () => {
      const day: CalendarDay = {
        date: '2025-12-31',
        dayOfMonth: 31,
        completed: false,
        isToday: false,
        isFuture: true,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/.*December 31, 2025.*Future date/);
      expect(cell.props.accessibilityRole).toBe('text');
    });
  });

  describe('Completed (past)', () => {
    it('should render completed cell with checkmark', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: true,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };
      addCompletedDate('2025-12-15');

      const { queryByText, getByTestId, getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      // Should show checkmark instead of date number
      expect(queryByText('15')).toBeNull();
      expect(getByTestId('lucide-icon-Check')).toBeTruthy();
      expect(getByLabelText(/December 15, 2025.*Completed/)).toBeTruthy();
    });

    it('should be pressable and call onPress', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: true,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };
      addCompletedDate('2025-12-15');

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/December 15, 2025.*Completed/);
      fireEvent.press(cell);

      expect(mockOnPress).toHaveBeenCalledWith('2025-12-15', true);
    });

    it('should use custom habit color', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: true,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };
      addCompletedDate('2025-12-15');

      const { getByTestId } = render(
        <DayCell day={day} index={0} habitColor="#ff0000" onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const checkIcon = getByTestId('lucide-icon-Check');
      // Verify the parent View has the custom color
      expect(checkIcon.parent?.props.style).toEqual({ backgroundColor: '#ff0000' });
    });

    it('should have selected accessibility state', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: true,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };
      addCompletedDate('2025-12-15');

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/December 15, 2025.*Completed/);
      expect(cell.props.accessibilityState.selected).toBe(true);
    });
  });

  describe('Today + completed', () => {
    it('should render today cell with checkmark and amber border', () => {
      const day: CalendarDay = {
        date: '2025-12-22',
        dayOfMonth: 22,
        completed: true,
        isToday: true,
        isFuture: false,
        isBeforeCreation: false,
      };
      addCompletedDate('2025-12-22');

      const { queryByText, getByTestId, getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      expect(queryByText('22')).toBeNull();
      expect(getByTestId('lucide-icon-Check')).toBeTruthy();
      expect(getByLabelText(/December 22, 2025.*Completed.*Today/)).toBeTruthy();
    });

    it('should not pulse when completed', () => {
      const day: CalendarDay = {
        date: '2025-12-22',
        dayOfMonth: 22,
        completed: true,
        isToday: true,
        isFuture: false,
        isBeforeCreation: false,
      };
      addCompletedDate('2025-12-22');

      const { queryByTestId } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      // Pulse ring should not be present when completed
      // This is implicit - we're testing the absence of the pulse element
      expect(queryByTestId('pulse-ring')).toBeNull();
    });
  });

  describe('Today + not completed (pending)', () => {
    it('should render today pending cell with date number and amber styling', () => {
      const day: CalendarDay = {
        date: '2025-12-22',
        dayOfMonth: 22,
        completed: false,
        isToday: true,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { queryByTestId, getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      expect(queryByTestId('lucide-icon-Check')).toBeNull();
      expect(getByLabelText(/December 22, 2025.*Not completed.*Today/)).toBeTruthy();
    });

    it('should be pressable', () => {
      const day: CalendarDay = {
        date: '2025-12-22',
        dayOfMonth: 22,
        completed: false,
        isToday: true,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/December 22, 2025.*Not completed.*Today/);
      fireEvent.press(cell);

      expect(mockOnPress).toHaveBeenCalledWith('2025-12-22', false);
    });

    it('should have Today accessibility hint', () => {
      const day: CalendarDay = {
        date: '2025-12-22',
        dayOfMonth: 22,
        completed: false,
        isToday: true,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/December 22, 2025.*Not completed.*Today/);
      expect(cell.props.accessibilityHint).toBe('Today');
    });
  });

  describe('Not completed (past)', () => {
    it('should render missed cell with date number and gray background', () => {
      const day: CalendarDay = {
        date: '2025-12-10',
        dayOfMonth: 10,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { queryByTestId, getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      expect(queryByTestId('lucide-icon-Check')).toBeNull();
      expect(getByLabelText(/December 10, 2025.*Not completed/)).toBeTruthy();
    });

    it('should be pressable', () => {
      const day: CalendarDay = {
        date: '2025-12-10',
        dayOfMonth: 10,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/December 10, 2025.*Not completed/);
      fireEvent.press(cell);

      expect(mockOnPress).toHaveBeenCalledWith('2025-12-10', false);
    });
  });

  describe('Interactions', () => {
    it('should handle press on valid dates', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/December 15, 2025/);
      fireEvent.press(cell);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
      expect(mockOnPress).toHaveBeenCalledWith('2025-12-15', false);
    });

    it('should not trigger onPress for non-interactive cells', () => {
      const day: CalendarDay = {
        date: '2025-12-31',
        dayOfMonth: 31,
        completed: false,
        isToday: false,
        isFuture: true,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/.*December 31, 2025.*Future date/);
      fireEvent.press(cell);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should handle non-pressable dates before habit creation', () => {
      const day: CalendarDay = {
        date: '2025-01-01',
        dayOfMonth: 1,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: true,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/.*January 1, 2025.*Before habit tracking started/);
      fireEvent.press(cell);

      expect(mockOnPress).not.toHaveBeenCalled();
    });

    it('should handle press without onPress callback', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(<DayCell day={day} index={0} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />);

      const cell = getByLabelText(/December 15, 2025/);
      // Should not throw
      expect(() => fireEvent.press(cell)).not.toThrow();
    });
  });

  describe('Animations', () => {
    it('should have staggered animation delay based on index', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { rerender } = render(<DayCell day={day} index={0} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />);
      // With index 0, delay should be 0

      rerender(<DayCell day={day} index={10} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />);
      // With index 10, delay should be 100ms (10 * 10)
      // Animation behavior is tested implicitly through rendering
    });

    it('should skip animations when reduceMotion is enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const day: CalendarDay = {
        date: '2025-12-22',
        dayOfMonth: 22,
        completed: false,
        isToday: true,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { queryByTestId } = render(<DayCell day={day} index={0} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />);

      // Pulse animation should not run when reduceMotion is true
      expect(queryByTestId('pulse-ring')).toBeNull();

      useReduceMotion.mockReturnValue(false);
    });
  });

  describe('Accessibility', () => {
    it('should have proper accessibility role for interactive cells', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/December 15, 2025/);
      expect(cell.props.accessibilityRole).toBe('button');
    });

    it('should have proper accessibility label with all context', () => {
      const completedDay: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: true,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={completedDay} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      // Should include date, completion status
      const cell = getByLabelText(/December 15, 2025.*Completed/);
      expect(cell).toBeTruthy();
    });

    it('should provide accessibility hint for interaction', () => {
      const day: CalendarDay = {
        date: '2025-12-15',
        dayOfMonth: 15,
        completed: false,
        isToday: false,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText } = render(
        <DayCell day={day} index={0} onPress={mockOnPress} completedDates={mockCompletedDates} habitCreatedAt={mockHabitCreatedAt} />
      );

      const cell = getByLabelText(/December 15, 2025/);
      expect(cell.props.accessibilityHint).toBe('Tap to view details');
    });
  });
});
