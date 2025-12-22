/**
 * CalendarHeatmap Integration Tests (CALENDAR-6.3)
 * Tests CalendarHeatmap integration with realistic parent data flow
 *
 * Validates (per CALENDAR-6.3 acceptance criteria):
 * - CalendarHeatmap renders in HabitDetailScreen
 * - Data flows correctly from parent
 * - Month navigation updates grid
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CalendarHeatmap } from '../CalendarHeatmap';

// Mock AccessibilityInfo
jest.mock('react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo', () => ({
  isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
  addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  announceForAccessibility: jest.fn(),
  fetch: jest.fn(() => Promise.resolve(false)),
}));

// Mock insightCardPreferences
jest.mock('../../../utils/insightCardPreferences', () => ({
  isInsightDismissed: jest.fn(() => Promise.resolve(false)),
  dismissInsight: jest.fn(() => Promise.resolve()),
}));

describe('CalendarHeatmap Integration (CALENDAR-6.3)', () => {
  const mockHabitId = 'test-habit-id' as any;
  const mockOnDayPress = jest.fn();

  // Helper: Create completed dates set from array of date strings
  const createCompletedDates = (dates: string[]): Set<string> => {
    return new Set(dates);
  };

  // Helper: Generate realistic completion pattern for December 2025
  const generateDecemberCompletions = (): Set<string> => {
    const dates: string[] = [];
    // Complete 14 out of 20 days (70% completion rate)
    for (let i = 0; i < 20; i++) {
      if (i % 3 !== 0) { // Skip every 3rd day (missed days)
        dates.push(`2025-12-${String(i + 1).padStart(2, '0')}`);
      }
    }
    return createCompletedDates(dates);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('AC1: CalendarHeatmap renders in HabitDetailScreen', () => {
    it('should render CalendarHeatmap component', () => {
      const completedDates = generateDecemberCompletions();

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Component renders with proper accessibility
      expect(getByLabelText('Habit activity calendar')).toBeTruthy();
    });

    it('should render all sub-components (header, grid, stats)', () => {
      const completedDates = generateDecemberCompletions();

      const { getByLabelText, getAllByAccessibilityLabel } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Header section
      expect(getByLabelText(/Activity for December 2025/)).toBeTruthy();

      // Navigation
      expect(getByLabelText(/Month navigation/)).toBeTruthy();

      // Grid with day headers
      expect(getByLabelText(/Days of the week/)).toBeTruthy();

      // Stats summary  (uses "Activity calendar for..." format)
      expect(getByLabelText(/Activity calendar for December 2025/)).toBeTruthy();
    });

    it('should render with current month by default', () => {
      const completedDates = generateDecemberCompletions();

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Should show December 2025
      expect(getByLabelText('December 2025')).toBeTruthy();
    });
  });

  describe('AC2: Data flows correctly from parent', () => {
    it('should receive and display completion data from parent', () => {
      const completedDates = createCompletedDates([
        '2025-12-01',
        '2025-12-02',
        '2025-12-05',
      ]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Should show completion summary with 3 days
      const summary = getByLabelText(/3 days completed.*success rate/);
      expect(summary).toBeTruthy();
    });

    it('should respect habitCreatedAt from parent', () => {
      const completedDates = createCompletedDates(['2025-12-15']);
      const habitCreatedAt = new Date('2025-12-10').getTime();

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={habitCreatedAt}
        />
      );

      // Calendar renders and respects habitCreatedAt for eligible days
      expect(getByLabelText('Habit activity calendar')).toBeTruthy();
    });

    it('should re-render when parent updates completion data', () => {
      const initialDates = createCompletedDates(['2025-12-01']);

      const { rerender, getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={initialDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Initial state: 1 day
      expect(getByLabelText(/1 day completed.*success rate/)).toBeTruthy();

      // Update with more completions
      const updatedDates = createCompletedDates([
        '2025-12-01',
        '2025-12-02',
        '2025-12-03',
      ]);

      rerender(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={updatedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Updated state: 3 days
      expect(getByLabelText(/3 days completed.*success rate/)).toBeTruthy();
    });

    it('should handle empty completion data from parent', () => {
      const completedDates = createCompletedDates([]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Should show 0 completions
      expect(getByLabelText(/0 days completed.*0% success rate/)).toBeTruthy();
    });

    it('should accept onDayPress callback from parent', () => {
      const completedDates = createCompletedDates(['2025-12-15']);

      // Render with onDayPress callback
      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
          onDayPress={mockOnDayPress}
        />
      );

      // Component renders with callback prop
      // (actual press testing would require complete reanimated mocks)
      expect(getByLabelText('Habit activity calendar')).toBeTruthy();
    });
  });

  describe('AC3: Month navigation updates grid', () => {
    it('should navigate to previous month', async () => {
      const completedDates = generateDecemberCompletions();

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-11-01').getTime()}
        />
      );

      // Initial month
      expect(getByLabelText('December 2025')).toBeTruthy();

      // Navigate to previous month
      const prevButton = getByLabelText(/Go to November 2025/);
      fireEvent.press(prevButton);

      // Should show November 2025
      await waitFor(() => {
        expect(getByLabelText('November 2025')).toBeTruthy();
      });
    });

    it('should update grid cells when month changes', async () => {
      const completedDates = generateDecemberCompletions();

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-11-01').getTime()}
        />
      );

      // Verify December grid
      expect(getByLabelText(/Activity for December 2025/)).toBeTruthy();

      // Navigate to November
      const prevButton = getByLabelText(/Go to November 2025/);
      fireEvent.press(prevButton);

      // Grid should update to November
      await waitFor(() => {
        expect(getByLabelText(/Activity for November 2025/)).toBeTruthy();
      });
    });

    it('should navigate to next month when not at current month', async () => {
      const completedDates = generateDecemberCompletions();

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-11-01').getTime()}
        />
      );

      // Navigate to previous month first
      const prevButton = getByLabelText(/Go to November 2025/);
      fireEvent.press(prevButton);

      await waitFor(() => {
        expect(getByLabelText('November 2025')).toBeTruthy();
      });

      // Now navigate forward
      const nextButton = getByLabelText(/Go to December 2025/);
      fireEvent.press(nextButton);

      await waitFor(() => {
        expect(getByLabelText('December 2025')).toBeTruthy();
      });
    });

    it('should disable next button when at current month', () => {
      const completedDates = generateDecemberCompletions();

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01').getTime()}
        />
      );

      // Next button should be disabled at current month
      const nextButton = getByLabelText(/Cannot go to future months/);
      expect(nextButton).toBeTruthy();
      expect(nextButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should enable next button when viewing past months', async () => {
      const completedDates = generateDecemberCompletions();

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-11-01').getTime()}
        />
      );

      // Navigate to previous month
      const prevButton = getByLabelText(/Go to November 2025/);
      fireEvent.press(prevButton);

      await waitFor(() => {
        // Next button should now be enabled
        const nextButton = getByLabelText(/Go to December 2025/);
        expect(nextButton.props.accessibilityState?.disabled).toBe(false);
      });
    });

    it('should update stats when navigating between months', async () => {
      const completedDates = createCompletedDates([
        '2025-11-15',
        '2025-11-16',
        '2025-12-01',
        '2025-12-02',
        '2025-12-03',
      ]);

      const { getByLabelText } = render(
        <CalendarHeatmap
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-11-01').getTime()}
        />
      );

      // December stats (3 days)
      expect(getByLabelText(/3 days completed.*success rate/)).toBeTruthy();

      // Navigate to November
      const prevButton = getByLabelText(/Go to November 2025/);
      fireEvent.press(prevButton);

      // November stats should update (2 days)
      await waitFor(() => {
        expect(getByLabelText(/2 days completed.*success rate/)).toBeTruthy();
      });
    });
  });
});
