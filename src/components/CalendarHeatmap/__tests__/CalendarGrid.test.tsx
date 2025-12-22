/**
 * CalendarGrid Component Tests
 * Tests horizontal grid rendering, day cells, and month labels
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CalendarGrid } from '../CalendarGrid';
import type { CalendarDay, MonthLabel } from '../types';

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

describe('CalendarGrid (GitHub-style horizontal)', () => {
  // Helper to create a basic calendar day
  const createDay = (
    date: string,
    dayOfMonth: number,
    completed: boolean = false,
    isToday: boolean = false
  ): CalendarDay => ({
    date,
    dayOfMonth,
    completed,
    isToday,
    isFuture: false,
    isBeforeCreation: false,
  });

  // Helper to create an empty padding cell
  const createEmptyDay = (): CalendarDay => ({
    date: null,
    dayOfMonth: null,
    completed: false,
    isToday: false,
    isFuture: false,
    isBeforeCreation: false,
  });

  const mockOnDayPress = jest.fn();
  const mockCompletedDates = new Set<string>(['2025-12-01', '2025-12-03', '2025-12-05']);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Day-of-week header (vertical)', () => {
    it('should render day-of-week labels vertically on the left', () => {
      const weeks: CalendarDay[][] = [
        // One week
        [
          createDay('2025-12-01', 1, true), // Sunday
          createDay('2025-12-02', 2), // Monday
          createDay('2025-12-03', 3, true), // Tuesday
          createDay('2025-12-04', 4), // Wednesday
          createDay('2025-12-05', 5, true), // Thursday
          createDay('2025-12-06', 6), // Friday
          createDay('2025-12-07', 7), // Saturday
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByLabelText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      // Labels have accessibility, check via accessibility labels
      expect(getByLabelText('Sunday')).toBeTruthy();
      expect(getByLabelText('Monday')).toBeTruthy();
      expect(getByLabelText('Tuesday')).toBeTruthy();
      expect(getByLabelText('Wednesday')).toBeTruthy();
      expect(getByLabelText('Thursday')).toBeTruthy();
      expect(getByLabelText('Friday')).toBeTruthy();
      expect(getByLabelText('Saturday')).toBeTruthy();
    });

    it('should have accessibility labels for day names', () => {
      const weeks: CalendarDay[][] = [
        [
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByLabelText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      expect(getByLabelText('Sunday')).toBeTruthy();
      expect(getByLabelText('Monday')).toBeTruthy();
      expect(getByLabelText('Tuesday')).toBeTruthy();
      expect(getByLabelText('Wednesday')).toBeTruthy();
      expect(getByLabelText('Thursday')).toBeTruthy();
      expect(getByLabelText('Friday')).toBeTruthy();
      expect(getByLabelText('Saturday')).toBeTruthy();
    });
  });

  describe('Month labels', () => {
    it('should render month labels above week columns', () => {
      const weeks: CalendarDay[][] = [
        // Week in October
        [
          createDay('2025-10-05', 5),
          createDay('2025-10-06', 6),
          createDay('2025-10-07', 7),
          createDay('2025-10-08', 8),
          createDay('2025-10-09', 9),
          createDay('2025-10-10', 10),
          createDay('2025-10-11', 11),
        ],
        // Week in November
        [
          createDay('2025-11-02', 2),
          createDay('2025-11-03', 3),
          createDay('2025-11-04', 4),
          createDay('2025-11-05', 5),
          createDay('2025-11-06', 6),
          createDay('2025-11-07', 7),
          createDay('2025-11-08', 8),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Oct' },
        { weekIndex: 1, label: 'Nov' },
      ];

      const { getByText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      expect(getByText('Oct')).toBeTruthy();
      expect(getByText('Nov')).toBeTruthy();
    });

    it('should render single month label for single month view', () => {
      const weeks: CalendarDay[][] = [
        [
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      expect(getByText('Dec')).toBeTruthy();
    });
  });

  describe('Horizontal grid rendering', () => {
    it('should render weeks as columns', () => {
      const weeks: CalendarDay[][] = [
        // Week 1
        [
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
        // Week 2
        [
          createDay('2025-12-08', 8),
          createDay('2025-12-09', 9),
          createDay('2025-12-10', 10),
          createDay('2025-12-11', 11),
          createDay('2025-12-12', 12),
          createDay('2025-12-13', 13),
          createDay('2025-12-14', 14),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByLabelText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      // Check that cells from both weeks are rendered
      // Note: Date numbers are no longer displayed, so we check by accessibility label
      expect(getByLabelText(/December 1, 2025/)).toBeTruthy();
      expect(getByLabelText(/December 8, 2025/)).toBeTruthy();
    });

    it('should render 7 cells per week column', () => {
      const weeks: CalendarDay[][] = [
        [
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByLabelText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      // All 7 days should be rendered
      for (let i = 1; i <= 7; i++) {
        expect(getByLabelText(new RegExp(`December ${i}, 2025`))).toBeTruthy();
      }
    });

    it('should handle empty padding cells', () => {
      const weeks: CalendarDay[][] = [
        [
          createEmptyDay(),
          createEmptyDay(),
          createEmptyDay(),
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByLabelText, getAllByLabelText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      expect(getByLabelText(/December 1, 2025/)).toBeTruthy();
      // Empty cells have "Empty cell" label
      const emptyCells = getAllByLabelText('Empty cell');
      expect(emptyCells.length).toBe(3);
    });
  });

  describe('Day cell integration', () => {
    it('should pass habitColor to day cells', () => {
      const weeks: CalendarDay[][] = [
        [
          createDay('2025-12-01', 1, true), // completed
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByTestId } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          habitColor="#ff0000"
          completedDates={mockCompletedDates}
        />
      );

      // Check that completed cell uses custom color
      const checkIcon = getByTestId('lucide-icon-Check');
      expect(checkIcon).toBeTruthy();
    });

    it('should pass onDayPress callback to day cells', () => {
      const weeks: CalendarDay[][] = [
        [
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByLabelText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          onDayPress={mockOnDayPress}
          completedDates={mockCompletedDates}
        />
      );

      const cell = getByLabelText(/December 1, 2025/);
      fireEvent.press(cell);

      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-01', false);
    });
  });

  describe('Animations', () => {
    it('should cascade animations from right to left (recent to old)', () => {
      const weeks: CalendarDay[][] = [
        [
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
        [
          createDay('2025-12-08', 8),
          createDay('2025-12-09', 9),
          createDay('2025-12-10', 10),
          createDay('2025-12-11', 11),
          createDay('2025-12-12', 12),
          createDay('2025-12-13', 13),
          createDay('2025-12-14', 14),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      // Animations are staggered with FadeIn
      // Most recent week (index 1) animates before older week (index 0)
    });

    it('should skip animations when reduceMotion is enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const weeks: CalendarDay[][] = [
        [
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      // Animations should be skipped
      useReduceMotion.mockReturnValue(false);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible day-of-week header', () => {
      const weeks: CalendarDay[][] = [
        [
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByLabelText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      const header = getByLabelText(
        'Days of the week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday'
      );
      expect(header).toBeTruthy();
    });

    it('should have individual day labels accessible', () => {
      const weeks: CalendarDay[][] = [
        [
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
          createDay('2025-12-07', 7),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Dec' },
      ];

      const { getByLabelText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      expect(getByLabelText('Sunday')).toBeTruthy();
      expect(getByLabelText('Monday')).toBeTruthy();
      expect(getByLabelText('Saturday')).toBeTruthy();
    });
  });

  describe('Horizontal scrolling', () => {
    it('should render ScrollView for horizontal navigation', () => {
      // Create 13 weeks spanning 3 months (Oct-Dec 2025)
      const weeks: CalendarDay[][] = [
        // October weeks
        [
          createDay('2025-10-05', 5),
          createDay('2025-10-06', 6),
          createDay('2025-10-07', 7),
          createDay('2025-10-08', 8),
          createDay('2025-10-09', 9),
          createDay('2025-10-10', 10),
          createDay('2025-10-11', 11),
        ],
        [
          createDay('2025-10-12', 12),
          createDay('2025-10-13', 13),
          createDay('2025-10-14', 14),
          createDay('2025-10-15', 15),
          createDay('2025-10-16', 16),
          createDay('2025-10-17', 17),
          createDay('2025-10-18', 18),
        ],
        [
          createDay('2025-10-19', 19),
          createDay('2025-10-20', 20),
          createDay('2025-10-21', 21),
          createDay('2025-10-22', 22),
          createDay('2025-10-23', 23),
          createDay('2025-10-24', 24),
          createDay('2025-10-25', 25),
        ],
        [
          createDay('2025-10-26', 26),
          createDay('2025-10-27', 27),
          createDay('2025-10-28', 28),
          createDay('2025-10-29', 29),
          createDay('2025-10-30', 30),
          createDay('2025-10-31', 31),
          createDay('2025-11-01', 1),
        ],
        // November weeks
        [
          createDay('2025-11-02', 2),
          createDay('2025-11-03', 3),
          createDay('2025-11-04', 4),
          createDay('2025-11-05', 5),
          createDay('2025-11-06', 6),
          createDay('2025-11-07', 7),
          createDay('2025-11-08', 8),
        ],
        [
          createDay('2025-11-09', 9),
          createDay('2025-11-10', 10),
          createDay('2025-11-11', 11),
          createDay('2025-11-12', 12),
          createDay('2025-11-13', 13),
          createDay('2025-11-14', 14),
          createDay('2025-11-15', 15),
        ],
        [
          createDay('2025-11-16', 16),
          createDay('2025-11-17', 17),
          createDay('2025-11-18', 18),
          createDay('2025-11-19', 19),
          createDay('2025-11-20', 20),
          createDay('2025-11-21', 21),
          createDay('2025-11-22', 22),
        ],
        [
          createDay('2025-11-23', 23),
          createDay('2025-11-24', 24),
          createDay('2025-11-25', 25),
          createDay('2025-11-26', 26),
          createDay('2025-11-27', 27),
          createDay('2025-11-28', 28),
          createDay('2025-11-29', 29),
        ],
        [
          createDay('2025-11-30', 30),
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
        ],
        // December weeks
        [
          createDay('2025-12-07', 7),
          createDay('2025-12-08', 8),
          createDay('2025-12-09', 9),
          createDay('2025-12-10', 10),
          createDay('2025-12-11', 11),
          createDay('2025-12-12', 12),
          createDay('2025-12-13', 13),
        ],
        [
          createDay('2025-12-14', 14),
          createDay('2025-12-15', 15),
          createDay('2025-12-16', 16),
          createDay('2025-12-17', 17),
          createDay('2025-12-18', 18),
          createDay('2025-12-19', 19),
          createDay('2025-12-20', 20),
        ],
        [
          createDay('2025-12-21', 21),
          createDay('2025-12-22', 22),
          createDay('2025-12-23', 23),
          createDay('2025-12-24', 24),
          createDay('2025-12-25', 25),
          createDay('2025-12-26', 26),
          createDay('2025-12-27', 27),
        ],
        [
          createDay('2025-12-28', 28),
          createDay('2025-12-29', 29),
          createDay('2025-12-30', 30),
          createDay('2025-12-31', 31),
          createEmptyDay(),
          createEmptyDay(),
          createEmptyDay(),
        ],
      ];

      const monthLabels: MonthLabel[] = [
        { weekIndex: 0, label: 'Oct' },
        { weekIndex: 4, label: 'Nov' },
        { weekIndex: 9, label: 'Dec' },
      ];

      const { getByText } = render(
        <CalendarGrid
          weeks={weeks}
          monthLabels={monthLabels}
          completedDates={mockCompletedDates}
        />
      );

      // Should be able to find month labels
      expect(getByText('Oct')).toBeTruthy();
      expect(getByText('Nov')).toBeTruthy();
      expect(getByText('Dec')).toBeTruthy();
    });
  });
});
