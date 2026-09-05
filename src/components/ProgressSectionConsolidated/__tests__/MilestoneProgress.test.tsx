/**
 * MilestoneProgress Component Tests
 *
 * Tests for the MilestoneProgress component that displays
 * gamification progress toward meaningful milestones.
 *
 * @see docs/specs/habit-details-screen/progress-tab-improvements-spec.md
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MilestoneProgress } from '../MilestoneProgress';
import {
  calculateMilestoneProgress,
  getNextMilestone,
  getCurrentMilestone,
  getPreviousMilestone,
  isOnMilestone,
  MILESTONES,
} from '../MilestoneProgressTypes';
import type { MilestoneProgressProps } from '../MilestoneProgressTypes';

// Mock useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  __esModule: true,
  useReduceMotion: jest.fn(() => false),
  default: jest.fn(() => false),
}));

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
    useReducedMotion: jest.fn(() => false),
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
    interpolate: (value: number, inputRange: number[], outputRange: number[]) =>
      outputRange[0],
  };
});

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createIcon =
    (name: string) => (props: Record<string, unknown>) =>
      React.createElement(View, { testID: `lucide-${name}`, ...props });

  return {
    CircleArrowRight: createIcon('CircleArrowRight'),
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

describe('MilestoneProgress', () => {
  // Default props for testing
  const defaultProps: MilestoneProgressProps = {
    currentStreak: 14,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByTestId } = render(<MilestoneProgress {...defaultProps} />);
      expect(getByTestId('milestone-progress')).toBeTruthy();
    });

    it('renders with in-progress state for active streak', () => {
      // Use 15 which is not a milestone, or pass 14 as celebrated
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={15} />
      );
      expect(getByLabelText(/Next milestone: 21 days/)).toBeTruthy();
    });

    it('renders no-streak state when currentStreak is 0', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={0} />
      );
      expect(getByLabelText(/No active streak/)).toBeTruthy();
    });

    it('renders celebration state when on a milestone', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={21} celebratedMilestones={[]} />
      );
      expect(getByLabelText(/Congratulations! You hit 21 days/)).toBeTruthy();
    });
  });

  describe('No-Streak State', () => {
    it('displays encouraging message', () => {
      const { getByText } = render(<MilestoneProgress currentStreak={0} />);
      expect(getByText('Start your streak today!')).toBeTruthy();
    });

    it('shows first milestone as goal', () => {
      const { getByText } = render(<MilestoneProgress currentStreak={0} />);
      expect(getByText(/3 days to unlock ⚡ Habit Starter/)).toBeTruthy();
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={0} />
      );
      expect(
        getByLabelText(/No active streak\. Start your streak today/)
      ).toBeTruthy();
    });
  });

  describe('In-Progress State', () => {
    it('displays next milestone days', () => {
      // Use 15 which is not a milestone
      const { getByText } = render(<MilestoneProgress currentStreak={15} />);
      expect(getByText(/Next Milestone: 21 Days/)).toBeTruthy();
    });

    it('displays milestone name', () => {
      const { getByText } = render(<MilestoneProgress currentStreak={15} />);
      expect(getByText('Habit Builder')).toBeTruthy();
    });

    it('displays days away', () => {
      const { getByText } = render(<MilestoneProgress currentStreak={15} />);
      expect(getByText('6 days away')).toBeTruthy();
    });

    it('displays singular "day" for 1 day remaining', () => {
      const { getByText } = render(<MilestoneProgress currentStreak={20} />);
      expect(getByText('1 day away')).toBeTruthy();
    });

    it('displays correct milestone badge', () => {
      const { getAllByText } = render(<MilestoneProgress currentStreak={15} />);
      // Should show 🏅 badge for 21-day milestone (appears in header and progress bar)
      const badges = getAllByText('🏅');
      expect(badges.length).toBeGreaterThanOrEqual(1);
    });

    it('has progressbar accessibility role', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={15} />
      );
      const element = getByLabelText(/Next milestone/);
      expect(element.props.accessibilityRole).toBe('progressbar');
    });

    it('has correct accessibility value', () => {
      const { getByTestId } = render(<MilestoneProgress currentStreak={15} />);
      const element = getByTestId('milestone-progress');
      expect(element.props.accessibilityValue).toEqual({
        max: 100,
        min: 0,
        now: expect.any(Number),
      });
    });
  });

  describe('Celebration State', () => {
    it('shows celebration emoji', () => {
      const { getByText } = render(
        <MilestoneProgress currentStreak={21} celebratedMilestones={[]} />
      );
      expect(getByText('🎉')).toBeTruthy();
    });

    it('shows milestone days and badge', () => {
      const { getByText } = render(
        <MilestoneProgress currentStreak={21} celebratedMilestones={[]} />
      );
      expect(getByText(/You hit 21 days! 🏅/)).toBeTruthy();
    });

    it('shows milestone name', () => {
      const { getByText } = render(
        <MilestoneProgress currentStreak={21} celebratedMilestones={[]} />
      );
      expect(getByText('Habit Builder')).toBeTruthy();
    });

    it('shows next milestone after celebration', () => {
      const { getByText } = render(
        <MilestoneProgress currentStreak={21} celebratedMilestones={[]} />
      );
      expect(getByText(/Next: 30 days 🏆/)).toBeTruthy();
    });

    it('does not show celebration if milestone already celebrated', () => {
      const { queryByText, getByText } = render(
        <MilestoneProgress currentStreak={21} celebratedMilestones={[21]} />
      );
      expect(queryByText('🎉')).toBeNull();
      // Should show in-progress state instead
      expect(getByText(/Next Milestone: 30 Days/)).toBeTruthy();
    });
  });

  describe('Milestone Callback', () => {
    it('calls onMilestoneHit when celebration state is displayed', () => {
      const onMilestoneHit = jest.fn();
      render(
        <MilestoneProgress
          currentStreak={21}
          celebratedMilestones={[]}
          onMilestoneHit={onMilestoneHit}
        />
      );
      // Note: The callback is called in useEffect, which runs after render
      expect(onMilestoneHit).toHaveBeenCalledWith(21);
    });

    it('does not call onMilestoneHit when milestone already celebrated', () => {
      const onMilestoneHit = jest.fn();
      render(
        <MilestoneProgress
          currentStreak={21}
          celebratedMilestones={[21]}
          onMilestoneHit={onMilestoneHit}
        />
      );
      expect(onMilestoneHit).not.toHaveBeenCalled();
    });

    it('does not call onMilestoneHit in no-streak state', () => {
      const onMilestoneHit = jest.fn();
      render(
        <MilestoneProgress currentStreak={0} onMilestoneHit={onMilestoneHit} />
      );
      expect(onMilestoneHit).not.toHaveBeenCalled();
    });
  });

  describe('All Milestone Thresholds', () => {
    const milestoneTests = [
      { days: 3, name: 'Habit Starter', badge: '⚡' },
      { days: 7, name: 'Week Warrior', badge: '⭐' },
      { days: 14, name: 'Two Week Titan', badge: '🔥' },
      { days: 21, name: 'Habit Builder', badge: '🏅' },
      { days: 30, name: 'Monthly Master', badge: '🏆' },
      { days: 60, name: 'Two Month Diamond', badge: '💎' },
      { days: 90, name: 'Quarterly Legend', badge: '🌟' },
      { days: 100, name: 'Century Club', badge: '💯' },
      { days: 365, name: 'Year Hero', badge: '👑' },
    ];

    milestoneTests.forEach(({ days, name, badge }) => {
      it(`shows celebration for ${days}-day milestone (${name})`, () => {
        const { getByText } = render(
          <MilestoneProgress currentStreak={days} celebratedMilestones={[]} />
        );
        expect(getByText(name)).toBeTruthy();
        expect(getByText(new RegExp(`${badge}`))).toBeTruthy();
      });
    });
  });

  describe('Progress Calculation', () => {
    it('shows correct progress for streak between milestones', () => {
      // At 18 days, progress should be between 14 and 21
      const { getByTestId } = render(<MilestoneProgress currentStreak={18} />);
      const element = getByTestId('milestone-progress');
      // (18-14)/(21-14) = 4/7 ≈ 57%
      expect(element.props.accessibilityValue.now).toBeGreaterThan(50);
      expect(element.props.accessibilityValue.now).toBeLessThan(70);
    });

    it('shows 0% progress at start of range', () => {
      // At 14 days exactly, just hit the milestone
      const { getByTestId } = render(
        <MilestoneProgress currentStreak={14} celebratedMilestones={[14]} />
      );
      const element = getByTestId('milestone-progress');
      expect(element.props.accessibilityValue.now).toBe(0);
    });

    it('shows correct labels on progress bar', () => {
      const { getByText } = render(
        <MilestoneProgress currentStreak={18} celebratedMilestones={[14]} />
      );
      // Should show start (14), current (18), and end (21)
      expect(getByText('14')).toBeTruthy();
      expect(getByText('18 days')).toBeTruthy();
      expect(getByText('21')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles streak of 1', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={1} />
      );
      expect(getByLabelText(/Next milestone: 3 days/)).toBeTruthy();
    });

    it('handles streak of 2', () => {
      const { getByText } = render(<MilestoneProgress currentStreak={2} />);
      expect(getByText('1 day away')).toBeTruthy();
    });

    it('handles streak beyond all milestones', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={400} celebratedMilestones={[365]} />
      );
      expect(
        getByLabelText(/You've achieved all milestones with 400 days/)
      ).toBeTruthy();
    });

    it('handles negative streak value gracefully', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={-5} />
      );
      // Should treat as no-streak state
      expect(getByLabelText(/No active streak/)).toBeTruthy();
    });

    it('handles very large streak values', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={1000} celebratedMilestones={[365]} />
      );
      expect(getByLabelText(/1000 days/)).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has text role in no-streak state', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={0} />
      );
      const element = getByLabelText(/No active streak/);
      expect(element.props.accessibilityRole).toBe('text');
    });

    it('has text role in celebration state', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={21} celebratedMilestones={[]} />
      );
      const element = getByLabelText(/Congratulations/);
      expect(element.props.accessibilityRole).toBe('text');
    });

    it('has progressbar role in in-progress state', () => {
      const { getByTestId } = render(
        <MilestoneProgress currentStreak={14} celebratedMilestones={[14]} />
      );
      const element = getByTestId('milestone-progress');
      expect(element.props.accessibilityRole).toBe('progressbar');
    });

    it('provides complete accessibility label with milestone info', () => {
      const { getByLabelText } = render(
        <MilestoneProgress currentStreak={14} celebratedMilestones={[14]} />
      );
      expect(
        getByLabelText(/Next milestone: 21 days, Habit Builder\. 7 days away/)
      ).toBeTruthy();
    });
  });
});

// Test utility functions
describe('MilestoneProgressTypes Utility Functions', () => {
  describe('getNextMilestone', () => {
    it('returns first milestone for 0 streak', () => {
      const result = getNextMilestone(0);
      expect(result?.days).toBe(3);
      expect(result?.name).toBe('Habit Starter');
    });

    it('returns correct next milestone', () => {
      expect(getNextMilestone(4)?.days).toBe(7);
      expect(getNextMilestone(15)?.days).toBe(21);
      expect(getNextMilestone(95)?.days).toBe(100);
    });

    it('returns null when beyond all milestones', () => {
      expect(getNextMilestone(365)).toBeNull();
      expect(getNextMilestone(500)).toBeNull();
    });
  });

  describe('getCurrentMilestone', () => {
    it('returns null for 0 streak', () => {
      expect(getCurrentMilestone(0)).toBeNull();
    });

    it('returns null for streak below first milestone', () => {
      expect(getCurrentMilestone(2)).toBeNull();
    });

    it('returns correct current milestone', () => {
      expect(getCurrentMilestone(3)?.days).toBe(3);
      expect(getCurrentMilestone(7)?.days).toBe(7);
      expect(getCurrentMilestone(15)?.days).toBe(14);
      expect(getCurrentMilestone(365)?.days).toBe(365);
    });

    it('returns highest achieved milestone', () => {
      expect(getCurrentMilestone(50)?.days).toBe(30);
      expect(getCurrentMilestone(99)?.days).toBe(90);
    });
  });

  describe('getPreviousMilestone', () => {
    it('returns null for streak at 0', () => {
      expect(getPreviousMilestone(0)).toBeNull();
    });

    it('returns null for streak below first milestone', () => {
      expect(getPreviousMilestone(2)).toBeNull();
    });

    it('returns correct previous milestone', () => {
      expect(getPreviousMilestone(10)?.days).toBe(7);
      expect(getPreviousMilestone(18)?.days).toBe(14);
      expect(getPreviousMilestone(50)?.days).toBe(30);
    });
  });

  describe('isOnMilestone', () => {
    it('returns true for milestone values', () => {
      expect(isOnMilestone(3)).toBe(true);
      expect(isOnMilestone(7)).toBe(true);
      expect(isOnMilestone(21)).toBe(true);
      expect(isOnMilestone(365)).toBe(true);
    });

    it('returns false for non-milestone values', () => {
      expect(isOnMilestone(0)).toBe(false);
      expect(isOnMilestone(5)).toBe(false);
      expect(isOnMilestone(15)).toBe(false);
      expect(isOnMilestone(100)).toBe(true);
      expect(isOnMilestone(101)).toBe(false);
    });
  });

  describe('calculateMilestoneProgress', () => {
    it('calculates no-streak state correctly', () => {
      const result = calculateMilestoneProgress(0);
      expect(result.displayState).toBe('no-streak');
      expect(result.nextMilestone?.days).toBe(3);
      expect(result.progressPercentage).toBe(0);
    });

    it('calculates in-progress state correctly', () => {
      const result = calculateMilestoneProgress(14, [14]);
      expect(result.displayState).toBe('in-progress');
      expect(result.nextMilestone?.days).toBe(21);
      expect(result.daysRemaining).toBe(7);
    });

    it('calculates just-hit state correctly', () => {
      const result = calculateMilestoneProgress(21, []);
      expect(result.displayState).toBe('just-hit');
      expect(result.currentMilestone?.days).toBe(21);
    });

    it('calculates progress percentage correctly', () => {
      // At 18 days, progress should be (18-14)/(21-14) = 4/7 ≈ 57%
      const result = calculateMilestoneProgress(18, [14]);
      expect(result.progressPercentage).toBe(57);
    });

    it('handles celebrated milestones correctly', () => {
      const result = calculateMilestoneProgress(21, [21]);
      expect(result.displayState).toBe('in-progress');
    });
  });

  describe('MILESTONES constant', () => {
    it('has 9 milestones', () => {
      expect(MILESTONES).toHaveLength(9);
    });

    it('milestones are in ascending order', () => {
      for (let i = 1; i < MILESTONES.length; i++) {
        expect(MILESTONES[i].days).toBeGreaterThan(MILESTONES[i - 1].days);
      }
    });

    it('each milestone has required properties', () => {
      MILESTONES.forEach((milestone) => {
        expect(milestone.days).toBeGreaterThan(0);
        expect(milestone.badge).toBeTruthy();
        expect(milestone.name).toBeTruthy();
      });
    });
  });
});
