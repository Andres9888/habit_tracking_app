/**
 * ThisMonthCard Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { ThisMonthCard } from '../ThisMonthCard';
import type { DayStats } from '../types';

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
    withDelay: (_: number, value: number) => value,
    withSpring: (value: number) => value,
    withTiming: (value: number) => value,
    FadeIn: {
      delay: () => ({
        duration: () => ({}),
      }),
    },
  };
});

describe('ThisMonthCard', () => {
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

  const defaultDayStats: DayStats[] = [
    createDayStats('Sun', 0, 70),
    createDayStats('Mon', 1, 85),
    createDayStats('Tue', 2, 90), // Best
    createDayStats('Wed', 3, 75),
    createDayStats('Thu', 4, 80),
    createDayStats('Fri', 5, 60),
    createDayStats('Sat', 6, 40), // Worst
  ];

  const defaultProps = {
    dayStats: defaultDayStats,
    thisMonthRate: 75,
    lastMonthRate: 60,
    completedDays: 18,
    totalDays: 24,
    onSeeAllPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<ThisMonthCard {...defaultProps} />);
    expect(getByText('This Month')).toBeTruthy();
  });

  it('displays all 7 day labels', () => {
    const { getAllByText } = render(<ThisMonthCard {...defaultProps} />);
    // S appears twice (Sun and Sat), T appears twice (Tue and Thu)
    expect(getAllByText('S').length).toBe(2);
    expect(getAllByText('M').length).toBe(1);
    expect(getAllByText('T').length).toBe(2);
    expect(getAllByText('W').length).toBe(1);
    expect(getAllByText('F').length).toBe(1);
  });

  it('displays day percentages', () => {
    const { getByText } = render(<ThisMonthCard {...defaultProps} />);
    expect(getByText('90%')).toBeTruthy(); // Best day
    expect(getByText('40%')).toBeTruthy(); // Worst day
  });

  it('displays positive trend with + sign', () => {
    const { getByText } = render(<ThisMonthCard {...defaultProps} />);
    expect(getByText('+15% vs last month')).toBeTruthy();
  });

  it('displays negative trend without + sign', () => {
    const propsWithNegativeTrend = {
      ...defaultProps,
      thisMonthRate: 50,
      lastMonthRate: 70,
    };

    const { getByText } = render(<ThisMonthCard {...propsWithNegativeTrend} />);
    expect(getByText('-20% vs last month')).toBeTruthy();
  });

  it('displays zero trend correctly', () => {
    const propsWithNoChange = {
      ...defaultProps,
      thisMonthRate: 70,
      lastMonthRate: 70,
    };

    const { getByText } = render(<ThisMonthCard {...propsWithNoChange} />);
    expect(getByText('0% vs last month')).toBeTruthy();
  });

  it('displays completed days count', () => {
    const { getByText } = render(<ThisMonthCard {...defaultProps} />);
    expect(getByText('18/24 days')).toBeTruthy();
  });

  it('displays See All button', () => {
    const { getByText } = render(<ThisMonthCard {...defaultProps} />);
    expect(getByText('See All')).toBeTruthy();
  });

  it('calls onSeeAllPress when See All is pressed', () => {
    const mockOnSeeAllPress = jest.fn();
    const { getByLabelText } = render(
      <ThisMonthCard {...defaultProps} onSeeAllPress={mockOnSeeAllPress} />
    );

    const seeAllButton = getByLabelText('See all analytics');
    fireEvent.press(seeAllButton);

    expect(mockOnSeeAllPress).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility label for the card', () => {
    const { getByLabelText } = render(<ThisMonthCard {...defaultProps} />);
    const card = getByLabelText(/This month: 18 of 24 days completed, 75% success rate/);
    expect(card).toBeTruthy();
  });

  it('has proper accessibility for day bars', () => {
    const { getByLabelText } = render(<ThisMonthCard {...defaultProps} />);

    // Check best day accessibility
    expect(getByLabelText(/T: 90% completion, best day/)).toBeTruthy();

    // Check worst day accessibility
    expect(getByLabelText(/S: 40% completion.*needs improvement/)).toBeTruthy();
  });

  it('renders correctly with all zero rates', () => {
    const zeroStats = defaultDayStats.map((d) => ({ ...d, rate: 0, total: 0 }));
    const propsWithZeros = {
      ...defaultProps,
      dayStats: zeroStats,
      thisMonthRate: 0,
      lastMonthRate: 0,
      completedDays: 0,
    };

    const { getByText } = render(<ThisMonthCard {...propsWithZeros} />);
    expect(getByText('0/24 days')).toBeTruthy();
    expect(getByText('0% vs last month')).toBeTruthy();
  });

  it('handles equal best and worst day rates', () => {
    const equalStats = defaultDayStats.map((d) => ({ ...d, rate: 75 }));
    const propsWithEqualRates = {
      ...defaultProps,
      dayStats: equalStats,
    };

    // Should not throw and should render
    const { getByText } = render(<ThisMonthCard {...propsWithEqualRates} />);
    expect(getByText('This Month')).toBeTruthy();
  });

  it('highlights best day bar differently', () => {
    const { getByLabelText } = render(<ThisMonthCard {...defaultProps} />);

    // Best day should have "best day" in accessibility label
    const bestDayBar = getByLabelText(/90%.*best day/);
    expect(bestDayBar).toBeTruthy();
  });

  it('highlights worst day bar differently when below threshold', () => {
    const { getByLabelText } = render(<ThisMonthCard {...defaultProps} />);

    // Worst day (40%) should have "needs improvement" in accessibility label
    const worstDayBar = getByLabelText(/40%.*needs improvement/);
    expect(worstDayBar).toBeTruthy();
  });
});
