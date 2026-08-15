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
      const AnimatedComponent = React.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) =>
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
    withRepeat: (animation: unknown) => animation,
    withSequence: (...animations: unknown[]) => animations[0],
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
    LinearGradient: ({ children, colors, ...props }: unknown) =>
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

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createIcon =
    (name: string) => (props: Record<string, unknown>) =>
      React.createElement(View, { testID: `lucide-${name}`, ...props });

  return {
    Crosshair: createIcon('Crosshair'),
    TrendingUp: createIcon('TrendingUp'),
    Trophy: createIcon('Trophy'),
    Sparkles: createIcon('Sparkles'),
    Heart: createIcon('Heart'),
    RefreshCw: createIcon('RefreshCw'),
    CheckCircle2: createIcon('CheckCircle2'),
    Share2: createIcon('Share2'),
  };
});

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

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
        UNSAFE_getByProps({ testID: 'lucide-Crosshair' })
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
        UNSAFE_getByProps({ testID: 'lucide-Crosshair' })
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
        UNSAFE_getByProps({ testID: 'lucide-TrendingUp' })
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
        UNSAFE_getByProps({ testID: 'lucide-Sparkles' })
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
        UNSAFE_getByProps({ testID: 'lucide-Heart' })
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
        UNSAFE_getByProps({ testID: 'lucide-RefreshCw' })
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
        UNSAFE_getByProps({ testID: 'lucide-CheckCircle2' })
      ).toBeTruthy();
    });

    it('completed state takes priority over other states (when not on milestone)', () => {
      // Even with thriving metrics, completed should show (when not on a milestone)
      // 14 is a milestone so we mark it as celebrated to test completed state
      const props = {
        ...thrivingProps,
        isCompletedToday: true,
        celebratedMilestones: [14],
      };
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
    it('celebrating state has highest priority when on a milestone', () => {
      // User has everything: thriving metrics + completed today + on milestone
      const props: TodaysFocusCardProps = {
        currentStreak: 21,
        isCompletedToday: true,
        weeklyCompletion: 7,
        habitAge: 60,
        bestStreak: 30,
        celebratedMilestones: [], // Not yet celebrated
      };
      const { getByText } = render(<TodaysFocusCard {...props} />);
      // Should show celebration badge, not checkmark icon
      expect(getByText('🏅')).toBeTruthy();
    });

    it('completed state has highest priority when milestone already celebrated', () => {
      // User has everything: thriving metrics + completed today + milestone already celebrated
      const props: TodaysFocusCardProps = {
        currentStreak: 21,
        isCompletedToday: true,
        weeklyCompletion: 7,
        habitAge: 60,
        bestStreak: 30,
        celebratedMilestones: [21], // Already celebrated
      };
      const { UNSAFE_getByProps } = render(<TodaysFocusCard {...props} />);
      // Should show completed icon, not celebration badge
      expect(
        UNSAFE_getByProps({ testID: 'lucide-CheckCircle2' })
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
        UNSAFE_getByProps({ testID: 'lucide-Sparkles' })
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
        UNSAFE_getByProps({ testID: 'lucide-RefreshCw' })
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

  describe('Milestone Celebration', () => {
    // Props for celebration state at different milestones
    const celebrating7DaysProps: TodaysFocusCardProps = {
      currentStreak: 7,
      isCompletedToday: true,
      weeklyCompletion: 7,
      habitAge: 30,
      bestStreak: 7,
      celebratedMilestones: [],
    };

    const celebrating21DaysProps: TodaysFocusCardProps = {
      currentStreak: 21,
      isCompletedToday: true,
      weeklyCompletion: 5,
      habitAge: 60,
      bestStreak: 21,
      celebratedMilestones: [],
    };

    const alreadyCelebratedProps: TodaysFocusCardProps = {
      currentStreak: 7,
      isCompletedToday: true,
      weeklyCompletion: 7,
      habitAge: 30,
      bestStreak: 7,
      celebratedMilestones: [7], // Already celebrated 7 days
    };

    it('shows celebrating state when on a milestone and completed today', () => {
      const { getByLabelText } = render(
        <TodaysFocusCard {...celebrating7DaysProps} />
      );
      expect(getByLabelText(/Milestone celebration/)).toBeTruthy();
      expect(getByLabelText(/You hit 7 days!/)).toBeTruthy();
    });

    it('shows celebration message for 21-day milestone', () => {
      const { getByLabelText } = render(
        <TodaysFocusCard {...celebrating21DaysProps} />
      );
      expect(getByLabelText(/You hit 21 days!/)).toBeTruthy();
    });

    it('shows badge emoji in celebration state', () => {
      const { getByText } = render(
        <TodaysFocusCard {...celebrating7DaysProps} />
      );
      // 7-day milestone badge is ⭐
      expect(getByText('⭐')).toBeTruthy();
    });

    it('shows 21-day badge emoji in celebration state', () => {
      const { getByText } = render(
        <TodaysFocusCard {...celebrating21DaysProps} />
      );
      // 21-day milestone badge is 🏅
      expect(getByText('🏅')).toBeTruthy();
    });

    it('shows celebration subtext', () => {
      const { getByText } = render(
        <TodaysFocusCard {...celebrating7DaysProps} />
      );
      expect(getByText(/A whole week strong!/)).toBeTruthy();
    });

    it('shows next milestone preview in celebration state', () => {
      const { getByText } = render(
        <TodaysFocusCard {...celebrating7DaysProps} />
      );
      // After 7 days, next is 14
      expect(getByText(/Next: 14 days/)).toBeTruthy();
    });

    it('does NOT show celebration state if milestone already celebrated', () => {
      const { getByLabelText, queryByText } = render(
        <TodaysFocusCard {...alreadyCelebratedProps} />
      );
      // Should show completed state instead
      expect(getByLabelText(/7 day streak and counting!/)).toBeTruthy();
      // Should NOT show celebration subtext
      expect(queryByText(/A whole week strong!/)).toBeNull();
    });

    it('celebration state takes priority over completed state', () => {
      const { getByText, UNSAFE_queryByProps } = render(
        <TodaysFocusCard {...celebrating7DaysProps} />
      );
      // Should show badge, not checkmark icon
      expect(getByText('⭐')).toBeTruthy();
      expect(
        UNSAFE_queryByProps({ testID: 'lucide-CheckCircle2' })
      ).toBeNull();
    });

    it('calls onMilestoneCelebrated when dismiss is pressed', () => {
      const mockOnMilestoneCelebrated = jest.fn();
      const { getByText } = render(
        <TodaysFocusCard
          {...celebrating7DaysProps}
          onMilestoneCelebrated={mockOnMilestoneCelebrated}
        />
      );

      const dismissButton = getByText(/Tap to continue/);
      const { fireEvent } = require('@testing-library/react-native');
      fireEvent.press(dismissButton);

      expect(mockOnMilestoneCelebrated).toHaveBeenCalledWith(7);
    });

    it('renders share button when onShare is provided', () => {
      const mockOnShare = jest.fn();
      const { getByLabelText } = render(
        <TodaysFocusCard {...celebrating7DaysProps} onShare={mockOnShare} />
      );

      expect(getByLabelText('Share')).toBeTruthy();
    });

    it('calls onShare when share button is pressed', () => {
      const mockOnShare = jest.fn();
      const { getByLabelText } = render(
        <TodaysFocusCard {...celebrating7DaysProps} onShare={mockOnShare} />
      );

      const shareButton = getByLabelText('Share');
      const { fireEvent } = require('@testing-library/react-native');
      fireEvent.press(shareButton);

      expect(mockOnShare).toHaveBeenCalled();
    });

    it('does not render share button when onShare is not provided', () => {
      const { queryByLabelText } = render(
        <TodaysFocusCard {...celebrating7DaysProps} />
      );

      expect(queryByLabelText('Share')).toBeNull();
    });

    it('does not render dismiss button when onMilestoneCelebrated is not provided', () => {
      const { queryByText } = render(
        <TodaysFocusCard {...celebrating7DaysProps} />
      );

      expect(queryByText(/Tap to continue/)).toBeNull();
    });

    it('has correct accessibility label for celebration state', () => {
      const { getByLabelText } = render(
        <TodaysFocusCard {...celebrating7DaysProps} />
      );
      const card = getByLabelText(/Milestone celebration/);
      expect(card.props.accessibilityLabel).toContain('A whole week strong!');
      expect(card.props.accessibilityLabel).toContain('Next goal: 14 days');
    });

    it('shows 3-day milestone celebration', () => {
      const props: TodaysFocusCardProps = {
        currentStreak: 3,
        isCompletedToday: true,
        weeklyCompletion: 3,
        habitAge: 30,
        bestStreak: 3,
        celebratedMilestones: [],
      };
      const { getByText } = render(<TodaysFocusCard {...props} />);
      expect(getByText('⚡')).toBeTruthy();
      expect(getByText(/You're building real momentum!/)).toBeTruthy();
    });

    it('shows 30-day milestone celebration', () => {
      const props: TodaysFocusCardProps = {
        currentStreak: 30,
        isCompletedToday: true,
        weeklyCompletion: 7,
        habitAge: 60,
        bestStreak: 30,
        celebratedMilestones: [],
      };
      const { getByText } = render(<TodaysFocusCard {...props} />);
      expect(getByText('🏆')).toBeTruthy();
      expect(getByText(/A full month — incredible!/)).toBeTruthy();
    });

    it('shows 100-day milestone celebration', () => {
      const props: TodaysFocusCardProps = {
        currentStreak: 100,
        isCompletedToday: true,
        weeklyCompletion: 7,
        habitAge: 120,
        bestStreak: 100,
        celebratedMilestones: [],
      };
      const { getByText } = render(<TodaysFocusCard {...props} />);
      expect(getByText('💯')).toBeTruthy();
      expect(getByText(/Welcome to the Century Club!/)).toBeTruthy();
    });

    it('shows 365-day milestone celebration without next milestone', () => {
      const props: TodaysFocusCardProps = {
        currentStreak: 365,
        isCompletedToday: true,
        weeklyCompletion: 7,
        habitAge: 400,
        bestStreak: 365,
        celebratedMilestones: [],
      };
      const { getByText, queryByText } = render(<TodaysFocusCard {...props} />);
      expect(getByText('👑')).toBeTruthy();
      expect(getByText(/you're legendary!/)).toBeTruthy();
      // No next milestone after 365
      expect(queryByText(/Next:/)).toBeNull();
    });

    it('does not show celebration for non-milestone streaks', () => {
      const props: TodaysFocusCardProps = {
        currentStreak: 5, // Not a milestone
        isCompletedToday: true,
        weeklyCompletion: 5,
        habitAge: 30,
        bestStreak: 5,
        celebratedMilestones: [],
      };
      const { getByLabelText, queryByText } = render(
        <TodaysFocusCard {...props} />
      );
      // Should show completed state
      expect(getByLabelText(/5 day streak and counting!/)).toBeTruthy();
      // Should NOT show celebration subtext
      expect(queryByText(/building momentum/i)).toBeNull();
    });
  });
});
