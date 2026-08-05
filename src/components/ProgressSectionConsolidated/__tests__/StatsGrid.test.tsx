/**
 * StatsGrid Component Tests
 *
 * Tests for the StatsGrid component that displays a compact 2x2
 * statistics grid with a strength ring.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StatsGrid } from '../StatsGrid';
import { CompactStrengthRing } from '../CompactStrengthRing';
import { StatCard } from '../StatCard';
import type { StatsGridProps } from '../StatsGridTypes';

// Mock useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  __esModule: true,
  useReduceMotion: jest.fn(() => false),
  default: jest.fn(() => false),
}));

// Mock useHapticFeedback hook
jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  useHapticFeedback: jest.fn(() => ({
    triggerSelection: jest.fn(),
    triggerLightImpact: jest.fn(),
    triggerMediumImpact: jest.fn(),
    triggerHeavyImpact: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerWarning: jest.fn(),
    triggerError: jest.fn(),
    isHapticsSupported: true,
  })),
  default: jest.fn(() => ({
    triggerSelection: jest.fn(),
    isHapticsSupported: true,
  })),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text, Pressable } = require('react-native');

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
    withRepeat: (animation: unknown) => animation,
    withSequence: (...animations: unknown[]) => animations[0],
    Easing: {
      out: () => () => 0,
      inOut: () => () => 0,
      cubic: () => 0,
      ease: () => 0,
    },
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
    React.createElement(View, { testID: 'svg-circle', ...props });

  return {
    __esModule: true,
    default: Svg,
    Svg,
    Circle,
  };
});

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    TrendingUp: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'trending-up-icon', ...props }),
    TrendingDown: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'trending-down-icon', ...props }),
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

describe('StatsGrid', () => {
  // Default props for testing
  const defaultProps: StatsGridProps = {
    strength: 65,
    currentStreak: 14,
    monthlyCompleted: 18,
    monthlyTotal: 21,
    bestDay: { name: 'Tuesday', rate: 85 },
    focusDay: { name: 'Saturday', rate: 42 },
    weeklyChange: 5,
    monthlyChange: 3,
  };

  const minimalProps: StatsGridProps = {
    strength: 25,
    currentStreak: 0,
    monthlyCompleted: 5,
    monthlyTotal: 15,
    bestDay: null,
    focusDay: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      expect(getByLabelText(/Statistics overview/)).toBeTruthy();
    });

    it('renders the compact strength ring', () => {
      const { getByTestId } = render(<StatsGrid {...defaultProps} />);
      expect(getByTestId('svg')).toBeTruthy();
    });

    it('renders streak stat card', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      expect(getByLabelText(/Day Streak: 14/)).toBeTruthy();
    });

    it('renders monthly stat card', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      expect(getByLabelText(/This Month: 18\/21/)).toBeTruthy();
    });

    it('renders best day stat card when provided', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      expect(getByLabelText(/Best Day.*Tue/)).toBeTruthy();
    });

    it('renders focus day stat card when provided', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      expect(getByLabelText(/Focus Day.*Sat/)).toBeTruthy();
    });

    it('does not render best day when null', () => {
      const { queryByLabelText } = render(<StatsGrid {...minimalProps} />);
      expect(queryByLabelText(/Best Day/)).toBeNull();
    });

    it('does not render focus day when null', () => {
      const { queryByLabelText } = render(<StatsGrid {...minimalProps} />);
      expect(queryByLabelText(/Focus Day/)).toBeNull();
    });
  });

  describe('Streak Display', () => {
    it('displays singular "1" for 1 day streak', () => {
      const props = { ...defaultProps, currentStreak: 1 };
      const { getByLabelText } = render(<StatsGrid {...props} />);
      expect(getByLabelText(/Day Streak: 1/)).toBeTruthy();
    });

    it('displays "0" for zero streak', () => {
      const props = { ...defaultProps, currentStreak: 0 };
      const { getByLabelText } = render(<StatsGrid {...props} />);
      expect(getByLabelText(/Day Streak: 0/)).toBeTruthy();
    });

    it('displays large streak numbers correctly', () => {
      const props = { ...defaultProps, currentStreak: 365 };
      const { getByLabelText } = render(<StatsGrid {...props} />);
      expect(getByLabelText(/Day Streak: 365/)).toBeTruthy();
    });
  });

  describe('Monthly Stats', () => {
    it('displays monthly completion ratio', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      expect(getByLabelText(/This Month: 18\/21/)).toBeTruthy();
    });

    it('handles zero completions', () => {
      const props = { ...defaultProps, monthlyCompleted: 0, monthlyTotal: 10 };
      const { getByLabelText } = render(<StatsGrid {...props} />);
      expect(getByLabelText(/This Month: 0\/10/)).toBeTruthy();
    });
  });

  describe('Day Name Abbreviation', () => {
    it('abbreviates best day name to 3 characters', () => {
      const props = {
        ...defaultProps,
        bestDay: { name: 'Wednesday', rate: 90 },
      };
      const { getByLabelText } = render(<StatsGrid {...props} />);
      expect(getByLabelText(/Best Day.*Wed/)).toBeTruthy();
    });

    it('abbreviates focus day name to 3 characters', () => {
      const props = {
        ...defaultProps,
        focusDay: { name: 'Thursday', rate: 30 },
      };
      const { getByLabelText } = render(<StatsGrid {...props} />);
      expect(getByLabelText(/Focus Day.*Thu/)).toBeTruthy();
    });
  });

  describe('Trend Indicators', () => {
    it('shows monthly trend when provided', () => {
      const props = { ...defaultProps, monthlyChange: 5 };
      const { getByLabelText } = render(<StatsGrid {...props} />);
      expect(getByLabelText(/This Month.*up 5/i)).toBeTruthy();
    });

    it('does not show trend when monthlyChange is 0', () => {
      const props = { ...defaultProps, monthlyChange: 0 };
      const { queryByTestId } = render(<StatsGrid {...props} />);
      // No trend icon should be rendered
      expect(queryByTestId('trending-up-icon')).toBeNull();
    });

    it('does not show trend when monthlyChange is undefined', () => {
      const props = { ...defaultProps, monthlyChange: undefined };
      const { queryByTestId } = render(<StatsGrid {...props} />);
      expect(queryByTestId('trending-up-icon')).toBeNull();
    });
  });

  describe('Interactivity', () => {
    it('makes focus day card interactive when onFocusDayPress is provided', () => {
      const onFocusDayPress = jest.fn();
      const { getByLabelText } = render(
        <StatsGrid {...defaultProps} onFocusDayPress={onFocusDayPress} />
      );

      const focusDayCard = getByLabelText(/Focus Day/);
      fireEvent.press(focusDayCard);

      expect(onFocusDayPress).toHaveBeenCalledTimes(1);
    });

    it('does not trigger callback when onFocusDayPress is not provided', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);

      const focusDayCard = getByLabelText(/Focus Day/);
      fireEvent.press(focusDayCard);
      // No error should be thrown
    });

    it('streak card is not interactive', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      const streakCard = getByLabelText(/Day Streak/);
      expect(streakCard.props.accessibilityRole).toBe('text');
    });
  });

  describe('Accessibility', () => {
    it('has correct accessibility label with all stats', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      const container = getByLabelText(
        /Statistics overview: 14 day streak, 18 of 21 days this month, best day is Tuesday, focus day is Saturday/
      );
      expect(container).toBeTruthy();
    });

    it('has correct accessibility label without best/focus days', () => {
      const { getByLabelText } = render(<StatsGrid {...minimalProps} />);
      const container = getByLabelText(
        /Statistics overview: 0 day streak, 5 of 15 days this month/
      );
      expect(container).toBeTruthy();
    });

    it('has summary accessibility role on container', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      const container = getByLabelText(/Statistics overview/);
      expect(container.props.accessibilityRole).toBe('summary');
    });

    it('focus day has button role when interactive', () => {
      const { getByLabelText } = render(
        <StatsGrid {...defaultProps} onFocusDayPress={() => {}} />
      );
      const focusDayCard = getByLabelText(/Focus Day/);
      expect(focusDayCard.props.accessibilityRole).toBe('button');
    });

    it('focus day has text role when not interactive', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      const focusDayCard = getByLabelText(/Focus Day/);
      expect(focusDayCard.props.accessibilityRole).toBe('text');
    });
  });

  describe('Strength Ring', () => {
    it('passes strength to CompactStrengthRing', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      expect(getByLabelText(/Habit strength at 65 percent/)).toBeTruthy();
    });

    it('passes weeklyChange to CompactStrengthRing', () => {
      const { getByLabelText } = render(<StatsGrid {...defaultProps} />);
      expect(getByLabelText(/up 5 percent this week/)).toBeTruthy();
    });

    it('handles zero weeklyChange', () => {
      const props = { ...defaultProps, weeklyChange: 0 };
      const { getByLabelText } = render(<StatsGrid {...props} />);
      // Should not include weekly change text
      const ring = getByLabelText(/Habit strength at 65 percent/);
      expect(ring.props.accessibilityLabel).not.toContain('this week');
    });

    it('handles negative weeklyChange', () => {
      const props = { ...defaultProps, weeklyChange: -3 };
      const { getByLabelText } = render(<StatsGrid {...props} />);
      expect(getByLabelText(/down 3 percent this week/)).toBeTruthy();
    });
  });
});

describe('CompactStrengthRing', () => {
  it('renders without crashing', () => {
    const { getByLabelText } = render(<CompactStrengthRing strength={50} />);
    expect(getByLabelText(/Habit strength at 50 percent/)).toBeTruthy();
  });

  it('clamps strength to 0-100 range', () => {
    const { getByLabelText } = render(<CompactStrengthRing strength={150} />);
    expect(getByLabelText(/Habit strength at 100 percent/)).toBeTruthy();
  });

  it('handles negative strength values', () => {
    const { getByLabelText } = render(<CompactStrengthRing strength={-10} />);
    expect(getByLabelText(/Habit strength at 0 percent/)).toBeTruthy();
  });

  it('shows positive trend badge', () => {
    const { getByLabelText } = render(
      <CompactStrengthRing strength={50} weeklyChange={5} />
    );
    expect(getByLabelText(/Up 5 percent/)).toBeTruthy();
  });

  it('shows negative trend badge', () => {
    const { getByLabelText } = render(
      <CompactStrengthRing strength={50} weeklyChange={-3} />
    );
    expect(getByLabelText(/Down 3 percent/)).toBeTruthy();
  });

  it('does not show trend badge when weeklyChange is 0', () => {
    const { queryByLabelText } = render(
      <CompactStrengthRing strength={50} weeklyChange={0} />
    );
    expect(queryByLabelText(/Up.*percent/)).toBeNull();
    expect(queryByLabelText(/Down.*percent/)).toBeNull();
  });

  it('has progressbar accessibility role', () => {
    const { getByLabelText } = render(<CompactStrengthRing strength={50} />);
    const ring = getByLabelText(/Habit strength/);
    expect(ring.props.accessibilityRole).toBe('progressbar');
  });
});

describe('StatCard', () => {
  const defaultConfig = {
    id: 'streak' as const,
    icon: '🔥',
    value: '14',
    label: 'Day Streak',
    backgroundColor: '#fff7ed',
  };

  const mockHapticFeedback = jest.fn();

  it('renders without crashing', () => {
    const { getByLabelText } = render(
      <StatCard
        config={defaultConfig}
        index={0}
        reduceMotion={false}
        onHapticFeedback={mockHapticFeedback}
      />
    );
    expect(getByLabelText(/Day Streak: 14/)).toBeTruthy();
  });

  it('renders icon and value', () => {
    const { getByText } = render(
      <StatCard
        config={defaultConfig}
        index={0}
        reduceMotion={false}
        onHapticFeedback={mockHapticFeedback}
      />
    );
    expect(getByText('🔥')).toBeTruthy();
    expect(getByText('14')).toBeTruthy();
  });

  it('renders label', () => {
    const { getByText } = render(
      <StatCard
        config={defaultConfig}
        index={0}
        reduceMotion={false}
        onHapticFeedback={mockHapticFeedback}
      />
    );
    expect(getByText('Day Streak')).toBeTruthy();
  });

  it('calls onPress when interactive and pressed', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <StatCard
        config={defaultConfig}
        index={0}
        reduceMotion={false}
        isInteractive={true}
        onPress={onPress}
        onHapticFeedback={mockHapticFeedback}
      />
    );

    fireEvent.press(getByLabelText(/Day Streak/));
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(mockHapticFeedback).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when not interactive', () => {
    const onPress = jest.fn();
    const { getByLabelText } = render(
      <StatCard
        config={defaultConfig}
        index={0}
        reduceMotion={false}
        isInteractive={false}
        onPress={onPress}
        onHapticFeedback={mockHapticFeedback}
      />
    );

    fireEvent.press(getByLabelText(/Day Streak/));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows trend indicator when showTrend is true', () => {
    const configWithTrend = {
      ...defaultConfig,
      id: 'monthly' as const,
      trend: 5,
      showTrend: true,
    };

    const { getByTestId } = render(
      <StatCard
        config={configWithTrend}
        index={0}
        reduceMotion={false}
        onHapticFeedback={mockHapticFeedback}
      />
    );

    expect(getByTestId('trending-up-icon')).toBeTruthy();
  });

  it('shows negative trend indicator', () => {
    const configWithTrend = {
      ...defaultConfig,
      id: 'monthly' as const,
      trend: -3,
      showTrend: true,
    };

    const { getByTestId } = render(
      <StatCard
        config={configWithTrend}
        index={0}
        reduceMotion={false}
        onHapticFeedback={mockHapticFeedback}
      />
    );

    expect(getByTestId('trending-down-icon')).toBeTruthy();
  });

  it('does not show trend when showTrend is false', () => {
    const configWithTrend = {
      ...defaultConfig,
      trend: 5,
      showTrend: false,
    };

    const { queryByTestId } = render(
      <StatCard
        config={configWithTrend}
        index={0}
        reduceMotion={false}
        onHapticFeedback={mockHapticFeedback}
      />
    );

    expect(queryByTestId('trending-up-icon')).toBeNull();
  });

  it('has button role when interactive', () => {
    const { getByRole } = render(
      <StatCard
        config={defaultConfig}
        index={0}
        reduceMotion={false}
        isInteractive={true}
        onHapticFeedback={mockHapticFeedback}
      />
    );
    expect(getByRole('button')).toBeTruthy();
  });

  it('has text role when not interactive', () => {
    const { getByLabelText } = render(
      <StatCard
        config={defaultConfig}
        index={0}
        reduceMotion={false}
        isInteractive={false}
        onHapticFeedback={mockHapticFeedback}
      />
    );
    expect(getByLabelText(/Day Streak/).props.accessibilityRole).toBe('text');
  });

  it('includes accessibility hint when interactive', () => {
    const { getByLabelText } = render(
      <StatCard
        config={defaultConfig}
        index={0}
        reduceMotion={false}
        isInteractive={true}
        onHapticFeedback={mockHapticFeedback}
      />
    );
    const card = getByLabelText(/Day Streak/);
    expect(card.props.accessibilityHint).toBe('Double tap to view details');
  });
});
