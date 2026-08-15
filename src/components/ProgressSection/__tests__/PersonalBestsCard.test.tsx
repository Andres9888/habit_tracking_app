/**
 * PersonalBestsCard Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { PersonalBestsCard } from '../PersonalBestsCard';
import type { StreakRecord, DayStats } from '../types';

// Mock AccessibilityInfo
jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockImplementation(
  () => Promise.resolve(false)
);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');

  return {
    ...jest.requireActual('react-native-reanimated/mock'),
    createAnimatedComponent: (Component: React.ComponentType) => Component,
    useSharedValue: (initialValue: number) => ({ value: initialValue }),
    useAnimatedStyle: () => ({}),
    withRepeat: (value: number) => value,
    withSequence: (value: number) => value,
    withTiming: (value: number) => value,
    Easing: {
      inOut: () => () => 0,
      ease: () => 0,
    },
    FadeIn: {
      delay: () => ({
        duration: () => ({}),
      }),
    },
  };
});

describe('PersonalBestsCard', () => {
  const createStreakRecord = (
    days: number,
    startDate: string,
    isCurrent: boolean = false
  ): StreakRecord => ({
    days,
    startDate,
    endDate: startDate, // Simplified for tests
    isCurrent,
  });

  const createDayStats = (
    day: string,
    dayIndex: number,
    rate: number
  ): DayStats => ({
    day,
    dayIndex,
    rate,
    completed: Math.round(rate / 10),
    total: 10,
  });

  const defaultProps = {
    streakRecords: [
      createStreakRecord(14, '2024-11-01'),
      createStreakRecord(10, '2024-10-01'),
      createStreakRecord(7, '2024-09-01'),
    ],
    currentStreak: 5,
    bestDay: createDayStats('Mon', 1, 90),
    worstDay: createDayStats('Sat', 6, 40),
    onWorstDayPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<PersonalBestsCard {...defaultProps} />);
    expect(getByText('Personal Bests')).toBeTruthy();
  });

  it('displays current streak when active', () => {
    const { getByLabelText } = render(<PersonalBestsCard {...defaultProps} currentStreak={5} />);
    expect(getByLabelText(/current streak 5 days/)).toBeTruthy();
  });

  it('hides current streak section when streak is 0', () => {
    const { queryByText } = render(<PersonalBestsCard {...defaultProps} currentStreak={0} />);
    expect(queryByText('Current Streak')).toBeNull();
    expect(queryByText('NOW 🔥')).toBeNull();
  });

  it('displays top 3 streak medals', () => {
    const { getByText } = render(<PersonalBestsCard {...defaultProps} />);
    expect(getByText('🥇')).toBeTruthy();
    expect(getByText('🥈')).toBeTruthy();
    expect(getByText('🥉')).toBeTruthy();
  });

  it('displays streak days in medals', () => {
    const { getByText } = render(<PersonalBestsCard {...defaultProps} />);
    expect(getByText('14')).toBeTruthy(); // First record
    expect(getByText('10')).toBeTruthy(); // Second record
    expect(getByText('7')).toBeTruthy(); // Third record
  });

  it('shows hint medals when fewer than 3 records', () => {
    const propsWithFewRecords = {
      ...defaultProps,
      streakRecords: [createStreakRecord(7, '2024-11-01')],
    };

    const { getAllByText } = render(<PersonalBestsCard {...propsWithFewRecords} />);
    // Should show one real medal and two hints with '-'
    const dashes = getAllByText('-');
    expect(dashes.length).toBe(2);
  });

  it('displays best day card', () => {
    const { getByText } = render(<PersonalBestsCard {...defaultProps} />);
    expect(getByText('Best Day')).toBeTruthy();
    expect(getByText('Mon')).toBeTruthy();
    expect(getByText('90% success')).toBeTruthy();
  });

  it('displays focus on (worst day) card', () => {
    const { getByText } = render(<PersonalBestsCard {...defaultProps} />);
    expect(getByText('Focus On')).toBeTruthy();
    expect(getByText('Sat')).toBeTruthy();
    expect(getByText('40% • tap for tips')).toBeTruthy();
  });

  it('calls onWorstDayPress when worst day card is pressed', () => {
    const mockOnPress = jest.fn();
    const { getByLabelText } = render(
      <PersonalBestsCard {...defaultProps} onWorstDayPress={mockOnPress} />
    );

    const worstDayCard = getByLabelText(/Focus on Sat/);
    fireEvent.press(worstDayCard);

    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('still shows best/worst cards when worstDay rate >= bestDay rate', () => {
    const propsWithSameRates = {
      ...defaultProps,
      bestDay: createDayStats('Mon', 1, 80),
      worstDay: createDayStats('Sat', 6, 80), // Same as best
    };

    const { getByText } = render(<PersonalBestsCard {...propsWithSameRates} />);
    expect(getByText('Best Day')).toBeTruthy();
    expect(getByText('Focus On')).toBeTruthy();
  });

  it('shows empty state when no records and no streak', () => {
    const emptyProps = {
      ...defaultProps,
      streakRecords: [],
      currentStreak: 0,
    };

    const { getByText } = render(<PersonalBestsCard {...emptyProps} />);
    expect(getByText('Complete 2+ consecutive days to start tracking streaks')).toBeTruthy();
  });

  it('has proper accessibility labels for streak records', () => {
    const { getByLabelText } = render(<PersonalBestsCard {...defaultProps} />);

    expect(getByLabelText(/First best streak: 14 days/)).toBeTruthy();
    expect(getByLabelText(/Second best streak: 10 days/)).toBeTruthy();
    expect(getByLabelText(/Third best streak: 7 days/)).toBeTruthy();
  });

  it('has proper accessibility for worst day card', () => {
    const { getByRole } = render(<PersonalBestsCard {...defaultProps} />);
    const worstDayButton = getByRole('button');
    expect(worstDayButton.props.accessibilityHint).toBe('Opens tips to improve this day');
  });

  it('marks current streak in medal row when it matches a record', () => {
    const propsWithCurrentRecord = {
      ...defaultProps,
      streakRecords: [
        { days: 14, startDate: '2024-11-01', endDate: '2024-11-14', isCurrent: false },
        { days: 10, startDate: '2024-10-01', endDate: '2024-10-10', isCurrent: false },
        { days: 5, startDate: '2024-12-01', endDate: '2024-12-05', isCurrent: true },
      ],
      currentStreak: 5,
    };

    const { getAllByLabelText } = render(<PersonalBestsCard {...propsWithCurrentRecord} />);
    // Should have at least one element with "current streak" in label
    const currentStreakElements = getAllByLabelText(/current streak/i);
    expect(currentStreakElements.length).toBeGreaterThan(0);
  });
});
