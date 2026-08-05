/**
 * YourProgressCard Component Tests
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { YourProgressCard } from '../YourProgressCard';

// Mock AccessibilityInfo
jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockImplementation(
  () => Promise.resolve(false)
);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');

  const Animated = {
    View,
    Text: require('react-native').Text,
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
    Easing: {
      out: () => () => 0,
      cubic: () => 0,
    },
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
  };
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  const Svg = ({ children, ...props }: { children?: React.ReactNode; [key: string]: unknown }) =>
    React.createElement(View, { testID: 'svg', ...props }, children);
  const Circle = (props: { [key: string]: unknown }) =>
    React.createElement(View, { testID: 'circle', ...props });

  return {
    __esModule: true,
    default: Svg,
    Svg,
    Circle,
  };
});

describe('YourProgressCard', () => {
  const defaultProps = {
    strength: 45,
    weeklyChange: 5,
    actionableTip: 'Focus on Monday & Friday to level up!',
    onInfoPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByText } = render(<YourProgressCard {...defaultProps} />);
    expect(getByText('Your Progress')).toBeTruthy();
  });

  it('displays the actionable tip', () => {
    const { getByText } = render(<YourProgressCard {...defaultProps} />);
    expect(getByText(defaultProps.actionableTip)).toBeTruthy();
  });

  it('displays level label based on strength', () => {
    const { getByText } = render(<YourProgressCard {...defaultProps} strength={45} />);
    expect(getByText('Developing')).toBeTruthy();
  });

  it('displays Starting Out for low strength', () => {
    const { getByText } = render(<YourProgressCard {...defaultProps} strength={10} />);
    expect(getByText('Starting Out')).toBeTruthy();
  });

  it('displays Building for 20-40% strength', () => {
    const { getByText } = render(<YourProgressCard {...defaultProps} strength={30} />);
    expect(getByText('Building')).toBeTruthy();
  });

  it('displays Strong for 60-80% strength', () => {
    const { getByText } = render(<YourProgressCard {...defaultProps} strength={70} />);
    expect(getByText('Strong')).toBeTruthy();
  });

  it('displays Automatic for 80%+ strength', () => {
    const { getByText } = render(<YourProgressCard {...defaultProps} strength={85} />);
    expect(getByText('Automatic')).toBeTruthy();
  });

  it('calls onInfoPress when info button is pressed', () => {
    const mockOnInfoPress = jest.fn();
    const { getByLabelText } = render(
      <YourProgressCard {...defaultProps} onInfoPress={mockOnInfoPress} />
    );

    const infoButton = getByLabelText('Learn about habit strength');
    fireEvent.press(infoButton);

    expect(mockOnInfoPress).toHaveBeenCalledTimes(1);
  });

  it('shows positive trend indicator for positive weeklyChange', () => {
    const { getByText } = render(
      <YourProgressCard {...defaultProps} weeklyChange={5} />
    );
    expect(getByText('+5%')).toBeTruthy();
  });

  it('shows negative trend indicator for negative weeklyChange', () => {
    const { getByText } = render(
      <YourProgressCard {...defaultProps} weeklyChange={-3} />
    );
    expect(getByText('-3%')).toBeTruthy();
  });

  it('shows Stable indicator for zero weeklyChange', () => {
    const { getByText } = render(
      <YourProgressCard {...defaultProps} weeklyChange={0} />
    );
    expect(getByText('Stable')).toBeTruthy();
  });

  it('shows progress to next level when not at max', () => {
    const { getByText } = render(
      <YourProgressCard {...defaultProps} strength={45} />
    );
    // Should show distance to Strong level (60%)
    expect(getByText(/to.*Strong/)).toBeTruthy();
  });

  it('does not show next level when at Automatic (80%+)', () => {
    const { queryByText } = render(
      <YourProgressCard {...defaultProps} strength={85} />
    );
    // Should not show "to next level" text
    expect(queryByText(/% to/)).toBeNull();
  });

  it('has proper accessibility label', () => {
    const { getByLabelText } = render(<YourProgressCard {...defaultProps} strength={45} />);
    const summary = getByLabelText(/Habit strength at 45%.*Developing/);
    expect(summary).toBeTruthy();
  });

  it('displays emoji markers for progress bar', () => {
    const { getAllByText } = render(<YourProgressCard {...defaultProps} />);
    // 🌳 appears twice (in progress ring and in markers)
    expect(getAllByText('🌱').length).toBeGreaterThan(0);
    expect(getAllByText('🌿').length).toBeGreaterThan(0);
    expect(getAllByText('🌳').length).toBeGreaterThan(0);
    expect(getAllByText('💪').length).toBeGreaterThan(0);
    expect(getAllByText('⚡').length).toBeGreaterThan(0);
  });

  it('clamps strength value to 0-100 range', () => {
    const { getByLabelText } = render(
      <YourProgressCard {...defaultProps} strength={150} />
    );
    const summary = getByLabelText(/Habit strength at 100%/);
    expect(summary).toBeTruthy();
  });

  it('handles negative strength value', () => {
    const { getByLabelText } = render(
      <YourProgressCard {...defaultProps} strength={-10} />
    );
    const summary = getByLabelText(/Habit strength at 0%/);
    expect(summary).toBeTruthy();
  });
});
