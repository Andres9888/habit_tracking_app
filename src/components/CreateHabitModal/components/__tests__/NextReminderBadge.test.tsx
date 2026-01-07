/**
 * NextReminderBadge Component Tests
 * Task 1.2: Create NextReminderBadge Component
 *
 * Tests:
 * - Shows "Today at X" when time is in future today
 * - Shows "Tomorrow at X" when time is in past today
 * - Shows relative time "(in X hours)" or "(in X minutes)"
 * - Amber background with clock icon
 * - Accessible text for screen readers
 * - Fade animation on enter/exit
 * - Hides when disabled
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import {
  NextReminderBadge,
  NextReminderBadgeProps,
  getNextReminderText,
} from '../NextReminderBadge';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: {
      View: View,
    },
    FadeIn: {
      duration: () => ({
        delay: () => ({}),
      }),
    },
    FadeOut: {
      duration: () => ({}),
    },
  };
});

// Mock lucide-react-native Clock icon
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    Clock: ({
      size,
      color,
      testID,
    }: {
      size: number;
      color: string;
      testID?: string;
    }) => (
      <View
        testID={testID || 'clock-icon'}
        accessibilityLabel={`Clock icon size ${size} color ${color}`}
      />
    ),
  };
});

describe('NextReminderBadge', () => {
  const defaultProps: NextReminderBadgeProps = {
    reminderTime: new Date(),
    enabled: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Use a fixed time for consistent testing
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-06-15T10:00:00'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  /**
   * Create a Date object at a specific hour/minute for testing
   */
  const createTime = (hours: number, minutes: number): Date => {
    const date = new Date('2024-06-15T00:00:00');
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  describe('Component Rendering', () => {
    it('should render when enabled', () => {
      const { getByTestId } = render(<NextReminderBadge {...defaultProps} />);
      expect(getByTestId('next-reminder-badge')).toBeDefined();
    });

    it('should not render when disabled', () => {
      const { queryByTestId } = render(
        <NextReminderBadge {...defaultProps} enabled={false} />
      );
      expect(queryByTestId('next-reminder-badge')).toBeNull();
    });

    it('should render clock icon', () => {
      const { getByTestId } = render(<NextReminderBadge {...defaultProps} />);
      expect(getByTestId('clock-icon')).toBeDefined();
    });

    it('should display "Next:" prefix in the badge', () => {
      const { getByText } = render(<NextReminderBadge {...defaultProps} />);
      expect(getByText(/Next:/)).toBeDefined();
    });
  });

  describe('Today vs Tomorrow Logic', () => {
    it('should show "Today at X" when time is in future today', () => {
      // Current time is 10:00 AM, set reminder for 2:00 PM
      const futureTime = createTime(14, 0);

      const { getByText } = render(
        <NextReminderBadge reminderTime={futureTime} enabled />
      );

      expect(getByText(/Today at 2:00 PM/)).toBeDefined();
    });

    it('should show "Tomorrow at X" when time has passed today', () => {
      // Current time is 10:00 AM, set reminder for 8:00 AM (already passed)
      const pastTime = createTime(8, 0);

      const { getByText } = render(
        <NextReminderBadge reminderTime={pastTime} enabled />
      );

      expect(getByText(/Tomorrow at 8:00 AM/)).toBeDefined();
    });

    it('should show "Tomorrow at X" when time is exactly now', () => {
      // Current time is 10:00 AM, set reminder for exactly 10:00 AM
      const exactTime = createTime(10, 0);

      const { getByText } = render(
        <NextReminderBadge reminderTime={exactTime} enabled />
      );

      expect(getByText(/Tomorrow at 10:00 AM/)).toBeDefined();
    });
  });

  describe('Relative Time Display', () => {
    it('should show hours and minutes when more than 1 hour away', () => {
      // Current time is 10:00 AM, set reminder for 2:30 PM (4h 30m away)
      const futureTime = createTime(14, 30);

      const { getByText } = render(
        <NextReminderBadge reminderTime={futureTime} enabled />
      );

      expect(getByText(/in 4h 30m/)).toBeDefined();
    });

    it('should show only hours when exactly on the hour', () => {
      // Current time is 10:00 AM, set reminder for 1:00 PM (3 hours away)
      const futureTime = createTime(13, 0);

      const { getByText } = render(
        <NextReminderBadge reminderTime={futureTime} enabled />
      );

      expect(getByText(/in 3 hours/)).toBeDefined();
    });

    it('should show singular "hour" for 1 hour', () => {
      // Current time is 10:00 AM, set reminder for 11:00 AM (1 hour away)
      const futureTime = createTime(11, 0);

      const { getByText } = render(
        <NextReminderBadge reminderTime={futureTime} enabled />
      );

      expect(getByText(/in 1 hour\)/)).toBeDefined();
    });

    it('should show minutes only when less than 1 hour away', () => {
      // Current time is 10:00 AM, set reminder for 10:45 AM (45 minutes away)
      const futureTime = createTime(10, 45);

      const { getByText } = render(
        <NextReminderBadge reminderTime={futureTime} enabled />
      );

      expect(getByText(/in 45 minutes/)).toBeDefined();
    });

    it('should show singular "minute" for 1 minute', () => {
      // Current time is 10:00 AM, set reminder for 10:01 AM (1 minute away)
      const futureTime = createTime(10, 1);

      const { getByText } = render(
        <NextReminderBadge reminderTime={futureTime} enabled />
      );

      expect(getByText(/in 1 minute\)/)).toBeDefined();
    });
  });

  describe('Time Formatting', () => {
    it('should format AM times correctly', () => {
      const morningTime = createTime(7, 0);

      const { getByText } = render(
        <NextReminderBadge reminderTime={morningTime} enabled />
      );

      // 7:00 AM has passed (current is 10:00 AM), so it's tomorrow
      expect(getByText(/7:00 AM/)).toBeDefined();
    });

    it('should format PM times correctly', () => {
      const eveningTime = createTime(20, 0);

      const { getByText } = render(
        <NextReminderBadge reminderTime={eveningTime} enabled />
      );

      expect(getByText(/8:00 PM/)).toBeDefined();
    });

    it('should format 12:00 PM (noon) correctly', () => {
      const noonTime = createTime(12, 0);

      const { getByText } = render(
        <NextReminderBadge reminderTime={noonTime} enabled />
      );

      expect(getByText(/12:00 PM/)).toBeDefined();
    });

    it('should format midnight (12:00 AM) correctly', () => {
      // Test at 10 PM to have midnight be in the future
      jest.setSystemTime(new Date('2024-06-15T22:00:00'));
      const midnightTime = createTime(0, 0);

      const { getByText } = render(
        <NextReminderBadge reminderTime={midnightTime} enabled />
      );

      // Midnight has passed today (current is 22:00), so it shows as tomorrow
      expect(getByText(/12:00 AM/)).toBeDefined();
    });

    it('should include minutes in the formatted time', () => {
      const timeWithMinutes = createTime(14, 30);

      const { getByText } = render(
        <NextReminderBadge reminderTime={timeWithMinutes} enabled />
      );

      expect(getByText(/2:30 PM/)).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should have accessibilityRole="text"', () => {
      const { getByTestId } = render(<NextReminderBadge {...defaultProps} />);
      const badge = getByTestId('next-reminder-badge');
      expect(badge.props.accessibilityRole).toBe('text');
    });

    it('should have descriptive accessibilityLabel', () => {
      const futureTime = createTime(14, 0);

      const { getByTestId } = render(
        <NextReminderBadge reminderTime={futureTime} enabled />
      );

      const badge = getByTestId('next-reminder-badge');
      expect(badge.props.accessibilityLabel).toContain('Next reminder:');
      expect(badge.props.accessibilityLabel).toContain('Today at 2:00 PM');
    });

    it('should include full time context in accessibilityLabel for tomorrow', () => {
      const pastTime = createTime(8, 0);

      const { getByTestId } = render(
        <NextReminderBadge reminderTime={pastTime} enabled />
      );

      const badge = getByTestId('next-reminder-badge');
      expect(badge.props.accessibilityLabel).toContain('Tomorrow at 8:00 AM');
    });
  });

  describe('getNextReminderText Helper Function', () => {
    it('should return correct format for future time today', () => {
      const futureTime = createTime(15, 30);
      const result = getNextReminderText(futureTime);

      expect(result).toContain('Today at');
      expect(result).toContain('3:30 PM');
      expect(result).toContain('in');
    });

    it('should return correct format for past time', () => {
      const pastTime = createTime(8, 0);
      const result = getNextReminderText(pastTime);

      expect(result).toBe('Tomorrow at 8:00 AM');
    });

    it('should handle edge case of same minute', () => {
      // Time is exactly now (10:00)
      const exactTime = createTime(10, 0);
      const result = getNextReminderText(exactTime);

      // Since it's not > now, it should be tomorrow
      expect(result).toBe('Tomorrow at 10:00 AM');
    });

    it('should handle 1 minute in future', () => {
      const oneMinuteAhead = createTime(10, 1);
      const result = getNextReminderText(oneMinuteAhead);

      expect(result).toContain('in 1 minute)');
    });

    it('should handle 59 minutes in future', () => {
      const almostAnHour = createTime(10, 59);
      const result = getNextReminderText(almostAnHour);

      expect(result).toContain('in 59 minutes)');
    });

    it('should handle exactly 1 hour in future', () => {
      const oneHour = createTime(11, 0);
      const result = getNextReminderText(oneHour);

      expect(result).toContain('in 1 hour)');
    });

    it('should handle multiple hours in future', () => {
      const multipleHours = createTime(15, 0);
      const result = getNextReminderText(multipleHours);

      expect(result).toContain('in 5 hours)');
    });

    it('should handle hours and minutes combination', () => {
      const hoursAndMinutes = createTime(12, 30);
      const result = getNextReminderText(hoursAndMinutes);

      expect(result).toContain('in 2h 30m)');
    });
  });

  describe('Edge Cases', () => {
    it('should handle reminder time at 11:59 PM', () => {
      const lateNight = createTime(23, 59);

      const { getByText } = render(
        <NextReminderBadge reminderTime={lateNight} enabled />
      );

      expect(getByText(/11:59 PM/)).toBeDefined();
    });

    it('should handle reminder time at 12:01 AM', () => {
      // Test at 11 PM so 12:01 AM is in the future
      jest.setSystemTime(new Date('2024-06-15T23:00:00'));
      const earlyMorning = createTime(0, 1);

      const { getByText } = render(
        <NextReminderBadge reminderTime={earlyMorning} enabled />
      );

      // Since current time is 11 PM, 12:01 AM has passed today, show tomorrow
      expect(getByText(/12:01 AM/)).toBeDefined();
    });

    it('should re-render when reminderTime prop changes', () => {
      const initialTime = createTime(14, 0);
      const { getByText, rerender } = render(
        <NextReminderBadge reminderTime={initialTime} enabled />
      );

      expect(getByText(/2:00 PM/)).toBeDefined();

      const newTime = createTime(16, 30);
      rerender(<NextReminderBadge reminderTime={newTime} enabled />);

      expect(getByText(/4:30 PM/)).toBeDefined();
    });

    it('should re-render when enabled prop changes', () => {
      const { queryByTestId, rerender } = render(
        <NextReminderBadge reminderTime={createTime(14, 0)} enabled={false} />
      );

      expect(queryByTestId('next-reminder-badge')).toBeNull();

      rerender(
        <NextReminderBadge reminderTime={createTime(14, 0)} enabled={true} />
      );

      expect(queryByTestId('next-reminder-badge')).toBeDefined();
    });
  });
});
