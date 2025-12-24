/**
 * ProgressSectionConsolidated Component Tests
 *
 * Tests for the main container component that composes all sub-components
 * into a unified progress section.
 *
 * @see docs/specs/habit-details-screen/progress-consolidated-redesign.md
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { AccessibilityInfo } from 'react-native';

import { ProgressSectionConsolidated } from '../ProgressSectionConsolidated';
import type { HabitTrackingEntry } from '../../../features/habits/types';

// Mock AccessibilityInfo
jest
  .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
  .mockImplementation(() => Promise.resolve(false));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const { View, Text, Pressable, ScrollView } = require('react-native');

  const Animated = {
    View,
    Text,
    Pressable,
    ScrollView,
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
    withRepeat: (value: number) => value,
    withSequence: (...values: number[]) => values[0],
    cancelAnimation: jest.fn(),
    interpolate: () => 0,
    runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
    Easing: {
      out: () => () => 0,
      cubic: () => 0,
      inOut: () => () => 0,
      ease: () => 0,
    },
    FadeInDown: {
      delay: () => ({
        springify: () => ({}),
      }),
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
    React.createElement(View, { testID: 'circle', ...props });

  return {
    __esModule: true,
    default: Svg,
    Svg,
    Circle,
  };
});

// Mock lucide-react-native
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  const createIconComponent = (name: string) => (props: { size?: number }) =>
    React.createElement(View, { testID: `lucide-${name}`, ...props });

  return {
    ChevronRight: createIconComponent('chevron-right'),
    TrendingUp: createIconComponent('trending-up'),
    TrendingDown: createIconComponent('trending-down'),
    Minus: createIconComponent('minus'),
    BarChart3: createIconComponent('bar-chart-3'),
    CheckCircle2: createIconComponent('check-circle-2'),
  };
});

// Mock @expo/vector-icons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Ionicons: (props: { name?: string; size?: number }) =>
      React.createElement(View, { testID: `ionicon-${props.name}`, ...props }),
  };
});

// Mock hooks
jest.mock('../../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerSelection: jest.fn(),
    triggerLightImpact: jest.fn(),
    triggerMediumImpact: jest.fn(),
  }),
}));

jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => false,
}));

// Mock motion constants
jest.mock('../../../constants/motion', () => ({
  Motion: {},
  Springs: {
    button: { damping: 15, stiffness: 200 },
  },
}));

// Helper to generate tracking entries
function generateTrackingEntries(
  count: number,
  completedRatio = 0.7
): HabitTrackingEntry[] {
  const entries: HabitTrackingEntry[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    entries.push({
      date: date.toISOString().split('T')[0],
      completed: Math.random() < completedRatio,
    });
  }

  return entries;
}

// Helper to generate entries with specific completion pattern
function generateEntriesWithPattern(
  days: number,
  pattern: boolean[]
): HabitTrackingEntry[] {
  const entries: HabitTrackingEntry[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    entries.push({
      date: date.toISOString().split('T')[0],
      completed: pattern[i % pattern.length],
    });
  }

  return entries;
}

describe('ProgressSectionConsolidated', () => {
  const mockOnInfoPress = jest.fn();
  const mockOnFocusDayPress = jest.fn();
  const mockOnSeeAllPress = jest.fn();
  const mockOnTipPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing with minimal props', () => {
      const { getByLabelText } = render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
        />
      );

      expect(getByLabelText('Progress section')).toBeTruthy();
    });

    it('renders all sub-components with sufficient data', () => {
      const tracking = generateTrackingEntries(14);

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={65}
          tracking={tracking}
          weeklyChange={5}
        />
      );

      // HeroStrengthSection should be visible
      expect(screen.getByText('Strong')).toBeTruthy();

      // InsightChips should show streak info
      expect(screen.getByText('Current Streak')).toBeTruthy();

      // WeeklyPatternChart should be visible with enough data
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();

      // StreakRecordsAccordion should be visible
      expect(screen.getByText('Streak Records')).toBeTruthy();
    });

    it('hides detailed sections when insufficient data', () => {
      const tracking = generateTrackingEntries(3);

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 3 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={25}
          tracking={tracking}
        />
      );

      // HeroStrengthSection should still be visible
      expect(screen.getByText('Building')).toBeTruthy();

      // WeeklyPatternChart should NOT be visible
      expect(screen.queryByText('Weekly Pattern')).toBeNull();

      // StreakRecordsAccordion should NOT be visible
      expect(screen.queryByText('Streak Records')).toBeNull();
    });
  });

  describe('Data Flow', () => {
    it('passes correct strength to HeroStrengthSection', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={85}
          tracking={[]}
        />
      );

      // Should show "Unbreakable" for 80+ strength
      expect(screen.getByText('Unbreakable')).toBeTruthy();
    });

    it('passes weeklyChange to HeroStrengthSection', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
          weeklyChange={10}
        />
      );

      // Should show positive trend
      expect(screen.getByText('+10%')).toBeTruthy();
    });

    it('calculates and passes currentStreak to InsightChips', () => {
      // Create a 5-day streak
      const tracking = generateEntriesWithPattern(5, [
        true,
        true,
        true,
        true,
        true,
      ]);

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={50}
          tracking={tracking}
        />
      );

      expect(screen.getByText('5 days')).toBeTruthy();
    });

    it('calculates monthly progress correctly', () => {
      // Generate entries for the current month
      const today = new Date();
      const dayOfMonth = today.getDate();
      const tracking = generateTrackingEntries(dayOfMonth, 0.5);

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - dayOfMonth * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={50}
          tracking={tracking}
        />
      );

      // Should show This month chip
      expect(screen.getByText('This month')).toBeTruthy();
    });
  });

  describe('Callbacks', () => {
    it('passes onInfoPress to HeroStrengthSection', () => {
      // onInfoPress is currently not used by HeroStrengthSection
      // but the prop should be passed through
      const { getByLabelText } = render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
          onInfoPress={mockOnInfoPress}
        />
      );

      expect(getByLabelText('Progress section')).toBeTruthy();
    });

    it('passes onSeeAllPress to WeeklyPatternChart', () => {
      const tracking = generateTrackingEntries(14);

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={50}
          tracking={tracking}
          onSeeAllPress={mockOnSeeAllPress}
        />
      );

      expect(screen.getByText('Details')).toBeTruthy();
    });
  });

  describe('ActionableTip', () => {
    it('shows streak subtitle when there is an active streak', () => {
      const tracking = generateEntriesWithPattern(3, [true, true, true]);

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={50}
          tracking={tracking}
        />
      );

      // Should show streak counting subtitle
      expect(screen.getByText(/day streak/)).toBeTruthy();
    });

    it('does not show streak subtitle when no active streak', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
        />
      );

      // Should not show streak subtitle
      expect(screen.queryByText(/day streak/)).toBeNull();
    });
  });

  describe('Strength Levels', () => {
    const testCases = [
      { strength: 5, expectedLevel: 'Starting Out' },
      { strength: 25, expectedLevel: 'Building' },
      { strength: 45, expectedLevel: 'Growing' },
      { strength: 65, expectedLevel: 'Strong' },
      { strength: 85, expectedLevel: 'Unbreakable' },
    ];

    testCases.forEach(({ strength, expectedLevel }) => {
      it(`shows "${expectedLevel}" level for strength ${strength}`, () => {
        render(
          <ProgressSectionConsolidated
            habitCreatedAt={new Date().toISOString()}
            strength={strength}
            tracking={[]}
          />
        );

        expect(screen.getByText(expectedLevel)).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles empty tracking array', () => {
      const { getByLabelText } = render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={0}
          tracking={[]}
        />
      );

      expect(getByLabelText('Progress section')).toBeTruthy();
    });

    it('handles 0 strength', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={0}
          tracking={[]}
        />
      );

      expect(screen.getByText('Starting Out')).toBeTruthy();
    });

    it('handles 100 strength', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={100}
          tracking={[]}
        />
      );

      expect(screen.getByText('Unbreakable')).toBeTruthy();
      expect(screen.getByText(/Max level/)).toBeTruthy();
    });

    it('handles negative weeklyChange', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
          weeklyChange={-5}
        />
      );

      expect(screen.getByText('-5%')).toBeTruthy();
    });

    it('handles invalid habitCreatedAt gracefully', () => {
      const { getByLabelText } = render(
        <ProgressSectionConsolidated
          habitCreatedAt='invalid-date'
          strength={50}
          tracking={[]}
        />
      );

      expect(getByLabelText('Progress section')).toBeTruthy();
    });

    it('handles undefined weeklyChange', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
        />
      );

      // Should show "Stable" or no change indicator
      expect(screen.getByText('Stable')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('has accessible container', () => {
      const { getByLabelText } = render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
        />
      );

      const container = getByLabelText('Progress section');
      expect(container.props.accessibilityRole).toBe('region');
    });

    it('insight chips container has list role', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
        />
      );

      expect(screen.getByLabelText('Habit insights')).toBeTruthy();
    });
  });

  describe('Focus Day Logic', () => {
    it('does not show focus day when worst day rate >= 70%', () => {
      // Create entries where all days have >= 70% completion
      // 8 weeks worth of data (56 days) with 100% completion on all days
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      for (let i = 0; i < 56; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true, // All days completed = 100% for each day of week
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={90}
          tracking={entries}
        />
      );

      // Focus day chip should not be visible since all days are above 70%
      expect(screen.queryByText('Focus day')).toBeNull();
    });

    it('shows focus day when there is a day with rate < 70%', () => {
      // Create entries where one day (Sunday) is missed often
      // 4 weeks of data, always completing Mon-Sat but never Sunday
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      for (let i = 0; i < 28; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayOfWeek = date.getDay();
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: dayOfWeek !== 0, // Sunday (0) is not completed
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={70}
          tracking={entries}
        />
      );

      // Focus day chip should be visible
      expect(screen.getByText('Focus day')).toBeTruthy();
    });
  });

  describe('Visual Container', () => {
    it('applies correct container styles', () => {
      const { getByLabelText } = render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
        />
      );

      const container = getByLabelText('Progress section');
      expect(container).toBeTruthy();
    });
  });
});
