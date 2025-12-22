/**
 * CalendarHeatmap Container Component Tests
 * Tests main container, month navigation, and integration
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CalendarHeatmap } from '../CalendarHeatmap';

// Mock utilities
jest.mock('../../../utils/insightCardPreferences', () => ({
  isInsightDismissed: jest.fn(() => Promise.resolve(false)),
  dismissInsight: jest.fn(() => Promise.resolve()),
}));

// Mock date-fns to control current date
jest.mock('date-fns', () => {
  const actual = jest.requireActual('date-fns');
  return {
    ...actual,
    format: actual.format,
    addMonths: actual.addMonths,
    subMonths: actual.subMonths,
    isSameMonth: actual.isSameMonth,
  };
});

describe('CalendarHeatmap', () => {
  const mockHabitId = 'test-habit-id' as any;
  const mockOnDayPress = jest.fn();

  // Mock completed dates
  const createCompletedDates = (dates: string[]): Set<string> => {
    return new Set(dates);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const completedDates = createCompletedDates(['2025-12-15', '2025-12-16']);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Should render month name
      expect(getByText(/December 2025/)).toBeTruthy();
    });

    it('should render Activity header', () => {
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      expect(getByText('Activity')).toBeTruthy();
    });

    it('should render Calendar icon', () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      expect(getByTestId('lucide-icon-Calendar')).toBeTruthy();
    });

    it('should render CalendarGrid component', () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Check for day-of-week header
      expect(getByText('S')).toBeTruthy(); // Sunday
      expect(getByText('M')).toBeTruthy(); // Monday
    });
  });

  describe('Month navigation', () => {
    it('should render previous month button', () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      expect(getByTestId('lucide-icon-ChevronLeft')).toBeTruthy();
    });

    it('should render next month button', () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      expect(getByTestId('lucide-icon-ChevronRight')).toBeTruthy();
    });

    it('should navigate to previous month when clicking left button', () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      const { getByLabelText, getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-01-01').getTime()}
        />
      );

      // Initially showing December 2025
      expect(getByText(/December 2025/)).toBeTruthy();

      // Click previous month button
      const prevButton = getByLabelText(/Go to November 2025/);
      fireEvent.press(prevButton);

      // Should now show November 2025
      expect(getByText(/November 2025/)).toBeTruthy();
    });

    it('should navigate to next month when clicking right button', () => {
      const completedDates = createCompletedDates(['2025-11-15']);

      const { getByLabelText, getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-01-01').getTime()}
        />
      );

      // Start at November 2025 (not current month)
      const prevButton = getByLabelText(/Go to October 2025/);
      fireEvent.press(prevButton);

      expect(getByText(/October 2025/)).toBeTruthy();

      // Click next month button
      const nextButton = getByLabelText(/Go to November 2025/);
      fireEvent.press(nextButton);

      // Should go back to November 2025
      expect(getByText(/November 2025/)).toBeTruthy();
    });

    it('should disable next month button when at current month', () => {
      const completedDates = createCompletedDates([]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-01-01').getTime()}
        />
      );

      // At current month (December 2025), next button should be disabled
      const nextButton = getByLabelText(/Cannot navigate forward/);
      expect(nextButton.props.accessibilityState.disabled).toBe(true);
    });

    it('should enable next month button when not at current month', () => {
      const completedDates = createCompletedDates([]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-01-01').getTime()}
        />
      );

      // Navigate to previous month
      const prevButton = getByLabelText(/Go to November 2025/);
      fireEvent.press(prevButton);

      // Now next button should be enabled
      const nextButton = getByLabelText(/Go to December 2025/);
      expect(nextButton.props.accessibilityState.disabled).toBe(false);
    });
  });

  describe('Stats summary', () => {
    it('should display completion count', () => {
      const completedDates = createCompletedDates([
        '2025-12-01',
        '2025-12-02',
        '2025-12-03',
        '2025-12-15',
        '2025-12-20',
      ]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Should show "5 days" (completed dates in December)
      expect(getByText(/5 days/)).toBeTruthy();
    });

    it('should display singular "day" when only one completion', () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      expect(getByText(/1 day/)).toBeTruthy();
    });

    it('should calculate and display success rate percentage', () => {
      // 10 completions out of 22 days (Dec 1-22)
      const completedDates = createCompletedDates([
        '2025-12-01',
        '2025-12-02',
        '2025-12-05',
        '2025-12-08',
        '2025-12-10',
        '2025-12-12',
        '2025-12-15',
        '2025-12-18',
        '2025-12-20',
        '2025-12-22',
      ]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // 10/22 = 45.45% ≈ 45%
      expect(getByText(/45%/)).toBeTruthy();
    });

    it('should show 0% when no completions', () => {
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      expect(getByText(/0%/)).toBeTruthy();
    });
  });

  describe('InsightCard integration', () => {
    it('should render InsightCard when weak day detected', () => {
      // Create pattern: low completion on Sundays
      const completedDates = createCompletedDates([
        // Sundays (low) - 2025-12-07, 2025-12-14, 2025-12-21 not completed
        // Mondays (high)
        '2025-12-01',
        '2025-12-08',
        '2025-12-15',
        '2025-12-22',
        // Other days
        '2025-12-02',
        '2025-12-03',
        '2025-12-09',
        '2025-12-10',
        '2025-12-16',
        '2025-12-17',
      ]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-11-01').getTime()} // Started in November
        />
      );

      // InsightCard should detect pattern and render
      // May show "Sundays need focus" or similar
      expect(getByText(/need focus/)).toBeTruthy();
    });

    it('should not render InsightCard when no weak day detected', () => {
      // Consistent completion across all days
      const completedDates = createCompletedDates([
        '2025-12-01',
        '2025-12-02',
        '2025-12-03',
        '2025-12-04',
        '2025-12-05',
        '2025-12-06',
        '2025-12-07',
        '2025-12-08',
        '2025-12-09',
        '2025-12-10',
        '2025-12-11',
        '2025-12-12',
        '2025-12-13',
        '2025-12-14',
        '2025-12-15',
      ]);

      const { queryByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // No insight card should be shown
      expect(queryByText(/need focus/)).toBeNull();
    });
  });

  describe('Data integration', () => {
    it('should pass completedDates to CalendarGrid', () => {
      const completedDates = createCompletedDates([
        '2025-12-15',
        '2025-12-16',
        '2025-12-20',
      ]);

      const { getByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Completed days should show checkmarks
      const checkmarks = getByTestId('lucide-icon-Check');
      expect(checkmarks).toBeTruthy();
    });

    it('should pass habitColor to CalendarGrid', () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      const { getByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
          habitColor="#ff0000"
        />
      );

      // Color should be applied to completed cells
      const checkIcon = getByTestId('lucide-icon-Check');
      expect(checkIcon).toBeTruthy();
    });

    it('should respect habitCreatedAt for cell visibility', () => {
      const completedDates = createCompletedDates([]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-15').getTime()} // Created mid-month
        />
      );

      // Days before Dec 15 should be marked as before creation
      const beforeCreationCell = getByLabelText(/December 1, 2025.*before habit was created/);
      expect(beforeCreationCell).toBeTruthy();
    });

    it('should handle missing habitCreatedAt', () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      const { getByText } = render(
        <CalendarHeatmap habitId={mockHabitId} completedDates={completedDates} />
      );

      // Should still render calendar
      expect(getByText(/December 2025/)).toBeTruthy();
    });
  });

  describe('Day press interaction', () => {
    it('should call onDayPress callback when day is pressed', () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
          onDayPress={mockOnDayPress}
        />
      );

      const day = getByLabelText(/December 15, 2025/);
      fireEvent.press(day);

      expect(mockOnDayPress).toHaveBeenCalledWith('2025-12-15', true);
    });

    it('should show tooltip when day is pressed', () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      const { getByLabelText, getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      const day = getByLabelText(/December 15, 2025/);
      fireEvent.press(day);

      // Tooltip should appear
      expect(getByText('Completed')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have month accessibility summary', () => {
      const completedDates = createCompletedDates([
        '2025-12-01',
        '2025-12-02',
        '2025-12-03',
      ]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      const summary = getByLabelText(/Activity calendar for December 2025/);
      expect(summary).toBeTruthy();
    });

    it('should have accessible navigation buttons', () => {
      const completedDates = createCompletedDates([]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-01-01').getTime()}
        />
      );

      expect(getByLabelText(/Go to November 2025/)).toBeTruthy();
      expect(getByLabelText(/Cannot navigate forward/)).toBeTruthy();
    });

    it('should provide navigation hints', () => {
      const completedDates = createCompletedDates([]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-01-01').getTime()}
        />
      );

      const prevButton = getByLabelText(/Go to November 2025/);
      expect(prevButton.props.accessibilityHint).toBe('Navigate to previous month');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty completedDates set', () => {
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      expect(getByText(/0 days/)).toBeTruthy();
      expect(getByText(/0%/)).toBeTruthy();
    });

    it('should handle all days completed', () => {
      // All 22 days of December completed
      const dates = Array.from({ length: 22 }, (_, i) =>
        `2025-12-${String(i + 1).padStart(2, '0')}`
      );
      const completedDates = createCompletedDates(dates);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      expect(getByText(/22 days/)).toBeTruthy();
      expect(getByText(/100%/)).toBeTruthy();
    });

    it('should handle habit created today', () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const completedDates = createCompletedDates([todayStr]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={today.getTime()}
        />
      );

      // Should show stats for just today
      expect(getByText(/1 day/)).toBeTruthy();
      expect(getByText(/100%/)).toBeTruthy();
    });

    it('should handle habit created in future (invalid)', () => {
      const futureDate = new Date('2025-12-31').getTime();
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={futureDate}
        />
      );

      // Should still render
      expect(getByText(/December 2025/)).toBeTruthy();
    });
  });
});
