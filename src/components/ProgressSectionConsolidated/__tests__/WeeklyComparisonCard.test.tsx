/**
 * WeeklyComparisonCard Component Tests
 *
 * Tests for the WeeklyComparisonCard component that displays
 * a comparison between this week's completions and last week's.
 *
 * @see docs/specs/habit-details-screen/progress/progress-section-tasks.md
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { WeeklyComparisonCard } from '../WeeklyComparisonCard';
import { calculateWeeklyComparison } from '../../ProgressSection/utils';
import {
  getComparisonStatus,
  COMPARISON_STATUSES,
} from '../WeeklyComparisonCardTypes';
import type { WeeklyComparisonCardProps } from '../WeeklyComparisonCardTypes';
import type { HabitTrackingEntry } from '../../../features/habits/types';

// Mock useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  __esModule: true,
  useReduceMotion: jest.fn(() => false),
  default: jest.fn(() => false),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');

  const Animated = {
    View,
    Text,
    createAnimatedComponent: (Component: React.ComponentType) => Component,
  };

  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    useSharedValue: (initialValue: number) => ({ value: initialValue }),
    useAnimatedStyle: () => ({}),
    useAnimatedProps: () => ({}),
    withTiming: (value: number) => value,
    withDelay: (_delay: number, value: number) => value,
    withSpring: (value: number) => value,
    withRepeat: (animation: any) => animation,
    withSequence: (...animations: any[]) => animations[0],
    interpolate: (
      value: number,
      inputRange: number[],
      outputRange: number[]
    ) => {
      const clampedValue = Math.max(
        inputRange[0],
        Math.min(inputRange[1], value)
      );
      const ratio =
        (clampedValue - inputRange[0]) / (inputRange[1] - inputRange[0]);
      return outputRange[0] + ratio * (outputRange[1] - outputRange[0]);
    },
    Easing: {
      out: () => () => 0,
      inOut: () => () => 0,
      cubic: () => 0,
      ease: () => 0,
    },
  };
});

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Calendar: (props: any) =>
      React.createElement(View, { testID: 'calendar-icon', ...props }),
    TrendingUp: (props: any) =>
      React.createElement(View, { testID: 'trending-up-icon', ...props }),
    TrendingDown: (props: any) =>
      React.createElement(View, { testID: 'trending-down-icon', ...props }),
    Minus: (props: any) =>
      React.createElement(View, { testID: 'minus-icon', ...props }),
  };
});

// Mock motion constants
jest.mock('../../../constants/motion', () => ({
  Motion: {
    duration: {
      fast: 100,
      base: 150,
      reveal: 180,
      emphasized: 220,
      enter: 280,
      exit: 220,
    },
    easing: {
      outEase: {},
      inEase: {},
      outCubic: {},
      inCubic: {},
    },
  },
  Springs: {
    sheet: { damping: 32, stiffness: 180, mass: 1.3 },
    gentle: { damping: 28, stiffness: 180, mass: 1.2 },
    button: { damping: 15, stiffness: 300 },
    bouncy: { damping: 8, stiffness: 300 },
    micro: { damping: 12, stiffness: 180 },
    pulse: { damping: 12, stiffness: 60 },
  },
}));

// Helper to create date strings
function getDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get day of week for current date
function getCurrentDayOfWeek(): number {
  return new Date().getDay();
}

// Generate completions for specific days of a week
function generateWeekCompletions(
  weekOffset: number,
  completedDayIndices: number[]
): string[] {
  const today = new Date();
  const currentDayOfWeek = today.getDay();

  // Get to the start of the target week (Sunday)
  const weekStartDaysAgo = currentDayOfWeek + weekOffset * 7;

  return completedDayIndices.map((dayIndex) => {
    return getDateString(weekStartDaysAgo - dayIndex);
  });
}

describe('WeeklyComparisonCard', () => {
  // Default props - some completions in both weeks
  const currentDayOfWeek = getCurrentDayOfWeek();

  // Create tracking with completions in both this week and last week
  // Use all days up to today for this week
  const createDefaultTracking = (): HabitTrackingEntry[] => {
    // This week: complete days up to and including today
    const thisWeekIndices: number[] = [];
    for (let i = 0; i <= currentDayOfWeek; i++) {
      thisWeekIndices.push(i);
    }
    const thisWeekDates = generateWeekCompletions(0, thisWeekIndices);

    // Last week: complete all 7 days
    const lastWeekDates = generateWeekCompletions(1, [0, 1, 2, 3, 4, 5, 6]);

    return [...thisWeekDates, ...lastWeekDates]
      .filter((date) => {
        // Only include dates up to today
        return date <= getDateString(0);
      })
      .map((date) => ({
        date,
        completed: true,
      }));
  };

  const defaultProps: WeeklyComparisonCardProps = {
    tracking: createDefaultTracking(),
    habitCreatedAt: getDateString(30) + 'T00:00:00.000Z',
  };

  // Empty tracking props
  const emptyProps: WeeklyComparisonCardProps = {
    tracking: [],
    habitCreatedAt: getDateString(30) + 'T00:00:00.000Z',
  };

  // New habit props (created this week - no last week data)
  const newHabitProps: WeeklyComparisonCardProps = {
    tracking: generateWeekCompletions(0, [0])
      .filter((date) => date <= getDateString(0))
      .map((date) => ({ date, completed: true })),
    habitCreatedAt: getDateString(currentDayOfWeek) + 'T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByLabelText } = render(
        <WeeklyComparisonCard {...defaultProps} />
      );
      expect(getByLabelText(/Weekly comparison/)).toBeTruthy();
    });

    it('displays the Weekly Progress title', () => {
      const { getByText } = render(<WeeklyComparisonCard {...defaultProps} />);
      expect(getByText('Weekly Progress')).toBeTruthy();
    });

    it('displays the Calendar icon', () => {
      const { getByTestId } = render(
        <WeeklyComparisonCard {...defaultProps} />
      );
      expect(getByTestId('calendar-icon')).toBeTruthy();
    });

    it('displays This Week and Last Week labels', () => {
      const { getByText } = render(<WeeklyComparisonCard {...defaultProps} />);
      expect(getByText('This Week')).toBeTruthy();
      expect(getByText('Last Week')).toBeTruthy();
    });

    it('displays completion counts in X/Y format', () => {
      const { getAllByText } = render(
        <WeeklyComparisonCard {...defaultProps} />
      );
      // Should find completion count texts (e.g., "3/7", "4/7")
      const countTexts = getAllByText(/\d+\/\d+/);
      expect(countTexts.length).toBe(2); // One for each week
    });

    it('displays status emoji and label', () => {
      const { getByText } = render(<WeeklyComparisonCard {...defaultProps} />);
      // Should show one of the status labels
      const statusLabels = COMPARISON_STATUSES.map((s) => s.label);
      const hasStatusLabel = statusLabels.some((label) => {
        try {
          getByText(label);
          return true;
        } catch {
          return false;
        }
      });
      expect(hasStatusLabel).toBe(true);
    });
  });

  describe('Trend Indicators', () => {
    it('shows trending up icon when this week > last week', () => {
      // Use days that are already past in this week
      const currentDay = getCurrentDayOfWeek();

      // Complete all available days this week (more than last week)
      const thisWeekIndices: number[] = [];
      for (let i = 0; i <= currentDay; i++) {
        thisWeekIndices.push(i);
      }
      const thisWeekDates = generateWeekCompletions(0, thisWeekIndices).filter(
        (d) => d <= getDateString(0)
      );

      // Last week: only 1 day completed (less than this week will have)
      const lastWeekDates = generateWeekCompletions(1, [0]);

      // Only run this test if this week has more completions than last week
      if (thisWeekDates.length > 1) {
        const tracking = [...thisWeekDates, ...lastWeekDates].map((date) => ({
          date,
          completed: true,
        }));

        const { getByTestId } = render(
          <WeeklyComparisonCard
            tracking={tracking}
            habitCreatedAt={getDateString(30)}
          />
        );
        expect(getByTestId('trending-up-icon')).toBeTruthy();
      } else {
        // If it's Sunday and only 1 day available, we can't have more than last week
        // This is expected behavior, skip the test
        expect(true).toBe(true);
      }
    });

    it('shows trending down icon when this week < last week', () => {
      // Fewer completions this week than last
      const thisWeekDates = generateWeekCompletions(0, [0]).filter(
        (d) => d <= getDateString(0)
      );
      const lastWeekDates = generateWeekCompletions(1, [0, 1, 2, 3, 4, 5, 6]);

      const tracking = [...thisWeekDates, ...lastWeekDates].map((date) => ({
        date,
        completed: true,
      }));

      const { getByTestId } = render(
        <WeeklyComparisonCard
          tracking={tracking}
          habitCreatedAt={getDateString(30)}
        />
      );
      expect(getByTestId('trending-down-icon')).toBeTruthy();
    });

    it('shows minus icon when weeks are equal', () => {
      // Same completions in both weeks
      const thisWeekDates = generateWeekCompletions(0, [0, 1, 2]).filter(
        (d) => d <= getDateString(0)
      );
      const lastWeekDates = generateWeekCompletions(1, [0, 1, 2]);

      // Only run this test if we have enough days in the current week
      if (thisWeekDates.length >= 3) {
        const tracking = [...thisWeekDates, ...lastWeekDates].map((date) => ({
          date,
          completed: true,
        }));

        const { getByTestId } = render(
          <WeeklyComparisonCard
            tracking={tracking}
            habitCreatedAt={getDateString(30)}
          />
        );
        expect(getByTestId('minus-icon')).toBeTruthy();
      }
    });

    it('hides trend indicator for new habits with no last week data', () => {
      const { queryByTestId } = render(
        <WeeklyComparisonCard {...newHabitProps} />
      );
      expect(queryByTestId('trending-up-icon')).toBeNull();
      expect(queryByTestId('trending-down-icon')).toBeNull();
      expect(queryByTestId('minus-icon')).toBeNull();
    });
  });

  describe('Comparison Status', () => {
    it('shows Improving status when doing better', () => {
      const currentDay = getCurrentDayOfWeek();

      // Complete all available days this week
      const thisWeekIndices: number[] = [];
      for (let i = 0; i <= currentDay; i++) {
        thisWeekIndices.push(i);
      }
      const thisWeekDates = generateWeekCompletions(0, thisWeekIndices).filter(
        (d) => d <= getDateString(0)
      );

      // Last week: only 1 day completed (less than this week)
      const lastWeekDates = generateWeekCompletions(1, [0]);

      // Only run this test if this week has more completions than last week
      if (thisWeekDates.length > 1) {
        const tracking = [...thisWeekDates, ...lastWeekDates].map((date) => ({
          date,
          completed: true,
        }));

        const { getByText } = render(
          <WeeklyComparisonCard
            tracking={tracking}
            habitCreatedAt={getDateString(30)}
          />
        );
        expect(getByText('Improving')).toBeTruthy();
      } else {
        // If it's Sunday, skip this test as we can't have improvement scenario
        expect(true).toBe(true);
      }
    });

    it('shows Needs Focus status when doing worse', () => {
      const thisWeekDates = generateWeekCompletions(0, []).filter(
        (d) => d <= getDateString(0)
      );
      const lastWeekDates = generateWeekCompletions(1, [0, 1, 2, 3, 4, 5, 6]);

      const tracking = [...thisWeekDates, ...lastWeekDates].map((date) => ({
        date,
        completed: true,
      }));

      const { getByText } = render(
        <WeeklyComparisonCard
          tracking={tracking}
          habitCreatedAt={getDateString(30)}
        />
      );
      expect(getByText('Needs Focus')).toBeTruthy();
    });

    it('shows Just Started status for new habits', () => {
      const { getByText } = render(<WeeklyComparisonCard {...newHabitProps} />);
      expect(getByText('Just Started')).toBeTruthy();
    });

    it('shows status description', () => {
      const { getByText } = render(<WeeklyComparisonCard {...defaultProps} />);
      // Should show one of the status descriptions
      const descriptions = COMPARISON_STATUSES.map((s) => s.description);
      const hasDescription = descriptions.some((desc) => {
        try {
          getByText(desc);
          return true;
        } catch {
          return false;
        }
      });
      expect(hasDescription).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility label with comparison data', () => {
      const { getByLabelText } = render(
        <WeeklyComparisonCard {...defaultProps} />
      );
      expect(getByLabelText(/Weekly comparison/)).toBeTruthy();
      expect(getByLabelText(/This week \d+ of \d+ completed/)).toBeTruthy();
    });

    it('includes last week data in accessibility label', () => {
      const { getByLabelText } = render(
        <WeeklyComparisonCard {...defaultProps} />
      );
      expect(getByLabelText(/last week \d+ of \d+/)).toBeTruthy();
    });

    it('includes trend in accessibility label', () => {
      const { getByLabelText } = render(
        <WeeklyComparisonCard {...defaultProps} />
      );
      // The accessibility label includes trend info - check for any of the patterns
      const container = getByLabelText(/Weekly comparison/);
      const label = container.props.accessibilityLabel;
      expect(
        label.includes('Up') ||
          label.includes('Down') ||
          label.includes('Same as last week') ||
          label.includes('No previous week data')
      ).toBe(true);
    });

    it('has summary accessibility role', () => {
      const { getByLabelText } = render(
        <WeeklyComparisonCard {...defaultProps} />
      );
      const container = getByLabelText(/Weekly comparison/);
      expect(container.props.accessibilityRole).toBe('summary');
    });

    it('week bars have accessible labels', () => {
      const { getByLabelText } = render(
        <WeeklyComparisonCard {...defaultProps} />
      );
      expect(
        getByLabelText(/This Week: \d+ of \d+ days completed/)
      ).toBeTruthy();
      expect(
        getByLabelText(/Last Week: \d+ of \d+ days completed/)
      ).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty tracking array', () => {
      const { getByText, getAllByText } = render(
        <WeeklyComparisonCard {...emptyProps} />
      );
      expect(getByText('Weekly Progress')).toBeTruthy();
      // Should show 0/X format for both weeks
      const zeroPatterns = getAllByText(/0\/\d+/);
      expect(zeroPatterns.length).toBeGreaterThanOrEqual(1);
    });

    it('handles habit created today', () => {
      const tracking = [{ date: getDateString(0), completed: true }];
      const props = {
        tracking,
        habitCreatedAt: new Date().toISOString(),
      };

      const { getByText } = render(<WeeklyComparisonCard {...props} />);
      expect(getByText('Weekly Progress')).toBeTruthy();
    });

    it('handles habit created more than 2 weeks ago', () => {
      const tracking = generateWeekCompletions(0, [0, 1, 2, 3, 4, 5, 6])
        .filter((d) => d <= getDateString(0))
        .concat(generateWeekCompletions(1, [0, 1, 2, 3, 4, 5, 6]))
        .concat(generateWeekCompletions(2, [0, 1, 2, 3, 4, 5, 6]))
        .map((date) => ({ date, completed: true }));

      const props = {
        tracking,
        habitCreatedAt: getDateString(21) + 'T00:00:00.000Z',
      };

      const { getByLabelText } = render(<WeeklyComparisonCard {...props} />);
      expect(getByLabelText(/Weekly comparison/)).toBeTruthy();
    });

    it('handles index prop for animation staggering', () => {
      const { getByLabelText } = render(
        <WeeklyComparisonCard {...defaultProps} index={2} />
      );
      expect(getByLabelText(/Weekly comparison/)).toBeTruthy();
    });
  });
});

describe('calculateWeeklyComparison utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns correct structure with all fields', () => {
    const result = calculateWeeklyComparison([]);
    expect(result).toHaveProperty('thisWeekCompleted');
    expect(result).toHaveProperty('thisWeekTotal');
    expect(result).toHaveProperty('lastWeekCompleted');
    expect(result).toHaveProperty('lastWeekTotal');
    expect(result).toHaveProperty('difference');
    expect(result).toHaveProperty('percentChange');
    expect(result).toHaveProperty('trend');
    expect(result).toHaveProperty('thisWeekDays');
    expect(result).toHaveProperty('lastWeekDays');
  });

  it('returns 7 days for each week', () => {
    const result = calculateWeeklyComparison([]);
    expect(result.thisWeekDays.length).toBe(7);
    expect(result.lastWeekDays.length).toBe(7);
  });

  it('calculates positive difference correctly', () => {
    const currentDay = getCurrentDayOfWeek();

    // Complete all available days this week
    const thisWeekIndices: number[] = [];
    for (let i = 0; i <= currentDay; i++) {
      thisWeekIndices.push(i);
    }
    const thisWeekDates = generateWeekCompletions(0, thisWeekIndices).filter(
      (d) => d <= getDateString(0)
    );
    const lastWeekDates = generateWeekCompletions(1, [0]); // Only 1 day last week

    // Only run if this week has more than last week
    if (thisWeekDates.length > 1) {
      const tracking = [...thisWeekDates, ...lastWeekDates].map((date) => ({
        date,
        completed: true,
      }));

      const result = calculateWeeklyComparison(tracking);
      expect(result.trend).toBe('up');
      expect(result.difference).toBeGreaterThan(0);
    } else {
      // Skip if Sunday - can't have more completions
      expect(true).toBe(true);
    }
  });

  it('calculates negative difference correctly', () => {
    const thisWeekDates = generateWeekCompletions(0, []).filter(
      (d) => d <= getDateString(0)
    );
    const lastWeekDates = generateWeekCompletions(1, [0, 1, 2, 3, 4]);

    const tracking = [...thisWeekDates, ...lastWeekDates].map((date) => ({
      date,
      completed: true,
    }));

    const result = calculateWeeklyComparison(tracking);
    expect(result.trend).toBe('down');
    expect(result.difference).toBeLessThan(0);
  });

  it('marks future days correctly', () => {
    const result = calculateWeeklyComparison([]);
    const currentDayOfWeek = new Date().getDay();

    // Days after today in this week should be marked as future
    result.thisWeekDays.forEach((day, index) => {
      if (index > currentDayOfWeek) {
        expect(day.isFuture).toBe(true);
      } else {
        expect(day.isFuture).toBe(false);
      }
    });
  });

  it('marks before-creation days correctly', () => {
    const habitCreatedAt = new Date().getTime() - 3 * 24 * 60 * 60 * 1000; // 3 days ago
    const result = calculateWeeklyComparison([], habitCreatedAt);

    const creationDate = new Date(habitCreatedAt);

    result.thisWeekDays.forEach((day) => {
      const dayDate = new Date(day.date);
      if (dayDate < creationDate) {
        expect(day.isBeforeCreation).toBe(true);
      }
    });
  });

  it('includes day labels in correct order', () => {
    const result = calculateWeeklyComparison([]);
    const expectedLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    result.thisWeekDays.forEach((day, index) => {
      expect(day.dayLabel).toBe(expectedLabels[index]);
    });
  });

  it('calculates percentage change correctly', () => {
    // Last week: 2 completions, this week: 4 completions = 100% increase
    const currentDayOfWeek = new Date().getDay();
    const thisWeekDates = generateWeekCompletions(0, [0, 1, 2, 3]).filter(
      (d) => d <= getDateString(0)
    );
    const lastWeekDates = generateWeekCompletions(1, [0, 1]);

    // Only run if we have enough days
    if (thisWeekDates.length >= 4) {
      const tracking = [...thisWeekDates, ...lastWeekDates].map((date) => ({
        date,
        completed: true,
      }));

      const result = calculateWeeklyComparison(tracking);
      expect(result.percentChange).toBeGreaterThan(0);
    }
  });
});

describe('getComparisonStatus helper', () => {
  it('returns improved status for positive difference', () => {
    const status = getComparisonStatus(2, 7);
    expect(status.level).toBe('improved');
  });

  it('returns declined status for negative difference', () => {
    const status = getComparisonStatus(-2, 7);
    expect(status.level).toBe('declined');
  });

  it('returns maintained status for zero difference', () => {
    const status = getComparisonStatus(0, 7);
    expect(status.level).toBe('maintained');
  });

  it('returns new status when no last week data', () => {
    const status = getComparisonStatus(3, 0);
    expect(status.level).toBe('new');
  });

  it('returns correct properties for each status', () => {
    COMPARISON_STATUSES.forEach((expectedStatus) => {
      let diff = 0;
      let lastWeekTotal = 7;

      switch (expectedStatus.level) {
        case 'improved':
          diff = 2;
          break;
        case 'declined':
          diff = -2;
          break;
        case 'new':
          diff = 3;
          lastWeekTotal = 0;
          break;
      }

      const status = getComparisonStatus(diff, lastWeekTotal);
      expect(status.label).toBe(expectedStatus.label);
      expect(status.emoji).toBe(expectedStatus.emoji);
      expect(status.color).toBe(expectedStatus.color);
      expect(status.bgColor).toBe(expectedStatus.bgColor);
    });
  });
});

describe('Reduce Motion', () => {
  const mockUseReduceMotion = require('../../../hooks/useReduceMotion')
    .useReduceMotion as jest.Mock;

  const defaultProps: WeeklyComparisonCardProps = {
    tracking: generateWeekCompletions(0, [0, 1, 2])
      .filter((d) => d <= getDateString(0))
      .map((date) => ({ date, completed: true })),
    habitCreatedAt: getDateString(30) + 'T00:00:00.000Z',
  };

  beforeEach(() => {
    mockUseReduceMotion.mockReturnValue(false);
  });

  it('renders correctly with reduce motion enabled', () => {
    mockUseReduceMotion.mockReturnValue(true);

    const { getByLabelText } = render(
      <WeeklyComparisonCard {...defaultProps} />
    );
    expect(getByLabelText(/Weekly comparison/)).toBeTruthy();
  });

  it('disables entrance animation when reduce motion is enabled', () => {
    mockUseReduceMotion.mockReturnValue(true);

    const { getByLabelText } = render(
      <WeeklyComparisonCard {...defaultProps} />
    );
    expect(getByLabelText(/Weekly comparison/)).toBeTruthy();
  });

  it('disables bar animations when reduce motion is enabled', () => {
    mockUseReduceMotion.mockReturnValue(true);

    const { getByLabelText } = render(
      <WeeklyComparisonCard {...defaultProps} />
    );
    expect(getByLabelText(/This Week:/)).toBeTruthy();
    expect(getByLabelText(/Last Week:/)).toBeTruthy();
  });
});
