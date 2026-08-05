/**
 * HeroStrengthSection Component Tests
 *
 * Tests for the hero section displaying the main habit strength progress ring
 * with level information and trend indicator.
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';
import { HeroStrengthSection } from '../HeroStrengthSection';

// Mock AccessibilityInfo
jest
  .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
  .mockImplementation(() => Promise.resolve(false));

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
    useAnimatedProps: () => ({}),
    useAnimatedStyle: () => ({}),
    useDerivedValue: () => ({ value: '0%' }),
    withTiming: (value: number) => value,
    withDelay: (_delay: number, value: number) => value,
    withSpring: (value: number) => value,
    Easing: {
      ...jest.requireActual('react-native-reanimated/mock').Easing,
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

describe('HeroStrengthSection', () => {
  const defaultProps = {
    strength: 45,
    weeklyChange: 5,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { getByLabelText } = render(
      <HeroStrengthSection {...defaultProps} />
    );
    // Verify the main container renders with accessibility label
    expect(getByLabelText(/Habit strength at/)).toBeTruthy();
  });

  describe('Level Display', () => {
    it('displays Starting Out for 0-20% strength', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={10} />
      );
      expect(getByText('Starting Out')).toBeTruthy();
      expect(getByText('Just getting started')).toBeTruthy();
    });

    it('displays Building for 20-40% strength', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={30} />
      );
      expect(getByText('Building')).toBeTruthy();
      expect(getByText('Building momentum')).toBeTruthy();
    });

    it('displays Growing for 40-60% strength', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={50} />
      );
      expect(getByText('Growing')).toBeTruthy();
      expect(getByText('Habit is taking root')).toBeTruthy();
    });

    it('displays Strong for 60-80% strength', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={70} />
      );
      expect(getByText('Strong')).toBeTruthy();
      expect(getByText('Solid consistency')).toBeTruthy();
    });

    it('displays Unbreakable for 80%+ strength', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={85} />
      );
      expect(getByText('Unbreakable')).toBeTruthy();
      expect(getByText('Habit mastery achieved')).toBeTruthy();
    });
  });

  describe('Trend Indicator', () => {
    it('shows positive trend indicator for positive weeklyChange', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} weeklyChange={5} />
      );
      expect(getByText('+5%')).toBeTruthy();
    });

    it('shows negative trend indicator for negative weeklyChange', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} weeklyChange={-3} />
      );
      expect(getByText('-3%')).toBeTruthy();
    });

    it('shows Stable indicator for zero weeklyChange', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} weeklyChange={0} />
      );
      expect(getByText('Stable')).toBeTruthy();
    });

    it('shows Stable indicator when weeklyChange is undefined', () => {
      const { getByText } = render(<HeroStrengthSection strength={45} />);
      expect(getByText('Stable')).toBeTruthy();
    });
  });

  describe('Progress to Next Level', () => {
    it('shows progress to next level when not at max', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={17} />
      );
      // At 17%, should show 3% to Building (🌿)
      expect(getByText(/3% to 🌿/)).toBeTruthy();
    });

    it('shows progress to Growing level from Building', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={30} />
      );
      // At 30%, should show 10% to Growing (🌳)
      expect(getByText(/10% to 🌳/)).toBeTruthy();
    });

    it('shows Max level message when at Unbreakable (80%+)', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={85} />
      );
      // Should show max level indicator
      expect(getByText(/Max level!/)).toBeTruthy();
    });
  });

  describe('Strength Clamping', () => {
    it('clamps strength value to 100 for values over 100', () => {
      const { getByLabelText } = render(
        <HeroStrengthSection {...defaultProps} strength={150} />
      );
      const summary = getByLabelText(/Habit strength at 100 percent/);
      expect(summary).toBeTruthy();
    });

    it('clamps strength value to 0 for negative values', () => {
      const { getByLabelText } = render(
        <HeroStrengthSection {...defaultProps} strength={-10} />
      );
      const summary = getByLabelText(/Habit strength at 0 percent/);
      expect(summary).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility label with strength and level', () => {
      const { getByLabelText } = render(
        <HeroStrengthSection {...defaultProps} strength={45} weeklyChange={0} />
      );
      const summary = getByLabelText(
        /Habit strength at 45 percent.*Growing level/
      );
      expect(summary).toBeTruthy();
    });

    it('includes weekly change direction in accessibility label', () => {
      const { getByLabelText } = render(
        <HeroStrengthSection {...defaultProps} strength={45} weeklyChange={5} />
      );
      const summary = getByLabelText(/up 5 percent this week/);
      expect(summary).toBeTruthy();
    });

    it('includes negative change in accessibility label', () => {
      const { getByLabelText } = render(
        <HeroStrengthSection
          {...defaultProps}
          strength={45}
          weeklyChange={-3}
        />
      );
      const summary = getByLabelText(/down 3 percent this week/);
      expect(summary).toBeTruthy();
    });

    it('trend indicator has proper accessibility labels', () => {
      const { getByLabelText } = render(
        <HeroStrengthSection {...defaultProps} weeklyChange={5} />
      );
      expect(getByLabelText('Up 5 percent this week')).toBeTruthy();
    });

    it('negative trend has proper accessibility label', () => {
      const { getByLabelText } = render(
        <HeroStrengthSection {...defaultProps} weeklyChange={-3} />
      );
      expect(getByLabelText('Down 3 percent this week')).toBeTruthy();
    });

    it('stable trend has proper accessibility label', () => {
      const { getByLabelText } = render(
        <HeroStrengthSection {...defaultProps} weeklyChange={0} />
      );
      expect(getByLabelText('Stable this week')).toBeTruthy();
    });
  });

  describe('Visual Elements', () => {
    it('renders SVG progress ring', () => {
      const { getByTestId } = render(<HeroStrengthSection {...defaultProps} />);
      expect(getByTestId('svg')).toBeTruthy();
    });

    it('renders both background and progress circles', () => {
      const { getAllByTestId } = render(
        <HeroStrengthSection {...defaultProps} />
      );
      // Should have 2 circles: background track + progress arc
      expect(getAllByTestId('circle').length).toBe(2);
    });

    it('displays level emoji based on strength', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={10} />
      );
      // Starting Out level should show 🌱
      expect(getByText('🌱')).toBeTruthy();
    });

    it('displays correct emoji for Building level', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={30} />
      );
      expect(getByText('🌿')).toBeTruthy();
    });

    it('displays correct emoji for Unbreakable level', () => {
      const { getByText } = render(
        <HeroStrengthSection {...defaultProps} strength={90} />
      );
      expect(getByText('⚡')).toBeTruthy();
    });
  });

  describe('reduceMotion Support', () => {
    it('respects reduceMotion preference', async () => {
      jest
        .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
        .mockImplementation(() => Promise.resolve(true));

      const { getByLabelText } = render(
        <HeroStrengthSection {...defaultProps} />
      );
      // Component should still render correctly with reduced motion
      expect(getByLabelText(/Habit strength at/)).toBeTruthy();
    });
  });
});
