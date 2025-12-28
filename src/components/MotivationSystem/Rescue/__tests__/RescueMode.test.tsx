/**
 * RescueMode Tests
 * Story T8.1-T8.5 - Create RescueMode screen/modal
 *
 * Tests:
 * - Modal visibility and close behavior
 * - Streak-at-risk header with badge
 * - Featured Your Why display (larger text)
 * - Failure visualization (always shows failure)
 * - Just Do 2 Minutes primary CTA
 * - Secondary actions (Full Habit, Skip Today)
 * - Accessibility labels
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { RescueMode, type RescueHabitData } from '../RescueMode';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  Heart: () => null,
  Play: () => null,
  Clock: () => null,
  Flame: () => null,
  AlertTriangle: () => null,
  X: () => null,
  Zap: () => null,
  Timer: () => null,
  Brain: () => null,
  User: () => null,
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: any[]) => args.filter(Boolean).join(' '),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const View = require('react-native').View;
  return {
    default: {
      View,
      createAnimatedComponent: (Component: any) => Component,
    },
    useSharedValue: (initial: any) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: any) => value,
    withTiming: (value: any, _config?: any, _callback?: any) => value,
    withDelay: (_delay: any, value: any) => value,
    withSequence: (...values: any[]) => values[values.length - 1],
    withRepeat: (value: any) => value,
    runOnJS: (_fn: any) => () => {},
    Extrapolation: { CLAMP: 'clamp' },
    Easing: {
      out: (fn: any) => fn,
      in: (fn: any) => fn,
      cubic: (x: number) => x,
    },
    View,
  };
});

// Mock react-native-safe-area-context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

// Mock the Modal component
jest.mock('../../../Modal', () => ({
  Modal: ({ children, visible, onClose }: any) =>
    visible ? <>{children}</> : null,
}));

// Mock FailureViz
jest.mock('../FailureViz', () => ({
  FailureViz: ({ visualization, streakCount }: any) => {
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text>FailureViz</Text>
        {visualization?.failureBody && <Text>{visualization.failureBody}</Text>}
        {visualization?.failureMind && <Text>{visualization.failureMind}</Text>}
        {visualization?.failureEmotion && (
          <Text>{visualization.failureEmotion}</Text>
        )}
        {streakCount && <Text>{streakCount} days gone</Text>}
      </View>
    );
  },
}));

describe('RescueMode', () => {
  const mockHabit: RescueHabitData = {
    id: 'habit-1',
    name: 'Morning Exercise',
    icon: '🏃',
    currentStreak: 14,
    totalCompletions: 42,
    why: 'To be healthy and energized for my family',
    vizFailureBody: 'Heavy, sluggish, stuck',
    vizFailureMind: 'Foggy, making excuses',
    vizFailureEmotion: 'Regret, shame, broken promise',
    hoursRemaining: 3,
  };

  const defaultProps = {
    visible: true,
    onClose: jest.fn(),
    habit: mockHabit,
    onJustTwoMin: jest.fn(),
    onStartFull: jest.fn(),
    onSkipToday: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('T8.1: Modal visibility', () => {
    it('renders when visible is true', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('🆘 Rescue Mode')).toBeTruthy();
    });

    it('does not render when visible is false', () => {
      const { queryByText } = render(
        <RescueMode {...defaultProps} visible={false} />
      );

      expect(queryByText('🆘 Rescue Mode')).toBeNull();
    });

    it('does not render when habit is null', () => {
      const { queryByText } = render(
        <RescueMode {...defaultProps} habit={null} />
      );

      expect(queryByText('🆘 Rescue Mode')).toBeNull();
    });
  });

  describe('T8.2: Streak-at-risk header with badge', () => {
    it('displays streak count in badge', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('14 Day Streak at Risk!')).toBeTruthy();
    });

    it('displays hours remaining', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('3 hours remaining')).toBeTruthy();
    });

    it('shows "Less than 1 hour left" when under 1 hour', () => {
      const habitWithLowTime = { ...mockHabit, hoursRemaining: 0.5 };
      const { getByText } = render(
        <RescueMode {...defaultProps} habit={habitWithLowTime} />
      );

      expect(getByText('Less than 1 hour left')).toBeTruthy();
    });

    it('hides streak header when streak is 0', () => {
      const habitWithNoStreak = { ...mockHabit, currentStreak: 0 };
      const { queryByText } = render(
        <RescueMode {...defaultProps} habit={habitWithNoStreak} />
      );

      expect(queryByText(/Day Streak at Risk/)).toBeNull();
    });
  });

  describe('T8.3: Featured Your Why display', () => {
    it('displays Your Why section with larger text', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('Remember Your Why')).toBeTruthy();
      expect(
        getByText('"To be healthy and energized for my family"')
      ).toBeTruthy();
    });

    it('includes encouraging message', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(
        getByText(
          "This is why you started. Don't let today break your momentum."
        )
      ).toBeTruthy();
    });

    it('does not show Your Why when why is missing', () => {
      const habitWithoutWhy = { ...mockHabit, why: undefined };
      const { queryByText } = render(
        <RescueMode {...defaultProps} habit={habitWithoutWhy} />
      );

      expect(queryByText('Remember Your Why')).toBeNull();
    });
  });

  describe('T8.4: Failure visualization', () => {
    it('renders FailureViz component', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('FailureViz')).toBeTruthy();
    });

    it('passes visualization data to FailureViz', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('Heavy, sluggish, stuck')).toBeTruthy();
      expect(getByText('Foggy, making excuses')).toBeTruthy();
      expect(getByText('Regret, shame, broken promise')).toBeTruthy();
    });

    it('passes streak count to FailureViz', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('14 days gone')).toBeTruthy();
    });
  });

  describe('T8.5: Just Do 2 Minutes primary CTA', () => {
    it('renders Just Do 2 Minutes button', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('Just Do 2 Minutes')).toBeTruthy();
    });

    it('shows supporting text', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText("That's all it takes to save your streak")).toBeTruthy();
    });

    it('calls onJustTwoMin and onClose when pressed', () => {
      const onJustTwoMin = jest.fn();
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <RescueMode
          {...defaultProps}
          onJustTwoMin={onJustTwoMin}
          onClose={onClose}
        />
      );

      fireEvent.press(getByLabelText('Just do 2 minutes'));

      expect(onJustTwoMin).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('has correct accessibility hint', () => {
      const { getByLabelText } = render(<RescueMode {...defaultProps} />);

      const button = getByLabelText('Just do 2 minutes');
      expect(button.props.accessibilityHint).toBe(
        'Start with a tiny commitment to save your streak'
      );
    });
  });

  describe('Secondary actions', () => {
    it('renders Full Habit button', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('Full Habit')).toBeTruthy();
    });

    it('calls onStartFull and onClose when Full Habit is pressed', () => {
      const onStartFull = jest.fn();
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <RescueMode
          {...defaultProps}
          onStartFull={onStartFull}
          onClose={onClose}
        />
      );

      fireEvent.press(getByLabelText('Full Habit'));

      expect(onStartFull).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders Skip Today button', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(getByText('Skip Today')).toBeTruthy();
    });

    it('calls onSkipToday and onClose when Skip Today is pressed', () => {
      const onSkipToday = jest.fn();
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <RescueMode
          {...defaultProps}
          onSkipToday={onSkipToday}
          onClose={onClose}
        />
      );

      fireEvent.press(getByLabelText('Skip Today'));

      expect(onSkipToday).toHaveBeenCalledTimes(1);
      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Close button', () => {
    it('renders close button', () => {
      const { getByLabelText } = render(<RescueMode {...defaultProps} />);

      expect(getByLabelText('Close rescue mode')).toBeTruthy();
    });

    it('calls onClose when close button is pressed', () => {
      const onClose = jest.fn();
      const { getByLabelText } = render(
        <RescueMode {...defaultProps} onClose={onClose} />
      );

      fireEvent.press(getByLabelText('Close rescue mode'));

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Science tip', () => {
    it('displays research-backed tip', () => {
      const { getByText } = render(<RescueMode {...defaultProps} />);

      expect(
        getByText(/Research shows: Just 2 minutes is enough/)
      ).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible button roles for all buttons', () => {
      const { getAllByRole } = render(<RescueMode {...defaultProps} />);

      const buttons = getAllByRole('button');
      // Close, Just 2 Min, Full Habit, Skip Today
      expect(buttons.length).toBeGreaterThanOrEqual(4);
    });

    it('accepts reduceMotion prop', () => {
      const { getByText } = render(
        <RescueMode {...defaultProps} reduceMotion={true} />
      );

      expect(getByText('🆘 Rescue Mode')).toBeTruthy();
    });
  });

  describe('Minimal habit data', () => {
    it('renders with only required fields', () => {
      const minimalHabit: RescueHabitData = {
        id: 'habit-2',
        name: 'Read',
      };
      const { getByText, queryByText } = render(
        <RescueMode {...defaultProps} habit={minimalHabit} />
      );

      expect(getByText('🆘 Rescue Mode')).toBeTruthy();
      expect(queryByText('Remember Your Why')).toBeNull();
      expect(queryByText(/Day Streak at Risk/)).toBeNull();
    });
  });
});
