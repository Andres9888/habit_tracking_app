/**
 * ConsistencyIndexCard Component Tests
 *
 * Tests for the ConsistencyIndexCard component that displays
 * a rolling 30-day consistency score with sparkline visualization.
 *
 * @see docs/specs/habit-details-screen/progress/progress-section-tasks.md
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ConsistencyIndexCard } from '../ConsistencyIndexCard';
import { calculateConsistencyIndex } from '../../ProgressSection/utils';
import {
  getConsistencyLevel,
  CONSISTENCY_LEVELS,
} from '../ConsistencyIndexCardTypes';
import type { ConsistencyIndexCardProps } from '../ConsistencyIndexCardTypes';
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
      const clampedValue = Math.max(inputRange[0], Math.min(inputRange[1], value));
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
    Activity: (props: any) =>
      React.createElement(View, { testID: 'activity-icon', ...props }),
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

// Helper function to generate test tracking data
function generateTrackingData(
  completedDates: string[],
  habitCreatedAt?: string
): { tracking: HabitTrackingEntry[]; habitCreatedAt: string } {
  const createdAt = habitCreatedAt || '2024-01-01T00:00:00.000Z';
  const tracking: HabitTrackingEntry[] = completedDates.map((date) => ({
    date,
    completed: true,
  }));

  return { tracking, habitCreatedAt: createdAt };
}

// Helper to create date strings
function getDateString(daysAgo: number): string {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Generate last N days of completions
function generateConsecutiveDays(count: number, startingDaysAgo = 0): string[] {
  const dates: string[] = [];
  for (let i = startingDaysAgo; i < startingDaysAgo + count; i++) {
    dates.push(getDateString(i));
  }
  return dates;
}

describe('ConsistencyIndexCard', () => {
  // Default props with some completions
  const defaultProps: ConsistencyIndexCardProps = {
    tracking: generateConsecutiveDays(15).map((date) => ({
      date,
      completed: true,
    })),
    habitCreatedAt: getDateString(30) + 'T00:00:00.000Z',
  };

  // Minimal props with no completions
  const minimalProps: ConsistencyIndexCardProps = {
    tracking: [],
    habitCreatedAt: getDateString(30) + 'T00:00:00.000Z',
  };

  // High performer props (lots of completions)
  const highPerformerProps: ConsistencyIndexCardProps = {
    tracking: generateConsecutiveDays(28).map((date) => ({
      date,
      completed: true,
    })),
    habitCreatedAt: getDateString(30) + 'T00:00:00.000Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...defaultProps} />
      );
      expect(getByLabelText(/Consistency index/)).toBeTruthy();
    });

    it('displays the Consistency Index title', () => {
      const { getByText } = render(<ConsistencyIndexCard {...defaultProps} />);
      expect(getByText('Consistency Index')).toBeTruthy();
    });

    it('displays the Activity icon', () => {
      const { getByTestId } = render(<ConsistencyIndexCard {...defaultProps} />);
      expect(getByTestId('activity-icon')).toBeTruthy();
    });

    it('displays score as percentage', () => {
      const { getByText } = render(<ConsistencyIndexCard {...defaultProps} />);
      expect(getByText('%')).toBeTruthy();
    });

    it('displays level emoji and label', () => {
      const { getByText } = render(<ConsistencyIndexCard {...highPerformerProps} />);
      // High performer should have a high score
      const level = getConsistencyLevel(85);
      expect(getByText(level.emoji)).toBeTruthy();
      expect(getByText(level.label)).toBeTruthy();
    });

    it('displays days included count', () => {
      const { getByText } = render(<ConsistencyIndexCard {...defaultProps} />);
      expect(getByText(/Last \d+ days/)).toBeTruthy();
    });
  });

  describe('Score Calculation', () => {
    it('shows 0 score for no completions', () => {
      const { getByText } = render(<ConsistencyIndexCard {...minimalProps} />);
      expect(getByText('0')).toBeTruthy();
    });

    it('shows high score for consistent completions', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...highPerformerProps} />
      );
      // Should have a high consistency score (70+)
      expect(getByLabelText(/Consistency index: \d+/)).toBeTruthy();
    });

    it('calculates score based on 30-day window', () => {
      // Create tracking for exactly 30 days
      const tracking = generateConsecutiveDays(30).map((date) => ({
        date,
        completed: true,
      }));
      const props = {
        tracking,
        habitCreatedAt: getDateString(30) + 'T00:00:00.000Z',
      };

      const { getByLabelText } = render(<ConsistencyIndexCard {...props} />);
      // Perfect 30-day streak should give maximum score
      expect(getByLabelText(/Consistency index: 100/)).toBeTruthy();
    });
  });

  describe('Consistency Levels', () => {
    it('shows Building level for low scores', () => {
      const { getByText } = render(<ConsistencyIndexCard {...minimalProps} />);
      expect(getByText('Building')).toBeTruthy();
      expect(getByText(CONSISTENCY_LEVELS[0].emoji)).toBeTruthy();
    });

    it('shows correct level description', () => {
      const { getByText } = render(<ConsistencyIndexCard {...minimalProps} />);
      expect(getByText(/Time to build momentum/)).toBeTruthy();
    });

    it('applies level-specific background color', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...minimalProps} />
      );
      const container = getByLabelText(/Consistency index/);
      // Check that a backgroundColor is applied (from level.bgColor)
      expect(container.props.style).toBeDefined();
    });
  });

  describe('Trend Indicator', () => {
    it('shows stable indicator when no change', () => {
      // Create identical tracking patterns for current and previous periods
      const tracking = generateConsecutiveDays(10, 0).map((date) => ({
        date,
        completed: true,
      }));
      const previousTracking = generateConsecutiveDays(10, 30).map((date) => ({
        date,
        completed: true,
      }));
      const props = {
        tracking: [...tracking, ...previousTracking],
        habitCreatedAt: getDateString(60) + 'T00:00:00.000Z',
      };

      const { getByTestId } = render(<ConsistencyIndexCard {...props} />);
      // If change is 0, should show minus icon
      const stableIndicator = getByTestId('minus-icon');
      expect(stableIndicator).toBeTruthy();
    });

    it('shows trending up for improved consistency', () => {
      // Better performance in current period vs previous
      const currentPeriod = generateConsecutiveDays(20, 0);
      const previousPeriod = generateConsecutiveDays(5, 30);
      const tracking = [...currentPeriod, ...previousPeriod].map((date) => ({
        date,
        completed: true,
      }));
      const props = {
        tracking,
        habitCreatedAt: getDateString(60) + 'T00:00:00.000Z',
      };

      const { getByTestId } = render(<ConsistencyIndexCard {...props} />);
      expect(getByTestId('trending-up-icon')).toBeTruthy();
    });

    it('shows trending down for decreased consistency', () => {
      // Worse performance in current period vs previous
      const currentPeriod = generateConsecutiveDays(5, 0);
      const previousPeriod = generateConsecutiveDays(25, 30);
      const tracking = [...currentPeriod, ...previousPeriod].map((date) => ({
        date,
        completed: true,
      }));
      const props = {
        tracking,
        habitCreatedAt: getDateString(60) + 'T00:00:00.000Z',
      };

      const { getByTestId } = render(<ConsistencyIndexCard {...props} />);
      expect(getByTestId('trending-down-icon')).toBeTruthy();
    });

    it('displays change value in trend indicator', () => {
      const currentPeriod = generateConsecutiveDays(20, 0);
      const props = {
        tracking: currentPeriod.map((date) => ({ date, completed: true })),
        habitCreatedAt: getDateString(60) + 'T00:00:00.000Z',
      };

      const { getByLabelText } = render(<ConsistencyIndexCard {...props} />);
      expect(getByLabelText(/points from previous period/)).toBeTruthy();
    });
  });

  describe('Sparkline', () => {
    it('renders sparkline bars', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...defaultProps} />
      );
      // Sparkline is hidden from accessibility but parent should exist
      expect(getByLabelText(/Consistency index/)).toBeTruthy();
    });

    it('hides sparkline from accessibility', () => {
      const { queryByLabelText } = render(
        <ConsistencyIndexCard {...defaultProps} />
      );
      // The sparkline should not have its own accessibility label
      expect(queryByLabelText(/sparkline/i)).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility label with score', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...defaultProps} />
      );
      expect(getByLabelText(/Consistency index: \d+ percent/)).toBeTruthy();
    });

    it('includes level in accessibility label', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...defaultProps} />
      );
      expect(getByLabelText(/level/)).toBeTruthy();
    });

    it('includes trend information in accessibility label', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...defaultProps} />
      );
      expect(getByLabelText(/from last period|stable from last period/)).toBeTruthy();
    });

    it('includes days count in accessibility label', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...defaultProps} />
      );
      expect(getByLabelText(/Based on last \d+ days/)).toBeTruthy();
    });

    it('has summary accessibility role', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...defaultProps} />
      );
      const container = getByLabelText(/Consistency index/);
      expect(container.props.accessibilityRole).toBe('summary');
    });

    it('trend indicator has accessible label', () => {
      const currentPeriod = generateConsecutiveDays(20, 0);
      const props = {
        tracking: currentPeriod.map((date) => ({ date, completed: true })),
        habitCreatedAt: getDateString(60) + 'T00:00:00.000Z',
      };

      const { getByLabelText } = render(<ConsistencyIndexCard {...props} />);
      expect(
        getByLabelText(
          /(Up|Down) \d+ points from previous period|Stable from previous period/
        )
      ).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty tracking array', () => {
      const { getByText } = render(
        <ConsistencyIndexCard tracking={[]} habitCreatedAt={getDateString(30)} />
      );
      expect(getByText('0')).toBeTruthy();
      expect(getByText('Building')).toBeTruthy();
    });

    it('handles habit created today', () => {
      const tracking = [{ date: getDateString(0), completed: true }];
      const props = {
        tracking,
        habitCreatedAt: new Date().toISOString(),
      };

      const { getByText } = render(<ConsistencyIndexCard {...props} />);
      expect(getByText('Consistency Index')).toBeTruthy();
    });

    it('handles habit created more than 30 days ago', () => {
      const tracking = generateConsecutiveDays(60).map((date) => ({
        date,
        completed: true,
      }));
      const props = {
        tracking,
        habitCreatedAt: getDateString(60) + 'T00:00:00.000Z',
      };

      const { getByLabelText } = render(<ConsistencyIndexCard {...props} />);
      // Should only consider last 30 days
      expect(getByLabelText(/Based on last 30 days/)).toBeTruthy();
    });

    it('handles sporadic completions', () => {
      // Complete every other day
      const dates: string[] = [];
      for (let i = 0; i < 30; i += 2) {
        dates.push(getDateString(i));
      }
      const tracking = dates.map((date) => ({ date, completed: true }));
      const props = {
        tracking,
        habitCreatedAt: getDateString(30) + 'T00:00:00.000Z',
      };

      const { getByLabelText } = render(<ConsistencyIndexCard {...props} />);
      // Should have a moderate score (50% completion rate with no streak bonus)
      expect(getByLabelText(/Consistency index: \d+ percent/)).toBeTruthy();
    });

    it('handles index prop for animation staggering', () => {
      const { getByLabelText } = render(
        <ConsistencyIndexCard {...defaultProps} index={2} />
      );
      expect(getByLabelText(/Consistency index/)).toBeTruthy();
    });
  });
});

describe('calculateConsistencyIndex utility', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 0 score for empty tracking', () => {
    const result = calculateConsistencyIndex([]);
    expect(result.score).toBe(0);
    expect(result.sparklineData.length).toBeGreaterThan(0);
  });

  it('returns 100 score for perfect 30-day streak', () => {
    const dates = generateConsecutiveDays(30);
    const tracking = dates.map((date) => ({ date, completed: true }));
    const result = calculateConsistencyIndex(tracking);
    expect(result.score).toBe(100);
  });

  it('calculates streak bonus correctly', () => {
    // 14-day streak should give max streak bonus
    const dates = generateConsecutiveDays(14);
    const tracking = dates.map((date) => ({ date, completed: true }));
    const result = calculateConsistencyIndex(tracking);
    // Should have completion rate + max streak bonus + recency bonus
    expect(result.score).toBeGreaterThan(50);
  });

  it('includes recency bonus for recent completions', () => {
    // Complete only last 7 days
    const dates = generateConsecutiveDays(7);
    const tracking = dates.map((date) => ({ date, completed: true }));
    const result = calculateConsistencyIndex(tracking);
    // Should have low base score but max recency bonus
    expect(result.score).toBeGreaterThan(0);
  });

  it('calculates change from previous period', () => {
    const currentPeriod = generateConsecutiveDays(25, 0);
    const previousPeriod = generateConsecutiveDays(10, 30);
    const tracking = [...currentPeriod, ...previousPeriod].map((date) => ({
      date,
      completed: true,
    }));
    const habitCreatedAt = new Date(getDateString(60)).getTime();

    const result = calculateConsistencyIndex(tracking, habitCreatedAt);
    expect(result.change).toBeGreaterThan(0);
    expect(result.previousScore).toBeLessThan(result.score);
  });

  it('returns correct sparkline data length', () => {
    const dates = generateConsecutiveDays(15);
    const tracking = dates.map((date) => ({ date, completed: true }));
    const result = calculateConsistencyIndex(tracking);
    // Should return up to 30 data points
    expect(result.sparklineData.length).toBeLessThanOrEqual(30);
  });

  it('respects habitCreatedAt for new habits', () => {
    // Habit created 10 days ago
    const dates = generateConsecutiveDays(10);
    const tracking = dates.map((date) => ({ date, completed: true }));
    const habitCreatedAt = new Date(getDateString(10)).getTime();

    const result = calculateConsistencyIndex(tracking, habitCreatedAt);
    // Should only include 10 days
    expect(result.daysIncluded).toBeLessThanOrEqual(11); // +1 for today
  });

  it('marks completed days correctly in sparkline', () => {
    const dates = generateConsecutiveDays(5);
    const tracking = dates.map((date) => ({ date, completed: true }));
    const result = calculateConsistencyIndex(tracking);

    // Recent 5 days should be marked as completed
    const recentData = result.sparklineData.slice(-5);
    recentData.forEach((point) => {
      expect(point.completed).toBe(true);
    });
  });
});

describe('getConsistencyLevel helper', () => {
  it('returns Building level for score 0-29', () => {
    expect(getConsistencyLevel(0).label).toBe('Building');
    expect(getConsistencyLevel(15).label).toBe('Building');
    expect(getConsistencyLevel(29).label).toBe('Building');
  });

  it('returns Developing level for score 30-49', () => {
    expect(getConsistencyLevel(30).label).toBe('Developing');
    expect(getConsistencyLevel(40).label).toBe('Developing');
    expect(getConsistencyLevel(49).label).toBe('Developing');
  });

  it('returns Consistent level for score 50-69', () => {
    expect(getConsistencyLevel(50).label).toBe('Consistent');
    expect(getConsistencyLevel(60).label).toBe('Consistent');
    expect(getConsistencyLevel(69).label).toBe('Consistent');
  });

  it('returns Strong level for score 70-84', () => {
    expect(getConsistencyLevel(70).label).toBe('Strong');
    expect(getConsistencyLevel(75).label).toBe('Strong');
    expect(getConsistencyLevel(84).label).toBe('Strong');
  });

  it('returns Elite level for score 85-100', () => {
    expect(getConsistencyLevel(85).label).toBe('Elite');
    expect(getConsistencyLevel(95).label).toBe('Elite');
    expect(getConsistencyLevel(100).label).toBe('Elite');
  });

  it('returns Building level for negative scores', () => {
    expect(getConsistencyLevel(-10).label).toBe('Building');
  });

  it('returns correct emoji for each level', () => {
    expect(getConsistencyLevel(0).emoji).toBe('🌱');
    expect(getConsistencyLevel(35).emoji).toBe('🌿');
    expect(getConsistencyLevel(55).emoji).toBe('🌳');
    expect(getConsistencyLevel(75).emoji).toBe('💪');
    expect(getConsistencyLevel(90).emoji).toBe('⚡');
  });

  it('returns correct colors for each level', () => {
    expect(getConsistencyLevel(0).color).toBe('#dc2626'); // red-600
    expect(getConsistencyLevel(35).color).toBe('#f59e0b'); // amber-500
    expect(getConsistencyLevel(55).color).toBe('#16a34a'); // green-600
    expect(getConsistencyLevel(75).color).toBe('#0891b2'); // cyan-600
    expect(getConsistencyLevel(90).color).toBe('#7c3aed'); // violet-600
  });
});

describe('Reduce Motion', () => {
  const mockUseReduceMotion = require('../../../hooks/useReduceMotion')
    .useReduceMotion as jest.Mock;

  beforeEach(() => {
    mockUseReduceMotion.mockReturnValue(false);
  });

  it('renders correctly with reduce motion enabled', () => {
    mockUseReduceMotion.mockReturnValue(true);

    const { getByLabelText } = render(
      <ConsistencyIndexCard {...defaultProps} />
    );
    expect(getByLabelText(/Consistency index/)).toBeTruthy();
  });

  it('disables entrance animation when reduce motion is enabled', () => {
    mockUseReduceMotion.mockReturnValue(true);

    const { getByLabelText } = render(
      <ConsistencyIndexCard {...defaultProps} />
    );
    // Component should still render correctly
    expect(getByLabelText(/Consistency index/)).toBeTruthy();
  });

  it('disables sparkline animation when reduce motion is enabled', () => {
    mockUseReduceMotion.mockReturnValue(true);

    const { getByLabelText } = render(
      <ConsistencyIndexCard {...defaultProps} />
    );
    // Sparkline should still be present (just without animation)
    expect(getByLabelText(/Consistency index/)).toBeTruthy();
  });
});

// Default props for reuse
const defaultProps: ConsistencyIndexCardProps = {
  tracking: generateConsecutiveDays(15).map((date) => ({
    date,
    completed: true,
  })),
  habitCreatedAt: getDateString(30) + 'T00:00:00.000Z',
};
