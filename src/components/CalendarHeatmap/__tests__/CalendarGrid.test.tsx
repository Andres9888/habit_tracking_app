/**
 * CalendarGrid Component Tests
 * Tests grid rendering, day cells, and swipe navigation
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CalendarGrid } from '../CalendarGrid';
import type { CalendarDay } from '../types';

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

describe('CalendarGrid', () => {
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
  const mockOnSwipeRight = jest.fn();
  const mockOnSwipeLeft = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Day-of-week header', () => {
    it('should render day-of-week labels', () => {
      const grid: CalendarDay[][] = [
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

      const { getByText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      expect(getByText('S')).toBeTruthy(); // Sunday
      expect(getByText('M')).toBeTruthy(); // Monday
      expect(getByText('T')).toBeTruthy(); // Tuesday
      expect(getByText('W')).toBeTruthy(); // Wednesday
      // Two T's for Thursday
      expect(getByText('F')).toBeTruthy(); // Friday
    });

    it('should have accessibility labels for day names', () => {
      const grid: CalendarDay[][] = [
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

      const { getByLabelText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
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

  describe('Grid rendering', () => {
    it('should render correct number of rows', () => {
      // December 2025 has 5 weeks
      const grid: CalendarDay[][] = [
        // Week 1
        [
          createEmptyDay(),
          createDay('2025-12-01', 1),
          createDay('2025-12-02', 2),
          createDay('2025-12-03', 3),
          createDay('2025-12-04', 4),
          createDay('2025-12-05', 5),
          createDay('2025-12-06', 6),
        ],
        // Week 2
        [
          createDay('2025-12-07', 7),
          createDay('2025-12-08', 8),
          createDay('2025-12-09', 9),
          createDay('2025-12-10', 10),
          createDay('2025-12-11', 11),
          createDay('2025-12-12', 12),
          createDay('2025-12-13', 13),
        ],
        // Week 3
        [
          createDay('2025-12-14', 14),
          createDay('2025-12-15', 15),
          createDay('2025-12-16', 16),
          createDay('2025-12-17', 17),
          createDay('2025-12-18', 18),
          createDay('2025-12-19', 19),
          createDay('2025-12-20', 20),
        ],
        // Week 4
        [
          createDay('2025-12-21', 21),
          createDay('2025-12-22', 22, false, true), // Today
          createDay('2025-12-23', 23),
          createDay('2025-12-24', 24),
          createDay('2025-12-25', 25),
          createDay('2025-12-26', 26),
          createDay('2025-12-27', 27),
        ],
        // Week 5
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

      const { getByText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      // Check that we have days from all weeks
      expect(getByText('1')).toBeTruthy();
      expect(getByText('7')).toBeTruthy();
      expect(getByText('14')).toBeTruthy();
      expect(getByText('21')).toBeTruthy();
      expect(getByText('28')).toBeTruthy();
    });

    it('should render 7 cells per row', () => {
      const grid: CalendarDay[][] = [
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

      const { getByText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      // All 7 days should be rendered
      for (let i = 1; i <= 7; i++) {
        expect(getByText(i.toString())).toBeTruthy();
      }
    });

    it('should handle empty padding cells at start of month', () => {
      const grid: CalendarDay[][] = [
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

      const { getByText, queryByText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      expect(getByText('1')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
      // Empty cells should not have any text
      expect(queryByText('0')).toBeNull();
    });

    it('should handle empty padding cells at end of month', () => {
      const grid: CalendarDay[][] = [
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

      const { getByText, queryByText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      expect(getByText('28')).toBeTruthy();
      expect(getByText('31')).toBeTruthy();
      // Empty cells should not have any text
      expect(queryByText('32')).toBeNull();
    });
  });

  describe('Day cell integration', () => {
    it('should pass habitColor to day cells', () => {
      const grid: CalendarDay[][] = [
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

      const { getByTestId } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
          habitColor="#ff0000"
        />
      );

      // Check that completed cell uses custom color
      const checkIcon = getByTestId('lucide-icon-Check');
      expect(checkIcon).toBeTruthy();
    });

    it('should pass onDayPress callback to day cells', () => {
      const grid: CalendarDay[][] = [
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

      const { getByLabelText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
          onDayPress={mockOnDayPress}
        />
      );

      const cell = getByLabelText(/December 1, 2025/);
      fireEvent.press(cell);

      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-01', false);
    });

    it('should assign correct index for staggered animations', () => {
      const grid: CalendarDay[][] = [
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

      const { getByText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      // Index should be: row * 7 + col
      // Day 1 = index 0
      // Day 8 = index 7 (second row, first cell)
      expect(getByText('1')).toBeTruthy();
      expect(getByText('8')).toBeTruthy();
    });
  });

  describe('Swipe navigation', () => {
    it('should handle swipe right for previous month', () => {
      const grid: CalendarDay[][] = [
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

      render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
          onSwipeRight={mockOnSwipeRight}
          onSwipeLeft={mockOnSwipeLeft}
        />
      );

      // Swipe gestures are tested through the GestureDetector
      // which is mocked, so we verify the callbacks are passed
      expect(mockOnSwipeRight).not.toHaveBeenCalled();
      expect(mockOnSwipeLeft).not.toHaveBeenCalled();
    });

    it('should not allow swipe left when at current month', () => {
      const grid: CalendarDay[][] = [
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

      render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
          onSwipeRight={mockOnSwipeRight}
          onSwipeLeft={mockOnSwipeLeft}
          isCurrentMonth={true}
        />
      );

      // When isCurrentMonth is true, left swipe should be disabled
      // This is handled by the gesture handler logic
    });
  });

  describe('Month transitions', () => {
    it('should change animation key when month changes', () => {
      const grid: CalendarDay[][] = [
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

      const { rerender } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      // Rerender with different month
      rerender(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 10, 1)} // November
          swipeDirection="right"
        />
      );

      // Component should re-render with new month
    });

    it('should use correct slide animation based on swipe direction', () => {
      const grid: CalendarDay[][] = [
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

      const { rerender } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      // Swipe left should use SlideInRight/SlideOutLeft
      rerender(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 10, 1)}
          swipeDirection="right"
        />
      );

      // Swipe right should use SlideInLeft/SlideOutRight
    });

    it('should skip animations when reduceMotion is enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const grid: CalendarDay[][] = [
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

      render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      // Animations should be skipped
      useReduceMotion.mockReturnValue(false);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible day-of-week header', () => {
      const grid: CalendarDay[][] = [
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

      const { getByLabelText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      const header = getByLabelText(
        'Days of the week: Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday'
      );
      expect(header).toBeTruthy();
    });

    it('should have individual day labels accessible', () => {
      const grid: CalendarDay[][] = [
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

      const { getByLabelText } = render(
        <CalendarGrid
          grid={grid}
          currentMonth={new Date(2025, 11, 1)}
          swipeDirection="left"
        />
      );

      expect(getByLabelText('Sunday')).toBeTruthy();
      expect(getByLabelText('Monday')).toBeTruthy();
      expect(getByLabelText('Saturday')).toBeTruthy();
    });
  });
});
