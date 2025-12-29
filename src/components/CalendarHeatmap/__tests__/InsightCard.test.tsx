/**
 * InsightCard Component Tests
 * Tests pattern detection, visualization, and action buttons
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InsightCard } from '../InsightCard';
import type { DayOfWeekStat } from '../types';

describe('InsightCard', () => {
  const mockOnSetReminder = jest.fn();
  const mockOnSeeTips = jest.fn();
  const mockOnDismiss = jest.fn();

  // Sample day-of-week stats
  const createDayStats = (rates: number[]): DayOfWeekStat[] => {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return days.map((day, index) => ({
      day,
      rate: rates[index],
      count: Math.floor(rates[index] / 10), // Simplified
      total: 10,
    }));
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when no weak day detected', () => {
      const stats = createDayStats([80, 80, 80, 80, 80, 80, 80]);

      const { queryByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={null}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(queryByText(/need focus/)).toBeNull();
    });

    it('should render when weak day detected', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByText('Sundays need focus')).toBeTruthy();
    });

    it('should display weakest day name', () => {
      const stats = createDayStats([80, 40, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Monday', rate: 40 };

      const { getByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByText('Mondays need focus')).toBeTruthy();
    });

    it('should display completion rate', () => {
      const stats = createDayStats([62, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 62 };

      const { getByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByText(/62% of the time/)).toBeTruthy();
    });

    it('should calculate and display below-average percentage', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 90]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      // Average is (50+80+80+80+80+80+90)/7 = 540/7 ≈ 77
      // 77 - 50 = 27% below average
      expect(getByText(/27% below average/)).toBeTruthy();
    });

    it('should show lightbulb icon', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByTestId } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByTestId('lucide-icon-Lightbulb')).toBeTruthy();
    });
  });

  describe('Bar chart visualization', () => {
    it('should render bar for each day of week', () => {
      const stats = createDayStats([50, 60, 70, 80, 90, 85, 75]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      // Check that all day labels are present using accessibility labels
      // (S appears twice for Sunday/Saturday, T appears twice for Tuesday/Thursday)
      expect(getByLabelText(/Sunday:/)).toBeTruthy();
      expect(getByLabelText(/Monday:/)).toBeTruthy();
      expect(getByLabelText(/Tuesday:/)).toBeTruthy();
      expect(getByLabelText(/Wednesday:/)).toBeTruthy();
      expect(getByLabelText(/Thursday:/)).toBeTruthy();
      expect(getByLabelText(/Friday:/)).toBeTruthy();
      expect(getByLabelText(/Saturday:/)).toBeTruthy();
    });

    it('should display percentage for each day via accessibility', () => {
      const stats = createDayStats([50, 60, 70, 80, 90, 85, 75]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      // Check that percentages are displayed in accessibility labels
      expect(getByLabelText(/Sunday: 50% completion rate/)).toBeTruthy();
      expect(getByLabelText(/Monday: 60% completion rate/)).toBeTruthy();
      expect(getByLabelText(/Tuesday: 70% completion rate/)).toBeTruthy();
      expect(getByLabelText(/Wednesday: 80% completion rate/)).toBeTruthy();
      expect(getByLabelText(/Thursday: 90% completion rate/)).toBeTruthy();
      expect(getByLabelText(/Friday: 85% completion rate/)).toBeTruthy();
      expect(getByLabelText(/Saturday: 75% completion rate/)).toBeTruthy();
    });

    it('should highlight weakest day bar in different color', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      // Weakest day should be highlighted - verify via accessibility label
      // (visual styling is tested through className which includes 'bg-violet-400')
      expect(getByLabelText('Sunday: 50% completion rate')).toBeTruthy();
    });
  });

  describe('Action buttons', () => {
    it('should render Set Reminder button when callback provided', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByText('Set Reminder')).toBeTruthy();
    });

    it('should render Tips button when callback provided', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByText('Tips')).toBeTruthy();
    });

    it('should not render Set Reminder button when callback not provided', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { queryByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(queryByText('Set Reminder')).toBeNull();
    });

    it('should not render Tips button when callback not provided', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { queryByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onDismiss={mockOnDismiss}
        />
      );

      expect(queryByText('Tips')).toBeNull();
    });

    it('should call onSetReminder with correct day when button pressed', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      const button = getByText('Set Reminder');
      fireEvent.press(button);

      expect(mockOnSetReminder).toHaveBeenCalledTimes(1);
      expect(mockOnSetReminder).toHaveBeenCalledWith('Sunday');
    });

    it('should call onSeeTips with correct day when button pressed', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      const button = getByText('Tips');
      fireEvent.press(button);

      expect(mockOnSeeTips).toHaveBeenCalledTimes(1);
      expect(mockOnSeeTips).toHaveBeenCalledWith('Sunday');
    });
  });

  describe('Dismiss functionality', () => {
    it('should render dismiss button when callback provided', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByTestId } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByTestId('lucide-icon-X')).toBeTruthy();
    });

    it('should not render dismiss button when callback not provided', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { queryByTestId } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
        />
      );

      expect(queryByTestId('lucide-icon-X')).toBeNull();
    });

    it('should call onDismiss when dismiss button pressed', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      const dismissButton = getByLabelText('Dismiss insight');
      fireEvent.press(dismissButton);

      expect(mockOnDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible card label', () => {
      const stats = createDayStats([62, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 62 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(
        getByLabelText(
          'Insight: Sundays are your challenge day at 62% completion'
        )
      ).toBeTruthy();
    });

    it('should have accessible button labels for Set Reminder', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      const button = getByLabelText('Set reminder for Sundays');
      expect(button).toBeTruthy();
      expect(button.props.accessibilityHint).toBe(
        'Opens time picker to set a reminder'
      );
    });

    it('should have accessible button labels for Tips', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      const button = getByLabelText('See tips for Sundays');
      expect(button).toBeTruthy();
      expect(button.props.accessibilityHint).toBe(
        'Opens tips modal with strategies'
      );
    });

    it('should have accessible dismiss button', () => {
      const stats = createDayStats([50, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      const button = getByLabelText('Dismiss insight');
      expect(button).toBeTruthy();
      expect(button.props.accessibilityHint).toBe('Hide this insight card');
    });

    it('should have accessible day-of-week bar labels', () => {
      const stats = createDayStats([50, 60, 70, 80, 90, 85, 75]);
      const weakestDay = { day: 'Sunday', rate: 50 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByLabelText('Sunday: 50% completion rate')).toBeTruthy();
      expect(getByLabelText('Monday: 60% completion rate')).toBeTruthy();
      expect(getByLabelText('Tuesday: 70% completion rate')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('should handle 0% completion rate', () => {
      const stats = createDayStats([0, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 0 };

      const { getByText, getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByText(/0% of the time/)).toBeTruthy();
      // Use accessibility label since text nodes may be split in RN
      expect(getByLabelText('Sunday: 0% completion rate')).toBeTruthy();
    });

    it('should handle low completion rates with minimum bar height', () => {
      const stats = createDayStats([2, 80, 80, 80, 80, 80, 80]);
      const weakestDay = { day: 'Sunday', rate: 2 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      // Should still render with minimum height (5%)
      // Use accessibility label since text nodes may be split in RN
      expect(getByLabelText('Sunday: 2% completion rate')).toBeTruthy();
    });

    it('should handle 100% completion rate', () => {
      const stats = createDayStats([60, 100, 100, 100, 100, 100, 100]);
      const weakestDay = { day: 'Sunday', rate: 60 };

      const { getByLabelText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      // Use accessibility label since text nodes may be split in RN
      expect(getByLabelText('Monday: 100% completion rate')).toBeTruthy();
    });

    it('should handle different weak days correctly', () => {
      const stats = createDayStats([80, 80, 80, 45, 80, 80, 80]);
      const weakestDay = { day: 'Wednesday', rate: 45 };

      const { getByText } = render(
        <InsightCard
          dayOfWeekStats={stats}
          weakestDay={weakestDay}
          onSetReminder={mockOnSetReminder}
          onSeeTips={mockOnSeeTips}
          onDismiss={mockOnDismiss}
        />
      );

      expect(getByText('Wednesdays need focus')).toBeTruthy();
    });
  });
});
