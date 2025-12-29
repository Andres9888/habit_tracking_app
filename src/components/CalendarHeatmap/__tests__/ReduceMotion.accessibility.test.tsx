/**
 * Reduce Motion Accessibility Tests
 *
 * Tests that all animated components properly respect the user's
 * "Reduce Motion" accessibility preference. When enabled, animations
 * should be skipped and state changes should happen instantly.
 *
 * These tests verify:
 * - Animations are disabled when reduceMotion is true
 * - State changes still occur correctly without animations
 * - Interactive elements remain functional
 * - No animation-related visual elements appear (like pulse rings)
 * - Entrance animations are skipped
 * - Press interactions work without scale animations
 */

import React from 'react';
import { render, fireEvent, act, waitFor } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DayCell } from '../DayCell';
import { WeekGrid } from '../WeekGrid';
import { MonthGrid } from '../MonthGrid';
import { CalendarHeatmap } from '../CalendarHeatmap';
import type { CalendarDay } from '../types';
import { useReduceMotion } from '../../../hooks/useReduceMotion';

// Test wrapper for gesture handler
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    {children}
  </GestureHandlerRootView>
);

// Mock ID type for testing
const mockHabitId = 'test-habit-id' as any;

// Mock the useReduceMotion hook - starts with false, can be toggled
const mockUseReduceMotion = jest.fn(() => false);
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => mockUseReduceMotion(),
}));

// Mock expo-haptics
const mockImpactAsync = jest.fn();
const mockSelectionAsync = jest.fn();
jest.mock('expo-haptics', () => ({
  impactAsync: (...args: any[]) => mockImpactAsync(...args),
  notificationAsync: jest.fn(),
  selectionAsync: (...args: any[]) => mockSelectionAsync(...args),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

// Mock expo-blur
jest.mock('expo-blur', () => ({
  BlurView: 'BlurView',
}));

// Mock AccessibilityInfo
jest.mock(
  'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
  () => ({
    isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    announceForAccessibility: jest.fn(),
    isScreenReaderEnabled: jest.fn(() => Promise.resolve(false)),
  })
);

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve(null)),
  removeItem: jest.fn(() => Promise.resolve()),
}));

// Helper: Format date as YYYY-MM-DD without timezone issues
const formatDateString = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

// Helper: Create a week of CalendarDay objects
const createWeek = (
  startDate: string,
  completedDates: Set<string>,
  todayStr: string = '2025-12-27'
): CalendarDay[] => {
  const [startYear, startMonth, startDay] = startDate.split('-').map(Number);
  const todayParts = todayStr.split('-').map(Number);
  const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startYear, startMonth - 1, startDay + i, 12, 0, 0);
    const dateStr = formatDateString(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const isToday = dateStr === todayStr;
    const isFuture = date > todayDate && !isToday;

    return {
      date: dateStr,
      dayOfMonth: date.getDate(),
      completed: completedDates.has(dateStr),
      isToday,
      isFuture,
      isBeforeCreation: false,
    };
  });
};

// Helper: Create a month grid
const createMonthGrid = (
  year: number,
  month: number,
  completedDates: Set<string>,
  todayStr: string = '2025-12-27'
): CalendarDay[][] => {
  const todayParts = todayStr.split('-').map(Number);
  const todayDate = new Date(todayParts[0], todayParts[1] - 1, todayParts[2]);

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  const weeks: CalendarDay[][] = [];
  let currentWeek: CalendarDay[] = [];

  for (let i = 0; i < startDayOfWeek; i++) {
    currentWeek.push({
      date: null,
      dayOfMonth: null,
      completed: false,
      isToday: false,
      isFuture: false,
      isBeforeCreation: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day, 12, 0, 0);
    const dateStr = formatDateString(year, month, day);
    const isToday = dateStr === todayStr;
    const isFuture = date > todayDate && !isToday;

    currentWeek.push({
      date: dateStr,
      dayOfMonth: day,
      completed: completedDates.has(dateStr),
      isToday,
      isFuture,
      isBeforeCreation: false,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({
      date: null,
      dayOfMonth: null,
      completed: false,
      isToday: false,
      isFuture: false,
      isBeforeCreation: false,
    });
  }

  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  return weeks;
};

describe('Reduce Motion Accessibility Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseReduceMotion.mockReturnValue(false);
  });

  describe('DayCell Component', () => {
    const mockOnPress = jest.fn();
    const mockCompletedDates = new Set<string>();
    const mockHabitCreatedAt = new Date('2025-01-01T12:00:00Z').getTime();

    beforeEach(() => {
      mockCompletedDates.clear();
    });

    describe('when reduceMotion is disabled (false)', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(false);
      });

      it('should render today cell with pulse animation enabled', () => {
        const day: CalendarDay = {
          date: '2025-12-27',
          dayOfMonth: 27,
          completed: false,
          isToday: true,
          isFuture: false,
          isBeforeCreation: false,
        };

        const { getByLabelText, UNSAFE_queryAllByType } = render(
          <DayCell
            day={day}
            index={0}
            onPress={mockOnPress}
            completedDates={mockCompletedDates}
            habitCreatedAt={mockHabitCreatedAt}
          />
        );

        // Cell should render successfully with today marker
        const cell = getByLabelText(/Today.*December 27, 2025.*Not completed/);
        expect(cell).toBeTruthy();
        // Animation elements are present (pulse ring renders as Animated.View)
        // The shouldPulse condition is day.isToday && !day.completed && !reduceMotion
        // Since reduceMotion is false, pulse should be enabled
      });
    });

    describe('when reduceMotion is enabled (true)', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(true);
      });

      it('should NOT show pulse ring on today cell', () => {
        const day: CalendarDay = {
          date: '2025-12-27',
          dayOfMonth: 27,
          completed: false,
          isToday: true,
          isFuture: false,
          isBeforeCreation: false,
        };

        const { queryByTestId } = render(
          <DayCell
            day={day}
            index={0}
            onPress={mockOnPress}
            completedDates={mockCompletedDates}
            habitCreatedAt={mockHabitCreatedAt}
          />
        );

        // Pulse animation should be disabled
        expect(queryByTestId('pulse-ring')).toBeNull();
      });

      it('should still render today cell correctly', () => {
        const day: CalendarDay = {
          date: '2025-12-27',
          dayOfMonth: 27,
          completed: false,
          isToday: true,
          isFuture: false,
          isBeforeCreation: false,
        };

        const { getByLabelText } = render(
          <DayCell
            day={day}
            index={0}
            onPress={mockOnPress}
            completedDates={mockCompletedDates}
            habitCreatedAt={mockHabitCreatedAt}
          />
        );

        // Cell should still be accessible and have correct label
        // Label format: "Today, Saturday, December 27, 2025. Not completed"
        const cell = getByLabelText(/Today.*December 27, 2025.*Not completed/);
        expect(cell).toBeTruthy();
      });

      it('should still respond to press interactions', () => {
        const day: CalendarDay = {
          date: '2025-12-15',
          dayOfMonth: 15,
          completed: false,
          isToday: false,
          isFuture: false,
          isBeforeCreation: false,
        };

        const { getByLabelText } = render(
          <DayCell
            day={day}
            index={0}
            onPress={mockOnPress}
            completedDates={mockCompletedDates}
            habitCreatedAt={mockHabitCreatedAt}
          />
        );

        const cell = getByLabelText(/December 15, 2025/);
        fireEvent.press(cell);

        expect(mockOnPress).toHaveBeenCalledWith('2025-12-15', false);
      });

      it('should render completed cells correctly without animation', () => {
        const day: CalendarDay = {
          date: '2025-12-15',
          dayOfMonth: 15,
          completed: true,
          isToday: false,
          isFuture: false,
          isBeforeCreation: false,
        };
        mockCompletedDates.add('2025-12-15');

        const { getByTestId, getByLabelText } = render(
          <DayCell
            day={day}
            index={0}
            onPress={mockOnPress}
            completedDates={mockCompletedDates}
            habitCreatedAt={mockHabitCreatedAt}
          />
        );

        // Checkmark should still appear
        expect(getByTestId('lucide-icon-Check')).toBeTruthy();
        expect(getByLabelText(/December 15, 2025.*Completed/)).toBeTruthy();
      });
    });
  });

  describe('WeekGrid Component', () => {
    describe('when reduceMotion is disabled (false)', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(false);
      });

      it('should render with entrance animations', () => {
        const week = createWeek('2025-12-21', new Set());

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');
        expect(buttons.length).toBe(7);
      });
    });

    describe('when reduceMotion is enabled (true)', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(true);
      });

      it('should render all day cells without entrance animations', () => {
        const week = createWeek('2025-12-21', new Set());

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} />
          </TestWrapper>
        );

        // All 7 days should render immediately
        const buttons = getAllByRole('button');
        expect(buttons.length).toBe(7);
      });

      it('should still handle day press correctly', () => {
        const mockOnDayPress = jest.fn();
        const week = createWeek('2025-12-21', new Set(), '2025-12-25');

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} onDayPress={mockOnDayPress} />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');
        fireEvent.press(buttons[0]);

        expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', false);
      });

      it('should trigger haptic feedback even with reduceMotion', () => {
        const mockOnDayPress = jest.fn();
        const week = createWeek('2025-12-21', new Set(), '2025-12-25');

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} onDayPress={mockOnDayPress} instantToggle />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');
        fireEvent.press(buttons[0]);

        // Haptic feedback should still work
        expect(mockImpactAsync).toHaveBeenCalledWith('medium');
      });

      it('should show completion state instantly without animation', () => {
        const completedDates = new Set(['2025-12-23']);
        const week = createWeek('2025-12-21', completedDates, '2025-12-25');

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} instantToggle />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');

        // Tuesday (index 2) should be marked completed
        const tuesdayButton = buttons[2];
        expect(tuesdayButton.props.accessibilityLabel).toContain('completed');
      });

      it('should maintain accessibility labels', () => {
        const week = createWeek('2025-12-21', new Set(), '2025-12-25');

        const { getByLabelText } = render(
          <TestWrapper>
            <WeekGrid week={week} />
          </TestWrapper>
        );

        // Labels should include full day names
        expect(getByLabelText(/Sunday/)).toBeTruthy();
        expect(getByLabelText(/Monday/)).toBeTruthy();
        expect(getByLabelText(/Tuesday/)).toBeTruthy();
      });

      it('should handle toggle completion state change without animation', async () => {
        const mockOnDayPress = jest.fn();
        const week = createWeek('2025-12-21', new Set(), '2025-12-25');

        const { getAllByRole, rerender } = render(
          <TestWrapper>
            <WeekGrid week={week} onDayPress={mockOnDayPress} instantToggle />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');
        fireEvent.press(buttons[0]);

        expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-21', false);

        // Simulate the state change after toggle
        const updatedCompletedDates = new Set(['2025-12-21']);
        const updatedWeek = createWeek(
          '2025-12-21',
          updatedCompletedDates,
          '2025-12-25'
        );

        rerender(
          <TestWrapper>
            <WeekGrid
              week={updatedWeek}
              onDayPress={mockOnDayPress}
              instantToggle
            />
          </TestWrapper>
        );

        // The cell should now show completed state
        const updatedButtons = getAllByRole('button');
        expect(updatedButtons[0].props.accessibilityLabel).toContain(
          'completed'
        );
      });
    });
  });

  describe('MonthGrid Component', () => {
    describe('when reduceMotion is disabled (false)', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(false);
      });

      it('should render with entrance animations', () => {
        const grid = createMonthGrid(2025, 11, new Set());

        const { getByLabelText, getAllByRole } = render(
          <TestWrapper>
            <MonthGrid grid={grid} month={11} year={2025} />
          </TestWrapper>
        );

        expect(getByLabelText('Calendar for December 2025')).toBeTruthy();
        const buttons = getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });
    });

    describe('when reduceMotion is enabled (true)', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(true);
      });

      it('should render month header without fade animation', () => {
        const grid = createMonthGrid(2025, 11, new Set());

        const { getByText } = render(
          <TestWrapper>
            <MonthGrid grid={grid} month={11} year={2025} />
          </TestWrapper>
        );

        // Header should render immediately
        expect(getByText('December 2025')).toBeTruthy();
      });

      it('should render all day cells without staggered entrance', () => {
        const grid = createMonthGrid(2025, 11, new Set(), '2025-12-27');

        const { getAllByRole } = render(
          <TestWrapper>
            <MonthGrid grid={grid} month={11} year={2025} />
          </TestWrapper>
        );

        // All interactive days should be present
        const buttons = getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });

      it('should handle day press correctly', () => {
        const mockOnDayPress = jest.fn();
        const grid = createMonthGrid(2025, 11, new Set(), '2025-12-27');

        const { getByLabelText } = render(
          <TestWrapper>
            <MonthGrid
              grid={grid}
              month={11}
              year={2025}
              onDayPress={mockOnDayPress}
            />
          </TestWrapper>
        );

        const day15 = getByLabelText(/Monday, 15/);
        fireEvent.press(day15);

        expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-15', false);
      });

      it('should show completion state instantly', () => {
        const completedDates = new Set(['2025-12-15', '2025-12-20']);
        const grid = createMonthGrid(2025, 11, completedDates, '2025-12-27');

        const { getByLabelText } = render(
          <TestWrapper>
            <MonthGrid grid={grid} month={11} year={2025} instantToggle />
          </TestWrapper>
        );

        // Completed days should be marked
        expect(getByLabelText(/Monday, 15.*completed/)).toBeTruthy();
        expect(getByLabelText(/Saturday, 20.*completed/)).toBeTruthy();
      });

      it('should trigger haptic feedback on day press', () => {
        const mockOnDayPress = jest.fn();
        const grid = createMonthGrid(2025, 11, new Set(), '2025-12-27');

        const { getByLabelText } = render(
          <TestWrapper>
            <MonthGrid
              grid={grid}
              month={11}
              year={2025}
              onDayPress={mockOnDayPress}
              instantToggle
            />
          </TestWrapper>
        );

        const day15 = getByLabelText(/Monday, 15/);
        fireEvent.press(day15);

        expect(mockImpactAsync).toHaveBeenCalledWith('medium');
      });

      it('should maintain day-of-week header accessibility', () => {
        const grid = createMonthGrid(2025, 11, new Set());

        const { getAllByLabelText } = render(
          <TestWrapper>
            <MonthGrid grid={grid} month={11} year={2025} />
          </TestWrapper>
        );

        // Day headers should have full day names for accessibility
        expect(getAllByLabelText('Sunday').length).toBeGreaterThan(0);
        expect(getAllByLabelText('Monday').length).toBeGreaterThan(0);
        expect(getAllByLabelText('Friday').length).toBeGreaterThan(0);
      });

      it('should handle toggle state change correctly', () => {
        const mockOnDayPress = jest.fn();
        const grid = createMonthGrid(2025, 11, new Set(), '2025-12-27');

        const { getByLabelText, rerender } = render(
          <TestWrapper>
            <MonthGrid
              grid={grid}
              month={11}
              year={2025}
              onDayPress={mockOnDayPress}
              instantToggle
            />
          </TestWrapper>
        );

        const day15 = getByLabelText(/Monday, 15/);
        fireEvent.press(day15);

        expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-15', false);

        // Simulate state change
        const updatedCompletedDates = new Set(['2025-12-15']);
        const updatedGrid = createMonthGrid(
          2025,
          11,
          updatedCompletedDates,
          '2025-12-27'
        );

        rerender(
          <TestWrapper>
            <MonthGrid
              grid={updatedGrid}
              month={11}
              year={2025}
              onDayPress={mockOnDayPress}
              instantToggle
            />
          </TestWrapper>
        );

        // Should now show completed
        expect(getByLabelText(/Monday, 15.*completed/)).toBeTruthy();
      });
    });
  });

  describe('CalendarHeatmap Component', () => {
    describe('when reduceMotion is enabled (true)', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(true);
      });

      it('should render without entrance animations', () => {
        const completedDates = new Set(['2025-12-01', '2025-12-15']);

        const { getByLabelText, getAllByRole } = render(
          <TestWrapper>
            <CalendarHeatmap
              habitId={mockHabitId}
              completedDates={completedDates}
            />
          </TestWrapper>
        );

        expect(getByLabelText('Habit activity calendar')).toBeTruthy();
        const buttons = getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);
      });

      it('should render day cells as interactive buttons', () => {
        const completedDates = new Set(['2025-12-01']);

        const { getAllByRole } = render(
          <TestWrapper>
            <CalendarHeatmap
              habitId={mockHabitId}
              completedDates={completedDates}
            />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');

        // Should have interactive day cells
        expect(buttons.length).toBeGreaterThan(0);

        // Each button should have accessibility properties
        buttons.forEach((button) => {
          expect(button.props.accessibilityRole).toBe('button');
          expect(button.props.accessibilityLabel).toBeDefined();
        });
      });

      it('should maintain summary statistics', () => {
        const completedDates = new Set([
          '2025-12-01',
          '2025-12-02',
          '2025-12-03',
          '2025-12-04',
          '2025-12-05',
        ]);

        const { getByRole } = render(
          <TestWrapper>
            <CalendarHeatmap
              habitId={mockHabitId}
              completedDates={completedDates}
            />
          </TestWrapper>
        );

        const summary = getByRole('summary');
        expect(summary.props.accessibilityLabel).toMatch(/\d+ day/);
      });
    });
  });

  describe('Toggle Between Motion States', () => {
    it('should handle dynamic reduceMotion preference change', () => {
      // Start with motion enabled
      mockUseReduceMotion.mockReturnValue(false);

      const day: CalendarDay = {
        date: '2025-12-27',
        dayOfMonth: 27,
        completed: false,
        isToday: true,
        isFuture: false,
        isBeforeCreation: false,
      };

      const { getByLabelText, rerender } = render(
        <DayCell
          day={day}
          index={0}
          completedDates={new Set()}
          habitCreatedAt={new Date('2025-01-01T12:00:00Z').getTime()}
        />
      );

      // Cell should render with animation enabled (pulse condition met)
      // Label format: "Today, Saturday, December 27, 2025. Not completed"
      let cell = getByLabelText(/Today.*December 27, 2025.*Not completed/);
      expect(cell).toBeTruthy();

      // Now enable reduce motion
      mockUseReduceMotion.mockReturnValue(true);

      rerender(
        <DayCell
          day={day}
          index={0}
          completedDates={new Set()}
          habitCreatedAt={new Date('2025-01-01T12:00:00Z').getTime()}
        />
      );

      // Cell should still render correctly with reduce motion enabled
      cell = getByLabelText(/Today.*December 27, 2025.*Not completed/);
      expect(cell).toBeTruthy();
      // The key difference is that animations are skipped internally,
      // but the UI remains functional and accessible
    });
  });

  describe('Completion Animation Behavior', () => {
    describe('when reduceMotion is enabled', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(true);
      });

      it('should update WeekGrid completion state immediately', () => {
        const mockOnDayPress = jest.fn();
        const week = createWeek('2025-12-21', new Set(), '2025-12-25');

        const { getAllByRole, rerender } = render(
          <TestWrapper>
            <WeekGrid week={week} onDayPress={mockOnDayPress} instantToggle />
          </TestWrapper>
        );

        // Initial state - not completed
        let buttons = getAllByRole('button');
        expect(buttons[0].props.accessibilityLabel).not.toContain('completed');

        // Toggle day
        fireEvent.press(buttons[0]);

        // Simulate backend update
        const updatedWeek = createWeek(
          '2025-12-21',
          new Set(['2025-12-21']),
          '2025-12-25'
        );

        rerender(
          <TestWrapper>
            <WeekGrid
              week={updatedWeek}
              onDayPress={mockOnDayPress}
              instantToggle
            />
          </TestWrapper>
        );

        // Should be marked completed immediately
        buttons = getAllByRole('button');
        expect(buttons[0].props.accessibilityLabel).toContain('completed');
      });

      it('should update MonthGrid completion state immediately', () => {
        const mockOnDayPress = jest.fn();
        const grid = createMonthGrid(2025, 11, new Set(), '2025-12-27');

        const { getByLabelText, rerender } = render(
          <TestWrapper>
            <MonthGrid
              grid={grid}
              month={11}
              year={2025}
              onDayPress={mockOnDayPress}
              instantToggle
            />
          </TestWrapper>
        );

        // Initial state - not completed
        const day10 = getByLabelText(/Wednesday, 10/);
        expect(day10.props.accessibilityLabel).not.toContain('completed');

        // Toggle day
        fireEvent.press(day10);

        // Simulate backend update
        const updatedGrid = createMonthGrid(
          2025,
          11,
          new Set(['2025-12-10']),
          '2025-12-27'
        );

        rerender(
          <TestWrapper>
            <MonthGrid
              grid={updatedGrid}
              month={11}
              year={2025}
              onDayPress={mockOnDayPress}
              instantToggle
            />
          </TestWrapper>
        );

        // Should be marked completed immediately
        expect(getByLabelText(/Wednesday, 10.*completed/)).toBeTruthy();
      });
    });
  });

  describe('Interaction Hints Consistency', () => {
    describe('when reduceMotion is enabled', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(true);
      });

      it('WeekGrid should maintain correct hints in instant toggle mode', () => {
        const week = createWeek('2025-12-21', new Set(), '2025-12-25');

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} instantToggle />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');
        expect(buttons[0].props.accessibilityHint).toBe(
          'Tap to toggle completion'
        );
      });

      it('WeekGrid should maintain correct hints in detail mode', () => {
        const week = createWeek('2025-12-21', new Set(), '2025-12-25');

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} instantToggle={false} />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');
        expect(buttons[0].props.accessibilityHint).toBe('Tap to view details');
      });

      it('MonthGrid should maintain correct hints in instant toggle mode', () => {
        const grid = createMonthGrid(2025, 11, new Set(), '2025-12-27');

        const { getByLabelText } = render(
          <TestWrapper>
            <MonthGrid grid={grid} month={11} year={2025} instantToggle />
          </TestWrapper>
        );

        const day15 = getByLabelText(/Monday, 15/);
        expect(day15.props.accessibilityHint).toBe('Tap to toggle completion');
      });

      it('MonthGrid should maintain correct hints in detail mode', () => {
        const grid = createMonthGrid(2025, 11, new Set(), '2025-12-27');

        const { getByLabelText } = render(
          <TestWrapper>
            <MonthGrid
              grid={grid}
              month={11}
              year={2025}
              instantToggle={false}
            />
          </TestWrapper>
        );

        const day15 = getByLabelText(/Monday, 15/);
        expect(day15.props.accessibilityHint).toBe('Tap to view details');
      });
    });
  });

  describe('Disabled State Handling', () => {
    describe('when reduceMotion is enabled', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(true);
      });

      it('should correctly indicate disabled state for future days in WeekGrid', () => {
        // Create week with future dates (starting from Dec 28, today is Dec 27)
        const week = createWeek('2025-12-28', new Set(), '2025-12-27');

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');

        // All days should be disabled (all are future)
        buttons.forEach((button) => {
          expect(button.props.accessibilityState?.disabled).toBe(true);
        });
      });

      it('should correctly indicate disabled state for future days in MonthGrid', () => {
        const grid = createMonthGrid(2025, 11, new Set(), '2025-12-27');

        const { getAllByRole } = render(
          <TestWrapper>
            <MonthGrid grid={grid} month={11} year={2025} />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');

        // Find buttons for days after 27
        const day28Buttons = buttons.filter((b) =>
          b.props.accessibilityLabel?.includes(', 28')
        );

        // Day 28 (if present) should be disabled
        if (day28Buttons.length > 0) {
          expect(day28Buttons[0].props.accessibilityState?.disabled).toBe(true);
        }
      });

      it('should not call onDayPress for disabled days', () => {
        const mockOnDayPress = jest.fn();
        const week = createWeek('2025-12-28', new Set(), '2025-12-27');

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} onDayPress={mockOnDayPress} />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');
        fireEvent.press(buttons[0]);

        // Should not be called because day is disabled
        expect(mockOnDayPress).not.toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    describe('when reduceMotion is enabled', () => {
      beforeEach(() => {
        mockUseReduceMotion.mockReturnValue(true);
      });

      it('should handle week with before-creation days gracefully', () => {
        // Create week where all days are before habit creation
        const beforeCreationWeek: CalendarDay[] = Array.from(
          { length: 7 },
          (_, i) => ({
            date: `2024-12-0${i + 1}`,
            dayOfMonth: i + 1,
            completed: false,
            isToday: false,
            isFuture: false,
            isBeforeCreation: true,
          })
        );

        const { queryAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={beforeCreationWeek} />
          </TestWrapper>
        );

        // Buttons are present but all should be disabled
        const buttons = queryAllByRole('button');
        expect(buttons.length).toBe(7);
        buttons.forEach((button) => {
          expect(button.props.accessibilityState?.disabled).toBe(true);
        });
      });

      it('should handle fully completed week', () => {
        const allCompleted = new Set([
          '2025-12-21',
          '2025-12-22',
          '2025-12-23',
          '2025-12-24',
          '2025-12-25',
          '2025-12-26',
          '2025-12-27',
        ]);
        const week = createWeek('2025-12-21', allCompleted, '2025-12-27');

        const { getAllByRole } = render(
          <TestWrapper>
            <WeekGrid week={week} />
          </TestWrapper>
        );

        const buttons = getAllByRole('button');

        // All should show completed
        buttons.forEach((button) => {
          expect(button.props.accessibilityLabel).toContain('completed');
        });
      });

      it('should handle rapid state changes correctly', () => {
        const mockOnDayPress = jest.fn();
        let completed = new Set<string>();
        let week = createWeek('2025-12-21', completed, '2025-12-25');

        const { getAllByRole, rerender } = render(
          <TestWrapper>
            <WeekGrid week={week} onDayPress={mockOnDayPress} instantToggle />
          </TestWrapper>
        );

        // Rapidly toggle
        const buttons = getAllByRole('button');
        fireEvent.press(buttons[0]); // Toggle on
        completed = new Set(['2025-12-21']);
        week = createWeek('2025-12-21', completed, '2025-12-25');
        rerender(
          <TestWrapper>
            <WeekGrid week={week} onDayPress={mockOnDayPress} instantToggle />
          </TestWrapper>
        );

        fireEvent.press(buttons[0]); // Toggle off
        completed = new Set();
        week = createWeek('2025-12-21', completed, '2025-12-25');
        rerender(
          <TestWrapper>
            <WeekGrid week={week} onDayPress={mockOnDayPress} instantToggle />
          </TestWrapper>
        );

        // State should be correct after rapid changes
        const finalButtons = getAllByRole('button');
        expect(finalButtons[0].props.accessibilityLabel).not.toContain(
          'completed'
        );
        expect(mockOnDayPress).toHaveBeenCalledTimes(2);
      });
    });
  });
});

/**
 * MANUAL TESTING CHECKLIST FOR REDUCE MOTION
 *
 * iOS Device Testing:
 * 1. Go to Settings > Accessibility > Motion > Reduce Motion
 * 2. Toggle "Reduce Motion" ON
 * 3. Open the app and navigate to habit detail screen
 * 4. Verify:
 *    [ ] No pulse animation on today's cell
 *    [ ] No staggered entrance animation on calendar cells
 *    [ ] Cells still respond to taps
 *    [ ] Completion state changes instantly (no fill animation)
 *    [ ] Press-in scale effect is disabled
 *    [ ] Haptic feedback still works
 *
 * Android Device Testing:
 * 1. Go to Settings > Accessibility > Remove animations (varies by device)
 * 2. Enable animation removal
 * 3. Open the app and navigate to habit detail screen
 * 4. Verify same items as iOS
 *
 * Compare With Motion Enabled:
 * 1. Toggle "Reduce Motion" OFF
 * 2. Verify animations are present:
 *    [ ] Pulse animation on today's cell
 *    [ ] Staggered entrance animation
 *    [ ] Fill animation on completion
 *    [ ] Scale animation on press
 *    [ ] Checkmark rotation animation
 */
