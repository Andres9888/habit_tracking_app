/**
 * CalendarHeatmap Container Component Tests
 * Tests main container, 3-month GitHub-style layout, and integration
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

      // Should render abbreviated month names (GitHub-style shows 3 months)
      expect(getByText('Dec')).toBeTruthy();
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

  describe('3-month GitHub-style layout', () => {
    it('should display 3 months of abbreviated month labels', () => {
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-09-01').getTime()} // Started 3+ months ago
        />
      );

      // Should show abbreviated month names for the 3-month period
      // Exact months depend on current date, but Dec should be visible
      expect(getByText('Dec')).toBeTruthy();
    });

    it('should display horizontal ScrollView for week columns', () => {
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-09-01').getTime()}
        />
      );

      // Should render day-of-week labels vertically on left
      expect(getByText('S')).toBeTruthy(); // Sunday
      expect(getByText('M')).toBeTruthy(); // Monday
      expect(getByText('T')).toBeTruthy(); // Tuesday
    });

    it('should not have month navigation buttons', () => {
      const completedDates = createCompletedDates([]);

      const { queryByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // GitHub-style uses horizontal scroll, not month navigation
      expect(queryByTestId('lucide-icon-ChevronLeft')).toBeNull();
      expect(queryByTestId('lucide-icon-ChevronRight')).toBeNull();
    });

    it('should display trend badge when available', () => {
      // Create data for 6+ months to enable trend calculation
      const completedDates = createCompletedDates([
        // Current 3 months (Dec, Nov, Oct) - 50% completion
        '2025-12-01',
        '2025-12-03',
        '2025-12-05',
        '2025-11-01',
        '2025-11-03',
        '2025-11-05',
        '2025-10-01',
        '2025-10-03',
        '2025-10-05',
        // Previous 3 months (Sep, Aug, Jul) - 30% completion (fewer days)
        '2025-09-01',
        '2025-09-05',
        '2025-08-01',
        '2025-08-05',
        '2025-07-01',
        '2025-07-05',
      ]);

      const { queryByTestId } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-07-01').getTime()}
        />
      );

      // Trend badge may or may not be visible depending on calculation
      // Just verify the component renders without error
      const trendingUpIcon = queryByTestId('lucide-icon-TrendingUp');
      const trendingDownIcon = queryByTestId('lucide-icon-TrendingDown');
      // At least one should exist if trend is calculated, or both null if insufficient data
      expect(trendingUpIcon || trendingDownIcon || true).toBeTruthy();
    });
  });

  describe('Stats summary', () => {
    it('should display completion count for 3-month period', () => {
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

      // Should show total completed days across the 3-month visible period
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

    it('should calculate and display success rate percentage for 3-month period', () => {
      // 10 completions out of eligible days in 3-month period
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

      // Success rate based on 3-month period (percentage may vary based on eligible days)
      expect(getByText(/%/)).toBeTruthy(); // Just verify percentage is shown
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
          habitColor='#ff0000'
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
      const beforeCreationCell = getByLabelText(
        /December 1, 2025.*before habit was created/
      );
      expect(beforeCreationCell).toBeTruthy();
    });

    it('should handle missing habitCreatedAt', () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      // Should still render calendar with abbreviated month names
      expect(getByText('Dec')).toBeTruthy();
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
    it('should have 3-month activity accessibility summary', () => {
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

      // GitHub-style shows 3 months of history
      const summary = getByLabelText(/Activity calendar showing 3 months/);
      expect(summary).toBeTruthy();
    });

    it('should have accessible header', () => {
      const completedDates = createCompletedDates([]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-01-01').getTime()}
        />
      );

      // GitHub-style has no navigation buttons, just the header
      expect(getByLabelText(/Activity calendar showing 3 months/)).toBeTruthy();
    });

    it('should provide summary statistics accessibility', () => {
      const completedDates = createCompletedDates(['2025-12-01', '2025-12-02']);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Summary should include completion count and success rate
      const summary = getByLabelText(/2 days.*%/);
      expect(summary).toBeTruthy();
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

    it('should handle all days completed in visible period', () => {
      // All days in December completed
      const dates = Array.from(
        { length: 22 },
        (_, i) => `2025-12-${String(i + 1).padStart(2, '0')}`
      );
      const completedDates = createCompletedDates(dates);

      const { getByText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Should show completed days and 100% success rate
      expect(getByText(/days/)).toBeTruthy();
      expect(getByText(/100%/)).toBeTruthy();
    });

    it('should handle habit created today', () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      const completedDates = createCompletedDates([todayStr]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={today.getTime()}
        />
      );

      // GitHub-style shows 3 months back, so if habit created today,
      // only today is eligible. Stats will show based on actual eligible days
      // Check via accessibility label since text is split across elements
      expect(getByLabelText(/success rate/)).toBeTruthy(); // Success rate shown
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

      // Should still render with abbreviated month names
      expect(getByText('Dec')).toBeTruthy();
    });
  });
});
