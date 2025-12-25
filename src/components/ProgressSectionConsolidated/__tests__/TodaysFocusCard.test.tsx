/**
 * TodaysFocusCard Component Tests
 *
 * Tests for the Today's Focus Card component that provides
 * contextual motivation based on user's current progress.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { TodaysFocusCard } from '../TodaysFocusCard';
import type { TodaysFocusCardProps } from '../TodaysFocusCardTypes';

// Mock useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  __esModule: true,
  useReduceMotion: jest.fn(() => false),
  default: jest.fn(() => false),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const Animated = {
    View,
    Text,
    createAnimatedComponent: (Component: React.ComponentType) => {
      const AnimatedComponent = React.forwardRef((props: any, ref: any) =>
        React.createElement(Component, { ...props, ref })
      );
      AnimatedComponent.displayName = `Animated(${Component.displayName || Component.name || 'Component'})`;
      return AnimatedComponent;
    },
  };

  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    useSharedValue: (initialValue: number) => ({ value: initialValue }),
    useAnimatedStyle: () => ({}),
    withTiming: (value: number) => value,
    withDelay: (_delay: number, value: number) => value,
    withSpring: (value: number) => value,
    withRepeat: (animation: any) => animation,
    withSequence: (...animations: any[]) => animations[0],
    interpolate: (value: number, input: number[], output: number[]) =>
      output[0],
    Easing: {
      out: () => () => 0,
      inOut: () => () => 0,
      cubic: () => 0,
      ease: () => 0,
    },
  };
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    LinearGradient: ({ children, colors, ...props }: any) =>
      React.createElement(
        View,
        { testID: 'linear-gradient', colors, ...props },
        children
      ),
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

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Ionicons: (props: { name: string; color: string; size: number }) =>
      React.createElement(View, {
        testID: `ionicons-${props.name}`,
        ...props,
      }),
  };
});

describe('TodaysFocusCard', () => {
  // Default props for different states
  const baseProps: TodaysFocusCardProps = {
    currentStreak: 0,
    isCompletedToday: false,
    weeklyCompletion: 0,
    habitAge: 30,
    bestStreak: 0,
  };

  const thrivingProps: TodaysFocusCardProps = {
    currentStreak: 14,
    isCompletedToday: false,
    weeklyCompletion: 6,
    habitAge: 30,
    bestStreak: 21,
  };

  const buildingProps: TodaysFocusCardProps = {
    currentStreak: 5,
    isCompletedToday: false,
    weeklyCompletion: 4,
    habitAge: 30,
    bestStreak: 10,
  };

  const startingProps: TodaysFocusCardProps = {
    currentStreak: 2,
    isCompletedToday: false,
    weeklyCompletion: 2,
    habitAge: 5, // Less than 7 days old
    bestStreak: 2,
  };

  const strugglingProps: TodaysFocusCardProps = {
    currentStreak: 0,
    isCompletedToday: false,
    weeklyCompletion: 1,
    habitAge: 30,
    bestStreak: 3,
  };

  const recoveringProps: TodaysFocusCardProps = {
    currentStreak: 0,
    isCompletedToday: false,
    weeklyCompletion: 3,
    habitAge: 60,
    bestStreak: 21, // Greater than 7
  };

  const completedProps: TodaysFocusCardProps = {
    currentStreak: 10,
    isCompletedToday: true,
    weeklyCompletion: 5,
    habitAge: 30,
    bestStreak: 14,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByLabelText } = render(<TodaysFocusCard {...baseProps} />);
      expect(getByLabelText(/Today's focus:/)).toBeTruthy();
    });

    it('renders LinearGradient component', () => {
      const { getAllByTestId } = render(<TodaysFocusCard {...thrivingProps} />);
      // Multiple LinearGradient components: main background + shimmer overlay
      expect(getAllByTestId('linear-gradient').length).toBeGreaterThanOrEqual(
        1
      );
    });

    it('renders icon based on state', () => {
      const { UNSAFE_getByProps } = render(
        <TodaysFocusCard {...thrivingProps} />
      );
      // Icon is inside an accessibility-hidden container
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-locate-outline' })
      ).toBeTruthy();
    });
  });

  describe('State Detection - Thriving', () => {
    it('shows thriving state when streak >= 7 and weekly >= 5', () => {
      const { getByLabelText } = render(<TodaysFocusCard {...thrivingProps} />);
      expect(getByLabelText(/Complete today to hit 21 days!/)).toBeTruthy();
    });

    it('renders target icon in thriving state', () => {
      const { UNSAFE_getByProps } = render(
        <TodaysFocusCard {...thrivingProps} />
      );
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-locate-outline' })
      ).toBeTruthy();
    });

    it('calculates next milestone correctly for thriving', () => {
      const props = { ...thrivingProps, currentStreak: 25 };
      const { getByLabelText } = render(<TodaysFocusCard {...props} />);
      // Next milestone after 25 is 30
      expect(getByLabelText(/Complete today to hit 30 days!/)).toBeTruthy();
    });
  });

  describe('State Detection - Building', () => {
    it('shows building state when streak is 3-6', () => {
      const { getByLabelText } = render(<TodaysFocusCard {...buildingProps} />);
      expect(getByLabelText(/5 days strong - keep going!/)).toBeTruthy();
    });

    it('renders trending-up icon in building state', () => {
      const { UNSAFE_getByProps } = render(
        <TodaysFocusCard {...buildingProps} />
      );
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-trending-up-outline' })
      ).toBeTruthy();
    });
  });

  describe('State Detection - Starting', () => {
    it('shows starting state when habit age < 7 days', () => {
      const { getByLabelText } = render(<TodaysFocusCard {...startingProps} />);
      expect(getByLabelText(/3 days unlocks momentum!/)).toBeTruthy();
    });

    it('renders sparkles icon in starting state', () => {
      const { UNSAFE_getByProps } = render(
        <TodaysFocusCard {...startingProps} />
      );
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-sparkles-outline' })
      ).toBeTruthy();
    });
  });

  describe('State Detection - Struggling', () => {
    it('shows struggling state when streak = 0 and weekly < 3', () => {
      const { getByLabelText } = render(
        <TodaysFocusCard {...strugglingProps} />
      );
      expect(getByLabelText(/Every day is a fresh start!/)).toBeTruthy();
    });

    it('renders heart icon in struggling state', () => {
      const { UNSAFE_getByProps } = render(
        <TodaysFocusCard {...strugglingProps} />
      );
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-heart-outline' })
      ).toBeTruthy();
    });
  });

  describe('State Detection - Recovering', () => {
    it('shows recovering state when streak = 0 but bestStreak > 7', () => {
      const { getByLabelText } = render(
        <TodaysFocusCard {...recoveringProps} />
      );
      expect(
        getByLabelText(/You've done 21 before. Do it again!/)
      ).toBeTruthy();
    });

    it('renders refresh icon in recovering state', () => {
      const { UNSAFE_getByProps } = render(
        <TodaysFocusCard {...recoveringProps} />
      );
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-refresh-outline' })
      ).toBeTruthy();
    });
  });

  describe('State Detection - Completed', () => {
    it('shows completed state when isCompletedToday is true', () => {
      const { getByLabelText } = render(
        <TodaysFocusCard {...completedProps} />
      );
      expect(getByLabelText(/10 day streak and counting!/)).toBeTruthy();
    });

    it('renders checkmark icon in completed state', () => {
      const { UNSAFE_getByProps } = render(
        <TodaysFocusCard {...completedProps} />
      );
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-checkmark-circle-outline' })
      ).toBeTruthy();
    });

    it('completed state takes priority over other states', () => {
      // Even with thriving metrics, completed should show
      const props = { ...thrivingProps, isCompletedToday: true };
      const { getByLabelText } = render(<TodaysFocusCard {...props} />);
      expect(getByLabelText(/14 day streak and counting!/)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility label', () => {
      const { getByLabelText } = render(<TodaysFocusCard {...thrivingProps} />);
      expect(getByLabelText(/Today's focus:/)).toBeTruthy();
    });

    it('includes goal in accessibility label', () => {
      const { getByLabelText } = render(<TodaysFocusCard {...thrivingProps} />);
      expect(getByLabelText(/Goal: 21 next milestone/)).toBeTruthy();
    });

    it('has text accessibility role', () => {
      const { getByLabelText } = render(<TodaysFocusCard {...thrivingProps} />);
      const card = getByLabelText(/Today's focus:/);
      expect(card.props.accessibilityRole).toBe('text');
    });
  });

  describe('Goal Calculation', () => {
    it('calculates goal as 3 for starting state', () => {
      const { getByLabelText } = render(<TodaysFocusCard {...startingProps} />);
      expect(getByLabelText(/Goal: 3 3 days/)).toBeTruthy();
    });

    it('calculates goal as 7 for building state', () => {
      const { getByLabelText } = render(<TodaysFocusCard {...buildingProps} />);
      expect(getByLabelText(/Goal: 7 7 days/)).toBeTruthy();
    });

    it('calculates goal as 1 for struggling state', () => {
      const { getByLabelText } = render(
        <TodaysFocusCard {...strugglingProps} />
      );
      expect(getByLabelText(/Goal: 1 1 day/)).toBeTruthy();
    });

    it('calculates goal as bestStreak for recovering state', () => {
      const { getByLabelText } = render(
        <TodaysFocusCard {...recoveringProps} />
      );
      expect(getByLabelText(/Goal: 21 best streak/)).toBeTruthy();
    });

    it('calculates goal as currentStreak for completed state', () => {
      const { getByLabelText } = render(
        <TodaysFocusCard {...completedProps} />
      );
      expect(getByLabelText(/Goal: 10/)).toBeTruthy();
    });

    it('finds correct next milestone for thriving', () => {
      // Current streak 14, next milestone should be 21
      const { getByLabelText } = render(<TodaysFocusCard {...thrivingProps} />);
      expect(getByLabelText(/Goal: 21/)).toBeTruthy();
    });
  });

  describe('Milestone Calculation', () => {
    it('next milestone after 7 is 14', () => {
      const props = { ...thrivingProps, currentStreak: 7 };
      const { getByLabelText } = render(<TodaysFocusCard {...props} />);
      expect(getByLabelText(/Complete today to hit 14 days!/)).toBeTruthy();
    });

    it('next milestone after 21 is 30', () => {
      const props = { ...thrivingProps, currentStreak: 21 };
      const { getByLabelText } = render(<TodaysFocusCard {...props} />);
      expect(getByLabelText(/Complete today to hit 30 days!/)).toBeTruthy();
    });

    it('next milestone after 90 is 100', () => {
      const props = { ...thrivingProps, currentStreak: 90 };
      const { getByLabelText } = render(<TodaysFocusCard {...props} />);
      expect(getByLabelText(/Complete today to hit 100 days!/)).toBeTruthy();
    });

    it('next milestone after 100 is 365', () => {
      const props = { ...thrivingProps, currentStreak: 100 };
      const { getByLabelText } = render(<TodaysFocusCard {...props} />);
      expect(getByLabelText(/Complete today to hit 365 days!/)).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles zero values gracefully', () => {
      const props = {
        currentStreak: 0,
        isCompletedToday: false,
        weeklyCompletion: 0,
        habitAge: 0,
        bestStreak: 0,
      };
      const { getByLabelText } = render(<TodaysFocusCard {...props} />);
      // Should fall into starting state (habitAge < 7)
      expect(getByLabelText(/3 days unlocks momentum!/)).toBeTruthy();
    });

    it('handles very large streak values', () => {
      const props = { ...thrivingProps, currentStreak: 500 };
      const { getByLabelText } = render(<TodaysFocusCard {...props} />);
      // After 365, should return currentStreak + 1
      expect(getByLabelText(/Complete today to hit 501 days!/)).toBeTruthy();
    });

    it('handles negative values gracefully', () => {
      const props = {
        ...baseProps,
        currentStreak: -1,
        habitAge: -1,
      };
      // Should not crash
      const { getByLabelText } = render(<TodaysFocusCard {...props} />);
      expect(getByLabelText(/Today's focus:/)).toBeTruthy();
    });
  });

  describe('Reduced Motion', () => {
    it('respects reduced motion preference', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const { getByLabelText } = render(<TodaysFocusCard {...thrivingProps} />);
      expect(getByLabelText(/Today's focus:/)).toBeTruthy();
    });

    it('renders correctly with reduced motion enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const { getAllByTestId } = render(<TodaysFocusCard {...thrivingProps} />);
      expect(getAllByTestId('linear-gradient').length).toBeGreaterThanOrEqual(
        1
      );
    });
  });

  describe('State Priority', () => {
    it('completed state has highest priority', () => {
      // User has everything: thriving metrics + completed today
      const props: TodaysFocusCardProps = {
        currentStreak: 21,
        isCompletedToday: true,
        weeklyCompletion: 7,
        habitAge: 60,
        bestStreak: 30,
      };
      const { UNSAFE_getByProps } = render(<TodaysFocusCard {...props} />);
      // Should show completed icon, not thriving icon
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-checkmark-circle-outline' })
      ).toBeTruthy();
    });

    it('starting state triggers for new habits over other states', () => {
      // New habit with struggling metrics should still show starting
      const props: TodaysFocusCardProps = {
        currentStreak: 0,
        isCompletedToday: false,
        weeklyCompletion: 0,
        habitAge: 3, // New habit
        bestStreak: 0,
      };
      const { UNSAFE_getByProps } = render(<TodaysFocusCard {...props} />);
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-sparkles-outline' })
      ).toBeTruthy();
    });

    it('recovering takes priority over struggling when bestStreak > 7', () => {
      // Both struggling and recovering conditions met
      const props: TodaysFocusCardProps = {
        currentStreak: 0,
        isCompletedToday: false,
        weeklyCompletion: 1, // < 3, so struggling criteria met
        habitAge: 30,
        bestStreak: 14, // > 7, so recovering criteria met
      };
      const { UNSAFE_getByProps } = render(<TodaysFocusCard {...props} />);
      // Recovering should take priority
      expect(
        UNSAFE_getByProps({ testID: 'ionicons-refresh-outline' })
      ).toBeTruthy();
    });
  });

  describe('Visual Elements', () => {
    it('renders message text', () => {
      const { getByText } = render(<TodaysFocusCard {...thrivingProps} />);
      expect(getByText(/Complete today to hit 21 days!/)).toBeTruthy();
    });

    it('renders goal label', () => {
      const { getByText } = render(<TodaysFocusCard {...thrivingProps} />);
      expect(getByText('Goal:')).toBeTruthy();
    });
  });
});
