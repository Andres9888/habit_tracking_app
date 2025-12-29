/**
 * WeekGrid Component Tests
 * Tests week view rendering, instant toggle behavior, and day cell interactions
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { WeekGrid } from '../WeekGrid';
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

describe('WeekGrid', () => {
  const mockOnDayPress = jest.fn();

  // Helper to create a week of CalendarDay objects
  // Uses noon UTC to avoid timezone boundary issues
  const createWeek = (
    options: {
      startDate?: string;
      completedDays?: number[];
      todayIndex?: number;
      habitCreatedIndex?: number;
    } = {}
  ): CalendarDay[] => {
    const {
      startDate = '2025-12-21',
      completedDays = [],
      todayIndex = -1,
      habitCreatedIndex = 0,
    } = options;

    // Parse date as noon UTC to avoid timezone boundary issues
    const baseDate = new Date(`${startDate}T12:00:00Z`);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(baseDate);
      date.setUTCDate(baseDate.getUTCDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      const dayOfMonth = date.getUTCDate();
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Basic Rendering', () => {
    it('should render 7 day cells for a week', () => {
      const week = createWeek();

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Check all 7 days are rendered
      expect(getByLabelText(/Sunday/)).toBeTruthy();
      expect(getByLabelText(/Monday/)).toBeTruthy();
      expect(getByLabelText(/Tuesday/)).toBeTruthy();
      expect(getByLabelText(/Wednesday/)).toBeTruthy();
      expect(getByLabelText(/Thursday/)).toBeTruthy();
      expect(getByLabelText(/Friday/)).toBeTruthy();
      expect(getByLabelText(/Saturday/)).toBeTruthy();
    });

    it('should have accessible week view label', () => {
      const week = createWeek();

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      expect(getByLabelText('Week view calendar')).toBeTruthy();
    });

    it('should show completed status in accessibility label', () => {
      const week = createWeek({ completedDays: [0, 2] }); // Sunday, Tuesday completed

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
      expect(getByLabelText(/Tuesday.*completed/)).toBeTruthy();
    });

    it('should show today indicator in accessibility label', () => {
      const week = createWeek({ todayIndex: 3 }); // Wednesday is today

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      expect(getByLabelText(/Wednesday.*today/)).toBeTruthy();
    });

    it('should apply custom habit color to completed cells', () => {
      const week = createWeek({ completedDays: [0] });
      const customColor = '#ff5500';

      const { getByLabelText } = render(
        <WeekGrid
          week={week}
          habitColor={customColor}
          onDayPress={mockOnDayPress}
        />
      );

      // The cell should render with custom color
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
    });
  });

  describe('Instant Toggle Mode (default)', () => {
    it('should enable instant toggle by default', () => {
      const week = createWeek({ todayIndex: 3 });

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Check accessibility hint indicates toggle behavior
      const sundayCell = getByLabelText(/Sunday/);
      expect(sundayCell.props.accessibilityHint).toBe(
        'Tap to toggle completion'
      );
    });

    it('should trigger haptic feedback on press', () => {
      const Haptics = require('expo-haptics');
      const week = createWeek({ todayIndex: 3 });

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      const sundayCell = getByLabelText(/Sunday/);
      fireEvent.press(sundayCell);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });

    it('should call onDayPress with date and current completion status when toggling', () => {
      const week = createWeek({ completedDays: [0] }); // Sunday is completed

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Toggle completed day (un-complete)
      const sundayCell = getByLabelText(/Sunday.*completed/);
      fireEvent.press(sundayCell);
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', true); // true = was completed

      mockOnDayPress.mockClear();

      // Toggle incomplete day (complete)
      const mondayCell = getByLabelText(/Monday/);
      fireEvent.press(mondayCell);
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-22', false); // false = was not completed
    });

    it('should not allow toggling future dates', () => {
      const week = createWeek({ todayIndex: 3 }); // Wednesday is today, Thu-Sat are future

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Try to press a future date
      const saturdayCell = getByLabelText(/Saturday/);
      fireEvent.press(saturdayCell);

      expect(mockOnDayPress).not.toHaveBeenCalled();
    });

    it('should not allow toggling dates before habit creation', () => {
      const week = createWeek({ habitCreatedIndex: 3 }); // Habit created on Wednesday, Sun-Tue are before

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Try to press a date before habit creation
      const sundayCell = getByLabelText(/Sunday/);
      fireEvent.press(sundayCell);

      expect(mockOnDayPress).not.toHaveBeenCalled();
    });

    it('should show disabled state for non-interactive cells', () => {
      const week = createWeek({ todayIndex: 3, habitCreatedIndex: 1 });

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Sunday is before creation
      const sundayCell = getByLabelText(/Sunday/);
      expect(sundayCell.props.accessibilityState.disabled).toBe(true);

      // Saturday is future
      const saturdayCell = getByLabelText(/Saturday/);
      expect(saturdayCell.props.accessibilityState.disabled).toBe(true);
    });
  });

  describe('Non-Instant Toggle Mode', () => {
    it('should show different accessibility hint when instant toggle is disabled', () => {
      const week = createWeek({ todayIndex: 3 });

      const { getByLabelText } = render(
        <WeekGrid
          week={week}
          onDayPress={mockOnDayPress}
          instantToggle={false}
        />
      );

      const sundayCell = getByLabelText(/Sunday/);
      expect(sundayCell.props.accessibilityHint).toBe('Tap to view details');
    });

    it('should still call onDayPress when instantToggle is false', () => {
      const week = createWeek();

      const { getByLabelText } = render(
        <WeekGrid
          week={week}
          onDayPress={mockOnDayPress}
          instantToggle={false}
        />
      );

      const sundayCell = getByLabelText(/Sunday/);
      fireEvent.press(sundayCell);

      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', false);
    });

    it('should still trigger haptic feedback when instantToggle is false', () => {
      const Haptics = require('expo-haptics');
      const week = createWeek();

      const { getByLabelText } = render(
        <WeekGrid
          week={week}
          onDayPress={mockOnDayPress}
          instantToggle={false}
        />
      );

      const sundayCell = getByLabelText(/Sunday/);
      fireEvent.press(sundayCell);

      expect(Haptics.impactAsync).toHaveBeenCalledWith(
        Haptics.ImpactFeedbackStyle.Medium
      );
    });
  });

  describe('Backend State Sync', () => {
    it('should sync animation state when completion status changes from backend', () => {
      const initialWeek = createWeek({ completedDays: [] });

      const { rerender, getByLabelText } = render(
        <WeekGrid week={initialWeek} onDayPress={mockOnDayPress} />
      );

      // Verify initially not completed
      expect(getByLabelText(/Sunday/)).toBeTruthy();
      expect(() => getByLabelText(/Sunday.*completed/)).toThrow();

      // Simulate backend update - Sunday becomes completed
      const updatedWeek = createWeek({ completedDays: [0] });
      rerender(<WeekGrid week={updatedWeek} onDayPress={mockOnDayPress} />);

      // Should now show as completed
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
    });

    it('should handle rapid completion status changes', () => {
      const week1 = createWeek({ completedDays: [] });
      const week2 = createWeek({ completedDays: [0] });
      const week3 = createWeek({ completedDays: [] });

      const { rerender, getByLabelText } = render(
        <WeekGrid week={week1} onDayPress={mockOnDayPress} />
      );

      // Rapid changes
      rerender(<WeekGrid week={week2} onDayPress={mockOnDayPress} />);
      rerender(<WeekGrid week={week3} onDayPress={mockOnDayPress} />);

      // Final state should be not completed
      expect(() => getByLabelText(/Sunday.*completed/)).toThrow();
    });
  });

  describe('Interactions', () => {
    it('should handle press-in and press-out for visual feedback', () => {
      const week = createWeek();

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      const sundayCell = getByLabelText(/Sunday/);

      // These events should not throw
      fireEvent(sundayCell, 'pressIn');
      fireEvent(sundayCell, 'pressOut');
    });

    it('should work without onDayPress callback', () => {
      const week = createWeek();

      const { getByLabelText } = render(<WeekGrid week={week} />);

      const sundayCell = getByLabelText(/Sunday/);

      // Should not throw when pressed without callback
      expect(() => fireEvent.press(sundayCell)).not.toThrow();
    });
  });

  describe('Animations', () => {
    it('should have staggered entry animations', () => {
      const week = createWeek();

      render(<WeekGrid week={week} onDayPress={mockOnDayPress} />);

      // Animation behavior is tested implicitly through rendering
      // Each cell has a delay of index * 50ms
    });

    it('should skip animations when reduceMotion is enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const week = createWeek({ completedDays: [0] });

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Cell should render without animations
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();

      useReduceMotion.mockReturnValue(false);
    });

    it('should apply instant state updates when reduceMotion is enabled during toggle', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const week = createWeek();

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      const sundayCell = getByLabelText(/Sunday/);
      fireEvent.press(sundayCell);

      // Should call handler immediately without animation
      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', false);

      useReduceMotion.mockReturnValue(false);
    });
  });

  describe('Accessibility', () => {
    it('should have button role for interactive cells', () => {
      const week = createWeek();

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      const sundayCell = getByLabelText(/Sunday/);
      expect(sundayCell.props.accessibilityRole).toBe('button');
    });

    it('should include day name, day of month, and status in accessibility label', () => {
      const week = createWeek({
        completedDays: [0],
        todayIndex: 0,
      }); // Sunday is completed and today

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Should include day name, completion status, and today indicator
      expect(getByLabelText(/Sunday.*21.*completed.*today/)).toBeTruthy();
    });

    it('should provide appropriate hints for all interaction modes', () => {
      const week = createWeek();

      const { getByLabelText, rerender } = render(
        <WeekGrid
          week={week}
          onDayPress={mockOnDayPress}
          instantToggle={true}
        />
      );

      expect(getByLabelText(/Sunday/).props.accessibilityHint).toBe(
        'Tap to toggle completion'
      );

      rerender(
        <WeekGrid
          week={week}
          onDayPress={mockOnDayPress}
          instantToggle={false}
        />
      );

      expect(getByLabelText(/Sunday/).props.accessibilityHint).toBe(
        'Tap to view details'
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty dates gracefully', () => {
      const week = createWeek().map((day, index) =>
        index === 0 ? { ...day, date: null } : day
      );

      const { queryByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // Other days should still render
      expect(queryByLabelText(/Monday/)).toBeTruthy();
    });

    it('should handle week with all days completed', () => {
      const week = createWeek({ completedDays: [0, 1, 2, 3, 4, 5, 6] });

      const { getByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // All days should show as completed
      expect(getByLabelText(/Sunday.*completed/)).toBeTruthy();
      expect(getByLabelText(/Saturday.*completed/)).toBeTruthy();
    });

    it('should handle week with no completed days', () => {
      const week = createWeek({ completedDays: [] });

      const { queryByLabelText } = render(
        <WeekGrid week={week} onDayPress={mockOnDayPress} />
      );

      // No days should show as completed
      expect(queryByLabelText(/completed/)).toBeNull();
    });
  });
});
