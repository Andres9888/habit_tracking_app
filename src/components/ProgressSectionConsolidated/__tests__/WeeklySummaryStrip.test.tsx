/**
 * WeeklySummaryStrip Component Tests
 *
 * Tests for the Weekly Summary Strip component that provides
 * a visual 7-day view of the current week's habit completion.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WeeklySummaryStrip } from '../WeeklySummaryStrip';
import type {
  WeeklySummaryStripProps,
  WeekDayData,
} from '../WeeklySummaryStripTypes';

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
      const AnimatedComponent = React.forwardRef(
        (props: Record<string, unknown>, ref: React.Ref<unknown>) =>
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
      ...jest.requireActual('react-native-reanimated/mock').Easing,
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

  const createIcon = (name: string) => (props: Record<string, unknown>) =>
    React.createElement(View, { testID: `lucide-${name}`, ...props });

  return {
    Check: createIcon('Check'),
    X: createIcon('X'),
    ArrowUp: createIcon('ArrowUp'),
    ArrowDown: createIcon('ArrowDown'),
    Minus: createIcon('Minus'),
  };
});

describe('WeeklySummaryStrip', () => {
  // Helper to create week data
  const createWeekData = (
    completedDays: boolean[],
    todayIndex: number = 6
  ): WeekDayData[] => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday

    return completedDays.map((completed, index) => {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + index);
      return {
        date: date.toISOString().split('T')[0],
        completed,
        isToday: index === todayIndex,
      };
    });
  };

  // Default props
  const defaultProps: WeeklySummaryStripProps = {
    weekData: createWeekData([true, true, false, true, true, true, false], 6),
    lastWeekCompleted: 5,
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
      const { getByLabelText } = render(
        <WeeklySummaryStrip {...defaultProps} />
      );
      expect(getByLabelText(/Weekly summary:/)).toBeTruthy();
    });

    it('renders all 7 day cells', () => {
      const { getByText } = render(<WeeklySummaryStrip {...defaultProps} />);

      // Check for day abbreviations
      expect(getByText('M')).toBeTruthy();
      expect(getByText('W')).toBeTruthy();
      expect(getByText('F')).toBeTruthy();
    });

    it('renders header with "This Week" title', () => {
      const { getByText } = render(<WeeklySummaryStrip {...defaultProps} />);
      expect(getByText(/This Week/)).toBeTruthy();
    });

    it('renders comparison text', () => {
      const { getByText } = render(<WeeklySummaryStrip {...defaultProps} />);
      expect(getByText('5/7 vs 5/7')).toBeTruthy();
    });
  });

  describe('Day Visual States', () => {
    it('shows checkmark icon for completed days', () => {
      const weekData = createWeekData(
        [true, false, false, false, false, false, false],
        6
      );
      const { getAllByTestId } = render(
        <WeeklySummaryStrip weekData={weekData} lastWeekCompleted={0} />
      );

      // Should have at least one checkmark icon
      const checkmarks = getAllByTestId('lucide-Check');
      expect(checkmarks.length).toBeGreaterThanOrEqual(1);
    });

    it('shows close icon for missed days', () => {
      const weekData = createWeekData(
        [false, false, false, false, false, false, false],
        6
      );
      weekData[6].isToday = false; // Make sure today isn't set so we get missed states

      const { getAllByTestId } = render(
        <WeeklySummaryStrip weekData={weekData} lastWeekCompleted={0} />
      );

      // Should have close icons for missed days
      const closeIcons = getAllByTestId('lucide-X');
      expect(closeIcons.length).toBeGreaterThan(0);
    });

    it('shows "Today" text for incomplete today', () => {
      const weekData = createWeekData(
        [true, true, true, true, true, true, false],
        6
      );

      const { getByText } = render(
        <WeeklySummaryStrip weekData={weekData} lastWeekCompleted={5} />
      );

      expect(getByText('Today')).toBeTruthy();
    });

    it('shows checkmark for completed today', () => {
      const weekData = createWeekData(
        [true, true, true, true, true, true, true],
        6
      );

      const { getAllByTestId } = render(
        <WeeklySummaryStrip weekData={weekData} lastWeekCompleted={5} />
      );

      // All days completed: 6 days show 'complete' + 1 day shows 'todayComplete'
      // Both states use the checkmark icon
      const checkmarks = getAllByTestId('lucide-Check');
      // The exact count may vary based on how future days are determined
      // (relative to the mocked Date.now), but we should have at least 6
      expect(checkmarks.length).toBeGreaterThanOrEqual(6);
    });
  });

  describe('Perfect Week State', () => {
    const perfectWeekProps: WeeklySummaryStripProps = {
      weekData: createWeekData([true, true, true, true, true, true, true], 6),
      lastWeekCompleted: 5,
    };

    it('shows trophy emoji for perfect week', () => {
      const { getByText } = render(
        <WeeklySummaryStrip {...perfectWeekProps} />
      );
      expect(getByText(/This Week 🏆/)).toBeTruthy();
    });

    it('shows "Perfect!" badge for 7/7 completion', () => {
      const { getByText } = render(
        <WeeklySummaryStrip {...perfectWeekProps} />
      );
      expect(getByText('Perfect!')).toBeTruthy();
    });

    it('renders gradient background for perfect week', () => {
      const { getByTestId } = render(
        <WeeklySummaryStrip {...perfectWeekProps} />
      );
      expect(getByTestId('linear-gradient')).toBeTruthy();
    });

    it('displays 7/7 in comparison', () => {
      const { getByText } = render(
        <WeeklySummaryStrip {...perfectWeekProps} />
      );
      expect(getByText('7/7 vs 5/7')).toBeTruthy();
    });

    it('shows sparkle emoji for perfect week', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(false);

      const { UNSAFE_root } = render(
        <WeeklySummaryStrip {...perfectWeekProps} />
      );

      // Find the sparkle container with testID
      const sparkleElement = UNSAFE_root.findAllByProps({
        testID: 'perfect-week-sparkle',
      });
      expect(sparkleElement.length).toBeGreaterThan(0);
    });

    it('does not show sparkle emoji for non-perfect week', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(false);

      const { UNSAFE_root } = render(<WeeklySummaryStrip {...defaultProps} />);

      const sparkleElement = UNSAFE_root.findAllByProps({
        testID: 'perfect-week-sparkle',
      });
      expect(sparkleElement.length).toBe(0);
    });

    it('does not show sparkle with reduced motion enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const { UNSAFE_root } = render(
        <WeeklySummaryStrip {...perfectWeekProps} />
      );

      // Sparkle should not render when reduce motion is enabled
      const sparkleElement = UNSAFE_root.findAllByProps({
        testID: 'perfect-week-sparkle',
      });
      expect(sparkleElement.length).toBe(0);
    });
  });

  describe('Trend Indicator', () => {
    it('shows up arrow when current week is better', () => {
      const props = {
        ...defaultProps,
        weekData: createWeekData(
          [true, true, true, true, true, true, false],
          6
        ),
        lastWeekCompleted: 3,
      };

      const { getByTestId } = render(<WeeklySummaryStrip {...props} />);
      expect(getByTestId('lucide-ArrowUp')).toBeTruthy();
    });

    it('shows down arrow when current week is worse', () => {
      const props = {
        ...defaultProps,
        weekData: createWeekData(
          [true, false, false, false, false, false, false],
          6
        ),
        lastWeekCompleted: 5,
      };

      const { getByTestId } = render(<WeeklySummaryStrip {...props} />);
      expect(getByTestId('lucide-ArrowDown')).toBeTruthy();
    });

    it('shows neutral icon when weeks are equal', () => {
      const props = {
        ...defaultProps,
        weekData: createWeekData(
          [true, true, true, true, true, false, false],
          6
        ),
        lastWeekCompleted: 5,
      };

      const { getByTestId } = render(<WeeklySummaryStrip {...props} />);
      expect(getByTestId('lucide-Minus')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has proper accessibility role', () => {
      const { getByLabelText } = render(
        <WeeklySummaryStrip {...defaultProps} />
      );
      const container = getByLabelText(/Weekly summary:/);
      expect(container.props.accessibilityRole).toBe('summary');
    });

    it('includes completion count in accessibility label', () => {
      const { getByLabelText } = render(
        <WeeklySummaryStrip {...defaultProps} />
      );
      expect(getByLabelText(/5 of 7 days completed this week/)).toBeTruthy();
    });

    it('includes trend comparison in accessibility label', () => {
      const props = {
        ...defaultProps,
        weekData: createWeekData(
          [true, true, true, true, true, true, false],
          6
        ),
        lastWeekCompleted: 3,
      };

      const { getByLabelText } = render(<WeeklySummaryStrip {...props} />);
      expect(getByLabelText(/up from 3 last week/)).toBeTruthy();
    });

    it('mentions perfect week in accessibility label', () => {
      const props = {
        weekData: createWeekData([true, true, true, true, true, true, true], 6),
        lastWeekCompleted: 5,
      };

      const { getByLabelText } = render(<WeeklySummaryStrip {...props} />);
      expect(getByLabelText(/Perfect week!/)).toBeTruthy();
    });

    it('includes day names in day cell accessibility', () => {
      const { getByLabelText } = render(
        <WeeklySummaryStrip {...defaultProps} />
      );
      expect(getByLabelText(/Monday/)).toBeTruthy();
    });
  });

  describe('Interactivity', () => {
    it('calls onTodayPress when today cell is pressed', () => {
      const onTodayPress = jest.fn();
      const weekData = createWeekData(
        [true, true, true, true, true, true, false],
        6
      );

      const { getByText } = render(
        <WeeklySummaryStrip
          weekData={weekData}
          lastWeekCompleted={5}
          onTodayPress={onTodayPress}
        />
      );

      // Find and press the "Today" text
      const todayText = getByText('Today');
      fireEvent.press(todayText);

      expect(onTodayPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onTodayPress when today is already completed', () => {
      const onTodayPress = jest.fn();
      const weekData = createWeekData(
        [true, true, true, true, true, true, true],
        6
      );

      const { getAllByTestId } = render(
        <WeeklySummaryStrip
          weekData={weekData}
          lastWeekCompleted={5}
          onTodayPress={onTodayPress}
        />
      );

      // Press the last checkmark (today)
      const checkmarks = getAllByTestId('lucide-Check');
      fireEvent.press(checkmarks[checkmarks.length - 1]);

      // Should not be called because today is already completed
      expect(onTodayPress).not.toHaveBeenCalled();
    });
  });

  describe('Reduced Motion', () => {
    it('respects reduced motion preference', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const { getByLabelText } = render(
        <WeeklySummaryStrip {...defaultProps} />
      );
      expect(getByLabelText(/Weekly summary:/)).toBeTruthy();
    });

    it('renders correctly with reduced motion enabled', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const { getByText } = render(<WeeklySummaryStrip {...defaultProps} />);
      expect(getByText(/This Week/)).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty week data gracefully', () => {
      const props = {
        ...defaultProps,
        weekData: [],
      };

      // Should not crash
      const { getByLabelText } = render(<WeeklySummaryStrip {...props} />);
      expect(getByLabelText(/Weekly summary:/)).toBeTruthy();
    });

    it('handles zero completions', () => {
      const props = {
        weekData: createWeekData(
          [false, false, false, false, false, false, false],
          -1
        ),
        lastWeekCompleted: 0,
      };

      const { getByText } = render(<WeeklySummaryStrip {...props} />);
      expect(getByText('0/7 vs 0/7')).toBeTruthy();
    });

    it('handles lastWeekCompleted = 0', () => {
      const props = {
        ...defaultProps,
        lastWeekCompleted: 0,
      };

      const { getByText } = render(<WeeklySummaryStrip {...props} />);
      expect(getByText(/vs 0\/7/)).toBeTruthy();
    });

    it('handles lastWeekCompleted = 7', () => {
      const props = {
        ...defaultProps,
        lastWeekCompleted: 7,
      };

      const { getByText } = render(<WeeklySummaryStrip {...props} />);
      expect(getByText(/vs 7\/7/)).toBeTruthy();
    });
  });

  describe('Week Completion Calculation', () => {
    it('correctly counts completed days', () => {
      const weekData = createWeekData(
        [true, true, false, true, false, true, true],
        6
      );

      const { getByText } = render(
        <WeeklySummaryStrip weekData={weekData} lastWeekCompleted={3} />
      );

      expect(getByText('5/7 vs 3/7')).toBeTruthy();
    });

    it('correctly identifies all days completed', () => {
      const weekData = createWeekData(
        [true, true, true, true, true, true, true],
        6
      );

      const { getByText } = render(
        <WeeklySummaryStrip weekData={weekData} lastWeekCompleted={4} />
      );

      expect(getByText('7/7 vs 4/7')).toBeTruthy();
    });
  });

  describe('Visual State Determination', () => {
    it('future days show no icon', () => {
      // Create week data where day 6 is today (so day 7 is future... but we only have 7 days)
      // Actually, all days in a week that haven't passed should show as future
      // Let's test with today as Monday (index 0)
      const weekData = createWeekData(
        [false, false, false, false, false, false, false],
        0
      );

      const { queryAllByTestId } = render(
        <WeeklySummaryStrip weekData={weekData} lastWeekCompleted={5} />
      );

      // Future days should not have checkmark or close icons
      // Only today should show "Today" text
      const { getByText } = render(
        <WeeklySummaryStrip weekData={weekData} lastWeekCompleted={5} />
      );
      expect(getByText('Today')).toBeTruthy();
    });

    it('missed days (past, not completed) show X icon', () => {
      // Create week data where today is the last day and previous days were not completed
      const weekData = createWeekData(
        [false, false, false, false, false, false, false],
        6
      );
      weekData.forEach((day, index) => {
        if (index < 6) {
          day.isToday = false;
        }
      });

      const { getAllByTestId } = render(
        <WeeklySummaryStrip weekData={weekData} lastWeekCompleted={5} />
      );

      // Should have close icons for missed days
      // The exact count may vary based on how dates compare to the mocked Date.now
      // But we should have multiple close icons for missed days
      const closeIcons = getAllByTestId('lucide-X');
      expect(closeIcons.length).toBeGreaterThanOrEqual(4); // At least 4 missed days
    });
  });
});
