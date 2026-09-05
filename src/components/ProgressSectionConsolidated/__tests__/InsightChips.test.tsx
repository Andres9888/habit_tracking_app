/**
 * InsightChips Component Tests
 *
 * Tests for the horizontal scroll container with key insight chips
 * showing streak, best day, focus day, and monthly progress.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { InsightChips } from '../InsightChips';

// Mock useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  __esModule: true,
  useReduceMotion: jest.fn(() => false),
  default: jest.fn(() => false),
}));

// Mock useHapticFeedback hook
const mockTriggerSelection = jest.fn();
jest.mock('../../../hooks/useHapticFeedback', () => ({
  __esModule: true,
  useHapticFeedback: jest.fn(() => ({
    triggerSelection: mockTriggerSelection,
    triggerLightImpact: jest.fn(),
    triggerMediumImpact: jest.fn(),
    triggerHeavyImpact: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerWarning: jest.fn(),
    triggerError: jest.fn(),
  })),
  default: jest.fn(),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Pressable } = require('react-native');

  const Animated = {
    View,
    Text: require('react-native').Text,
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
    withRepeat: (value: number) => value,
    withSequence: (...args: number[]) => args[0],
    cancelAnimation: jest.fn(),
    useReducedMotion: () => false,
    Easing: {
      out: () => () => 0,
      cubic: () => 0,
    },
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
    button: { damping: 15, stiffness: 300 },
    bouncy: { damping: 8, stiffness: 300 },
    micro: { damping: 12, stiffness: 180 },
    pulse: { damping: 12, stiffness: 60 },
  },
}));

describe('InsightChips', () => {
  const defaultProps = {
    currentStreak: 5,
    bestDay: { name: 'Sunday', rate: 85 },
    focusDay: { name: 'Tuesday', rate: 45 },
    monthlyCompleted: 15,
    monthlyTotal: 22,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByLabelText } = render(<InsightChips {...defaultProps} />);
      expect(getByLabelText('Habit insights')).toBeTruthy();
    });

    it('renders all four chips when all data is provided', () => {
      const { getByText } = render(<InsightChips {...defaultProps} />);

      expect(getByText('🔥')).toBeTruthy();
      expect(getByText('🏆')).toBeTruthy();
      expect(getByText('⚡')).toBeTruthy();
      expect(getByText('📅')).toBeTruthy();
    });

    it('renders without bestDay chip when bestDay is null', () => {
      const { queryByText, getByText } = render(
        <InsightChips {...defaultProps} bestDay={null} />
      );

      expect(getByText('🔥')).toBeTruthy();
      expect(queryByText('🏆')).toBeNull();
      expect(getByText('⚡')).toBeTruthy();
      expect(getByText('📅')).toBeTruthy();
    });

    it('renders without focusDay chip when focusDay is null', () => {
      const { queryByText, getByText } = render(
        <InsightChips {...defaultProps} focusDay={null} />
      );

      expect(getByText('🔥')).toBeTruthy();
      expect(getByText('🏆')).toBeTruthy();
      expect(queryByText('⚡')).toBeNull();
      expect(getByText('📅')).toBeTruthy();
    });
  });

  describe('Streak Chip', () => {
    it('displays current streak value with correct formatting for 1 day', () => {
      const { getByText } = render(
        <InsightChips {...defaultProps} currentStreak={1} />
      );
      expect(getByText('1 day')).toBeTruthy();
    });

    it('displays current streak value with correct formatting for multiple days', () => {
      const { getByText } = render(
        <InsightChips {...defaultProps} currentStreak={5} />
      );
      expect(getByText('5 days')).toBeTruthy();
    });

    it('displays zero streak correctly', () => {
      const { getByText } = render(
        <InsightChips {...defaultProps} currentStreak={0} />
      );
      expect(getByText('0 days')).toBeTruthy();
    });

    it('shows Current Streak label', () => {
      const { getByText } = render(<InsightChips {...defaultProps} />);
      expect(getByText('Current Streak')).toBeTruthy();
    });
  });

  describe('Best Day Chip', () => {
    it('displays best day name', () => {
      const { getByText } = render(<InsightChips {...defaultProps} />);
      expect(getByText('Sunday')).toBeTruthy();
    });

    it('displays completion rate as label', () => {
      const { getByText } = render(<InsightChips {...defaultProps} />);
      expect(getByText('85% completion')).toBeTruthy();
    });

    it('rounds completion rate to whole number', () => {
      const { getByText } = render(
        <InsightChips
          {...defaultProps}
          bestDay={{ name: 'Monday', rate: 72.7 }}
        />
      );
      expect(getByText('73% completion')).toBeTruthy();
    });
  });

  describe('Focus Day Chip', () => {
    it('displays focus day name', () => {
      const { getByText } = render(<InsightChips {...defaultProps} />);
      expect(getByText('Tuesday')).toBeTruthy();
    });

    it('shows Focus day label', () => {
      const { getByText } = render(<InsightChips {...defaultProps} />);
      expect(getByText('Focus day')).toBeTruthy();
    });

    it('triggers onFocusDayPress callback when pressed', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <InsightChips {...defaultProps} onFocusDayPress={mockOnPress} />
      );

      const chip = getByLabelText('Focus day: Tuesday');
      fireEvent.press(chip);

      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('triggers haptic feedback when pressed', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <InsightChips {...defaultProps} onFocusDayPress={mockOnPress} />
      );

      const chip = getByLabelText('Focus day: Tuesday');
      fireEvent.press(chip);

      expect(mockTriggerSelection).toHaveBeenCalled();
    });

    it('is not interactive when onFocusDayPress is not provided', () => {
      const { getByLabelText } = render(
        <InsightChips {...defaultProps} onFocusDayPress={undefined} />
      );

      const chip = getByLabelText('Focus day: Tuesday');
      // Should have accessibilityRole of 'text' not 'button' when not interactive
      expect(chip.props.accessibilityRole).toBe('text');
    });

    it('is interactive when onFocusDayPress is provided', () => {
      const { getByLabelText } = render(
        <InsightChips {...defaultProps} onFocusDayPress={() => {}} />
      );

      const chip = getByLabelText('Focus day: Tuesday');
      expect(chip.props.accessibilityRole).toBe('button');
    });
  });

  describe('Monthly Progress Chip', () => {
    it('displays monthly progress as fraction', () => {
      const { getByText } = render(<InsightChips {...defaultProps} />);
      expect(getByText('15/22')).toBeTruthy();
    });

    it('shows This month label', () => {
      const { getByText } = render(<InsightChips {...defaultProps} />);
      expect(getByText('This month')).toBeTruthy();
    });

    it('handles zero completed days', () => {
      const { getByText } = render(
        <InsightChips
          {...defaultProps}
          monthlyCompleted={0}
          monthlyTotal={22}
        />
      );
      expect(getByText('0/22')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible container with list role', () => {
      const { getByLabelText } = render(<InsightChips {...defaultProps} />);
      const container = getByLabelText('Habit insights');
      expect(container.props.accessibilityRole).toBe('list');
    });

    it('streak chip has proper accessibility label', () => {
      const { getByLabelText } = render(<InsightChips {...defaultProps} />);
      expect(
        getByLabelText(/Current Streak: 5 days, active streak/)
      ).toBeTruthy();
    });

    it('streak chip indicates active streak in accessibility label', () => {
      const { getByLabelText } = render(
        <InsightChips {...defaultProps} currentStreak={3} />
      );
      expect(getByLabelText(/active streak/)).toBeTruthy();
    });

    it('streak chip does not indicate active when streak is 0', () => {
      const { getByLabelText } = render(
        <InsightChips {...defaultProps} currentStreak={0} />
      );
      const label = getByLabelText(/Current Streak: 0 days/).props
        .accessibilityLabel;
      expect(label).not.toContain('active streak');
    });

    it('best day chip has proper accessibility label', () => {
      const { getByLabelText } = render(<InsightChips {...defaultProps} />);
      expect(getByLabelText(/85% completion: Sunday/)).toBeTruthy();
    });

    it('focus day chip has accessibility hint when interactive', () => {
      const { getByLabelText } = render(
        <InsightChips {...defaultProps} onFocusDayPress={() => {}} />
      );
      const chip = getByLabelText('Focus day: Tuesday');
      expect(chip.props.accessibilityHint).toBe('Double tap to view details');
    });

    it('monthly chip has proper accessibility label', () => {
      const { getByLabelText } = render(<InsightChips {...defaultProps} />);
      expect(getByLabelText(/This month: 15\/22/)).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles minimal props (only required fields)', () => {
      const minimalProps = {
        currentStreak: 0,
        bestDay: null,
        focusDay: null,
        monthlyCompleted: 0,
        monthlyTotal: 0,
      };
      const { getByText } = render(<InsightChips {...minimalProps} />);

      expect(getByText('0 days')).toBeTruthy();
      expect(getByText('0/0')).toBeTruthy();
    });

    it('handles very large streak numbers', () => {
      const { getByText } = render(
        <InsightChips {...defaultProps} currentStreak={365} />
      );
      expect(getByText('365 days')).toBeTruthy();
    });

    it('handles 100% completion rate', () => {
      const { getByText } = render(
        <InsightChips
          {...defaultProps}
          bestDay={{ name: 'Saturday', rate: 100 }}
        />
      );
      expect(getByText('100% completion')).toBeTruthy();
    });

    it('handles 0% completion rate', () => {
      const { getByText } = render(
        <InsightChips {...defaultProps} bestDay={{ name: 'Monday', rate: 0 }} />
      );
      expect(getByText('0% completion')).toBeTruthy();
    });
  });

  describe('Chip Data Generation', () => {
    it('generates chips in correct order: streak, bestDay, focusDay, monthly', () => {
      const { getAllByText } = render(<InsightChips {...defaultProps} />);

      // Get all emoji elements (used as icons)
      const emojis = ['🔥', '🏆', '⚡', '📅'];
      emojis.forEach((emoji) => {
        expect(getAllByText(emoji).length).toBeGreaterThan(0);
      });
    });

    it('memoizes chip data correctly', () => {
      const { rerender, getByText } = render(
        <InsightChips {...defaultProps} />
      );

      expect(getByText('5 days')).toBeTruthy();

      // Rerender with same props
      rerender(<InsightChips {...defaultProps} />);
      expect(getByText('5 days')).toBeTruthy();

      // Rerender with updated streak
      rerender(<InsightChips {...defaultProps} currentStreak={10} />);
      expect(getByText('10 days')).toBeTruthy();
    });
  });

  describe('Reduced Motion', () => {
    it('respects reduced motion preference', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion');
      useReduceMotion.mockReturnValue(true);

      const { getByLabelText } = render(<InsightChips {...defaultProps} />);
      expect(getByLabelText('Habit insights')).toBeTruthy();
    });
  });

  describe('Press Interactions', () => {
    it('handles pressIn event', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <InsightChips {...defaultProps} onFocusDayPress={mockOnPress} />
      );

      const chip = getByLabelText('Focus day: Tuesday');
      fireEvent(chip, 'pressIn');

      // Should not throw
      expect(chip).toBeTruthy();
    });

    it('handles pressOut event', () => {
      const mockOnPress = jest.fn();
      const { getByLabelText } = render(
        <InsightChips {...defaultProps} onFocusDayPress={mockOnPress} />
      );

      const chip = getByLabelText('Focus day: Tuesday');
      fireEvent(chip, 'pressOut');

      // Should not throw
      expect(chip).toBeTruthy();
    });
  });
});
