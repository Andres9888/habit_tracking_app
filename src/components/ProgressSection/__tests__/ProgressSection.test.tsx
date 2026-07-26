/**
 * ProgressSection Integration Tests
 *
 * Tests for the main ProgressSection container component
 * that integrates YourProgressCard, PersonalBestsCard, and ThisMonthCard.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { ProgressSection } from '../ProgressSection';
import type { HabitTrackingEntry } from '../../../features/habits/types';

// Mock AccessibilityInfo
jest
  .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
  .mockImplementation(() => Promise.resolve(false));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text } = require('react-native');
  const Reanimated = require('react-native-reanimated/mock');

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
    useAnimatedProps: () => ({}),
    useAnimatedStyle: () => ({}),
    useDerivedValue: () => ({ value: '0%' }),
    withTiming: (value: number) => value,
    withDelay: (_delay: number, value: number) => value,
    withSpring: (value: number) => value,
    withRepeat: (value: number) => value,
    withSequence: (value: number) => value,
    Easing: Reanimated.Easing,
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    FadeInDown: Reanimated.FadeInDown,
    FadeIn: Reanimated.FadeIn,
  };
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  const Svg = ({
    children,
    ...props
  }: {
    children?: React.ReactNode;
    [key: string]: unknown;
  }) => React.createElement(View, { testID: 'svg', ...props }, children);
  const Circle = (props: { [key: string]: unknown }) =>
    React.createElement(View, { testID: 'circle', ...props });

  return {
    __esModule: true,
    default: Svg,
    Svg,
    Circle,
  };
});

// Helper to create tracking entries
function createTrackingEntry(
  date: string,
  completed: boolean
): HabitTrackingEntry {
  return {
    date,
    completed,
    timestamp: new Date(date).getTime(),
  };
}

// Create mock tracking data
function createMockTrackingData(daysBack: number = 30): HabitTrackingEntry[] {
  const entries: HabitTrackingEntry[] = [];
  const today = new Date();

  for (let i = 0; i < daysBack; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    // Random completion pattern (70% completion rate)
    const completed = Math.random() < 0.7;
    entries.push(
      createTrackingEntry(date.toISOString().split('T')[0], completed)
    );
  }

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}

describe('ProgressSection Integration', () => {
  const mockTracking = createMockTrackingData(30);

  const defaultProps = {
    tracking: mockTracking,
    habitCreatedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).getTime(),
    strength: 55,
    weeklyChange: 8,
    onInfoPress: jest.fn(),
    onWorstDayPress: jest.fn(),
    onSeeAllPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all three sections with sufficient data', () => {
    const { getByText } = render(<ProgressSection {...defaultProps} />);

    // YourProgressCard
    expect(getByText('Your Progress')).toBeTruthy();

    // PersonalBestsCard
    expect(getByText('Personal Bests')).toBeTruthy();

    // ThisMonthCard
    expect(getByText('This Month')).toBeTruthy();
  });

  it('renders only YourProgressCard with insufficient data (< 7 days)', () => {
    const fewDaysTracking = createMockTrackingData(5);
    const props = {
      ...defaultProps,
      tracking: fewDaysTracking,
    };

    const { getByText, queryByText } = render(<ProgressSection {...props} />);

    expect(getByText('Your Progress')).toBeTruthy();
    expect(queryByText('Personal Bests')).toBeNull();
    expect(queryByText('This Month')).toBeNull();
  });

  it('shows actionable tip based on data patterns', () => {
    const { getByText } = render(<ProgressSection {...defaultProps} />);

    // Should show some actionable tip
    // The exact tip depends on the mock data pattern
    const tipSection = getByText('💡');
    expect(tipSection).toBeTruthy();
  });

  it('passes correct props to YourProgressCard', () => {
    const { getByText, getByLabelText } = render(
      <ProgressSection {...defaultProps} />
    );

    // Verify strength level is reflected
    expect(getByText('Developing')).toBeTruthy(); // 55% = Developing level

    // Verify weekly change is passed
    expect(getByText('+8%')).toBeTruthy();

    // Verify accessibility label contains strength info
    const summary = getByLabelText(/Habit strength at 55%/);
    expect(summary).toBeTruthy();
  });

  it('calculates and passes streak data to PersonalBestsCard', () => {
    // Create consistent tracking data with a known streak
    const today = new Date();
    const trackingWithStreak: HabitTrackingEntry[] = [];

    // Create a 5-day current streak
    for (let i = 0; i < 5; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      trackingWithStreak.push(
        createTrackingEntry(date.toISOString().split('T')[0], true)
      );
    }

    // Add a gap then another streak
    for (let i = 7; i < 10; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      trackingWithStreak.push(
        createTrackingEntry(date.toISOString().split('T')[0], true)
      );
    }

    const props = {
      ...defaultProps,
      tracking: trackingWithStreak,
    };

    const { getByLabelText, getByText } = render(
      <ProgressSection {...props} />
    );
    expect(
      getByLabelText(/Personal bests, current streak 5 days/)
    ).toBeTruthy();
    expect(getByText('NOW 🔥')).toBeTruthy();
  });

  it('calculates and passes day stats to ThisMonthCard', () => {
    const { getAllByText, getByText } = render(
      <ProgressSection {...defaultProps} />
    );

    // Should show completed days count in summary (may appear multiple times)
    expect(getAllByText(/days$/).length).toBeGreaterThan(0);

    // Should show trend comparison
    expect(getByText(/vs last month/)).toBeTruthy();
  });

  it('handles empty tracking array gracefully', () => {
    const props = {
      ...defaultProps,
      tracking: [],
    };

    const { getByText } = render(<ProgressSection {...props} />);

    // Should still show YourProgressCard
    expect(getByText('Your Progress')).toBeTruthy();
  });

  it('handles tracking with no completions', () => {
    const noCompletions = mockTracking.map((entry) => ({
      ...entry,
      completed: false,
    }));

    const props = {
      ...defaultProps,
      tracking: noCompletions,
    };

    // Should render without crashing
    const { getByText } = render(<ProgressSection {...props} />);
    expect(getByText('Your Progress')).toBeTruthy();
  });

  it('handles all completions', () => {
    const allCompleted = mockTracking.map((entry) => ({
      ...entry,
      completed: true,
    }));

    const props = {
      ...defaultProps,
      tracking: allCompleted,
    };

    const { getByText } = render(<ProgressSection {...props} />);

    // Should show encouraging message for good streak
    expect(getByText('Your Progress')).toBeTruthy();
  });

  it('updates computed values when tracking changes', () => {
    const { rerender, getByText } = render(
      <ProgressSection {...defaultProps} />
    );

    // Initial render
    expect(getByText('Developing')).toBeTruthy();

    // Update with stronger strength
    rerender(<ProgressSection {...defaultProps} strength={85} />);

    // Should reflect new strength level
    expect(getByText('Automatic')).toBeTruthy();
  });

  it('calculates best and worst days correctly', () => {
    // Create tracking with clear best/worst pattern
    const patternedTracking: HabitTrackingEntry[] = [];
    const today = new Date();

    // Make Mondays always complete, Saturdays never complete
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      const completed =
        dayOfWeek === 1 ? true : dayOfWeek === 6 ? false : Math.random() > 0.5;
      patternedTracking.push(
        createTrackingEntry(date.toISOString().split('T')[0], completed)
      );
    }

    const props = {
      ...defaultProps,
      tracking: patternedTracking,
    };

    const { getByText } = render(<ProgressSection {...props} />);

    // Should show Best Day and Focus On cards
    expect(getByText('Best Day')).toBeTruthy();
    expect(getByText('Focus On')).toBeTruthy();
  });

  it('triggers callbacks correctly', () => {
    const mockInfoPress = jest.fn();
    const mockWorstDayPress = jest.fn();
    const mockSeeAllPress = jest.fn();

    const props = {
      ...defaultProps,
      onInfoPress: mockInfoPress,
      onWorstDayPress: mockWorstDayPress,
      onSeeAllPress: mockSeeAllPress,
    };

    const { getByLabelText } = render(<ProgressSection {...props} />);

    // Test info button
    const infoButton = getByLabelText('Learn about habit strength');
    const { fireEvent } = require('@testing-library/react-native');
    fireEvent.press(infoButton);
    expect(mockInfoPress).toHaveBeenCalledTimes(1);
  });
});

describe('ProgressSection Data Flow', () => {
  it('correctly computes trend comparison from tracking data', () => {
    const today = new Date();
    const thisMonth = today.getMonth();
    const thisYear = today.getFullYear();

    const tracking: HabitTrackingEntry[] = [];

    // This month: 80% completion (8/10 days)
    for (let i = 1; i <= 10; i++) {
      const date = new Date(thisYear, thisMonth, i);
      if (date <= today) {
        tracking.push(
          createTrackingEntry(date.toISOString().split('T')[0], i <= 8)
        );
      }
    }

    // Last month: 50% completion (5/10 days)
    for (let i = 1; i <= 10; i++) {
      const date = new Date(thisYear, thisMonth - 1, i);
      tracking.push(
        createTrackingEntry(date.toISOString().split('T')[0], i <= 5)
      );
    }

    const props = {
      tracking,
      habitCreatedAt: new Date(thisYear, thisMonth - 1, 1).getTime(),
      strength: 60,
      weeklyChange: 10,
    };

    const { getByText } = render(<ProgressSection {...props} />);

    // Should show positive trend
    expect(getByText(/\+.*vs last month/)).toBeTruthy();
  });

  it('generates appropriate tip based on weak days', () => {
    // Create data where specific days are weak
    const today = new Date();
    const tracking: HabitTrackingEntry[] = [];

    for (let i = 0; i < 28; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayOfWeek = date.getDay();
      // Make Friday (5) and Saturday (6) weak
      const completed = dayOfWeek === 5 || dayOfWeek === 6 ? false : true;
      tracking.push(
        createTrackingEntry(date.toISOString().split('T')[0], completed)
      );
    }

    const props = {
      tracking,
      habitCreatedAt: Date.now() - 28 * 24 * 60 * 60 * 1000,
      strength: 70,
      weeklyChange: 0,
    };

    const { getByText } = render(<ProgressSection {...props} />);

    // Should suggest focusing on weak days
    expect(getByText(/Focus on/)).toBeTruthy();
  });
});
