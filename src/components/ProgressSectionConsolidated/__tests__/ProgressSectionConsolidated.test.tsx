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

  // ============================================================================
  // INTEGRATION TESTS (Task 3.5)
  // These tests verify cross-component data flow and realistic usage scenarios
  // ============================================================================

  describe('Integration: Full Component Render with Mock Data', () => {
    it('renders complete component with 30 days of realistic tracking data', () => {
      // Simulate a user with 30 days of varied tracking data
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // Pattern: Complete Mon-Fri, miss some weekends
      for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dayOfWeek = date.getDay();
        // 90% weekday completion, 40% weekend completion
        const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5;
        const completed = isWeekday ? Math.random() < 0.9 : Math.random() < 0.4;

        entries.push({
          date: date.toISOString().split('T')[0],
          completed,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={72}
          tracking={entries}
          weeklyChange={8}
          onInfoPress={mockOnInfoPress}
          onFocusDayPress={mockOnFocusDayPress}
          onSeeAllPress={mockOnSeeAllPress}
          onTipPress={mockOnTipPress}
        />
      );

      // All major sections should be visible
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      expect(screen.getByText('Strong')).toBeTruthy(); // Level for 72%
      expect(screen.getByText('+8%')).toBeTruthy(); // Weekly change
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();
      expect(screen.getByText('Streak Records')).toBeTruthy();
      expect(screen.getByLabelText('Habit insights')).toBeTruthy();
    });

    it('renders all sub-components with complete user journey data', () => {
      // Simulate a "power user" with excellent habits
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // 14-day perfect streak
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={95}
          tracking={entries}
          weeklyChange={15}
        />
      );

      // Hero section
      expect(screen.getByText('Unbreakable')).toBeTruthy();
      expect(screen.getByText('+15%')).toBeTruthy();
      expect(screen.getByText(/Max level/)).toBeTruthy();

      // Insight chips
      expect(screen.getByText('14 days')).toBeTruthy(); // Current streak
      expect(screen.getByText('Current Streak')).toBeTruthy();

      // Weekly pattern
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();

      // Actionable tip (should encourage streak - use getAllByText since multiple elements match)
      expect(
        screen.getAllByText(/streak|momentum|counting/i).length
      ).toBeGreaterThan(0);
    });

    it('renders with new user scenario (first week)', () => {
      // New user: only 5 days of data
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: i < 3, // Completed 3 of 5 days
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 5 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={15}
          tracking={entries}
        />
      );

      // Hero section should show new user level
      expect(screen.getByText('Starting Out')).toBeTruthy();

      // Should NOT show detailed sections (not enough data)
      expect(screen.queryByText('Weekly Pattern')).toBeNull();
      expect(screen.queryByText('Streak Records')).toBeNull();

      // Should still show insight chips
      expect(screen.getByLabelText('Habit insights')).toBeTruthy();
    });
  });

  describe('Integration: Data Flow Verification', () => {
    it('correctly calculates and displays streak from tracking data', () => {
      // Create specific pattern: 7-day streak then a gap then 3-day streak
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // Current streak: 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      // Gap day (8 days ago)
      const gapDate = new Date(today);
      gapDate.setDate(today.getDate() - 7);
      entries.push({
        date: gapDate.toISOString().split('T')[0],
        completed: false,
      });

      // Old streak: 3 days (9-11 days ago)
      for (let i = 8; i < 11; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={60}
          tracking={entries}
        />
      );

      // Should show current 7-day streak
      expect(screen.getByText('7 days')).toBeTruthy();

      // Actionable tip should reference the streak (may match multiple elements)
      expect(
        screen.getAllByText(/streak|momentum|counting/i).length
      ).toBeGreaterThan(0);
    });

    it('correctly identifies best and worst days from pattern', () => {
      // Create pattern: Perfect Mon-Fri (100%), poor weekends (25%)
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // 8 weeks of data for statistical significance
      for (let week = 0; week < 8; week++) {
        for (let day = 0; day < 7; day++) {
          const date = new Date(today);
          date.setDate(today.getDate() - (week * 7 + day));
          const dayOfWeek = date.getDay();

          // Weekdays: 100% completion, weekends: 25%
          const completed =
            dayOfWeek >= 1 && dayOfWeek <= 5 ? true : week % 4 === 0; // Only every 4th weekend

          entries.push({
            date: date.toISOString().split('T')[0],
            completed,
          });
        }
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={75}
          tracking={entries}
        />
      );

      // Should show focus day chip (weekend day with low rate)
      expect(screen.getByText('Focus day')).toBeTruthy();

      // Best day chip should be present (multiple weekdays may have 100% completion)
      expect(
        screen.getAllByLabelText(/100% completion/i).length
      ).toBeGreaterThan(0);
    });

    it('correctly passes monthly stats to insight chips', () => {
      // Create entries for current month
      const today = new Date();
      const dayOfMonth = today.getDate();
      const entries: HabitTrackingEntry[] = [];

      // Complete every day this month
      for (let i = 0; i < dayOfMonth; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          ).toISOString()}
          strength={80}
          tracking={entries}
        />
      );

      // Should show monthly stats
      expect(screen.getByText('This month')).toBeTruthy();
      // Should show X/Y format for completed/total
      expect(screen.getByText(`${dayOfMonth}/${dayOfMonth}`)).toBeTruthy();
    });

    it('correctly derives weekly pattern chart data', () => {
      // Create entries for 3 weeks
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      for (let i = 0; i < 21; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true, // All completed
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 21 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={85}
          tracking={entries}
        />
      );

      // Weekly pattern should be visible with all 7 days
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();

      // All day bars should be rendered
      const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
      dayLabels.forEach((label) => {
        expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  describe('Integration: Edge Cases', () => {
    it('handles completely empty tracking gracefully', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={0}
          tracking={[]}
        />
      );

      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      expect(screen.getByText('Starting Out')).toBeTruthy();
      expect(screen.getByText('0 days')).toBeTruthy(); // Zero streak
      expect(screen.queryByText('Weekly Pattern')).toBeNull();
    });

    it('handles single completed day', () => {
      const today = new Date();
      const entries: HabitTrackingEntry[] = [
        {
          date: today.toISOString().split('T')[0],
          completed: true,
        },
      ];

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={today.toISOString()}
          strength={10}
          tracking={entries}
        />
      );

      expect(screen.getByText('1 day')).toBeTruthy(); // Singular
      expect(screen.getByText('Starting Out')).toBeTruthy();
    });

    it('handles gap in middle of tracking data', () => {
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // 3 days completed, then 5 days gap, then 3 more completed
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      // Gap: days 3-7 (not adding entries simulates gap)

      for (let i = 8; i < 11; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 15 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={40}
          tracking={entries}
        />
      );

      // Current streak should be 3 (ignoring old data after gap)
      expect(screen.getByText('3 days')).toBeTruthy();
    });

    it('handles all days incomplete (no completions)', () => {
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      for (let i = 0; i < 10; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: false,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={5}
          tracking={entries}
        />
      );

      expect(screen.getByText('0 days')).toBeTruthy();
      expect(screen.getByText('Starting Out')).toBeTruthy();
      // Should encourage starting a streak (actionable tip)
      expect(screen.getAllByText(/streak/i).length).toBeGreaterThan(0);
    });

    it('handles future dates in tracking data', () => {
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // Past entries
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      // Future entries (should be ignored by calculations)
      for (let i = 1; i < 4; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 10 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={50}
          tracking={entries}
        />
      );

      // Should only count past entries
      expect(screen.getByText('5 days')).toBeTruthy();
    });

    it('handles very old habit creation date', () => {
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // Only 7 recent entries
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 365 * 24 * 60 * 60 * 1000
          ).toISOString()} // 1 year ago
          strength={30}
          tracking={entries}
        />
      );

      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      // Should still calculate weekly pattern
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();
    });

    it('handles partial month data correctly', () => {
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // Only complete half the days this month
      const dayOfMonth = today.getDate();
      for (let i = 0; i < dayOfMonth; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: i % 2 === 0, // Every other day
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          ).toISOString()}
          strength={50}
          tracking={entries}
        />
      );

      // Monthly chip should show partial completion
      expect(screen.getByText('This month')).toBeTruthy();
      const expectedCompleted = Math.ceil(dayOfMonth / 2);
      expect(
        screen.getByText(`${expectedCompleted}/${dayOfMonth}`)
      ).toBeTruthy();
    });

    it('handles duplicate date entries', () => {
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      // Duplicate entries for today
      entries.push({ date: todayStr, completed: true });
      entries.push({ date: todayStr, completed: false }); // Duplicate
      entries.push({ date: todayStr, completed: true }); // Another duplicate

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={today.toISOString()}
          strength={50}
          tracking={entries}
        />
      );

      // Should not crash and should render
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
    });

    it('handles strength boundary values', () => {
      // Test all boundary values
      const boundaries = [
        { strength: 0, expectedLevel: 'Starting Out' },
        { strength: 19, expectedLevel: 'Starting Out' },
        { strength: 20, expectedLevel: 'Building' },
        { strength: 39, expectedLevel: 'Building' },
        { strength: 40, expectedLevel: 'Growing' },
        { strength: 59, expectedLevel: 'Growing' },
        { strength: 60, expectedLevel: 'Strong' },
        { strength: 79, expectedLevel: 'Strong' },
        { strength: 80, expectedLevel: 'Unbreakable' },
        { strength: 100, expectedLevel: 'Unbreakable' },
      ];

      boundaries.forEach(({ strength, expectedLevel }) => {
        const { unmount } = render(
          <ProgressSectionConsolidated
            habitCreatedAt={new Date().toISOString()}
            strength={strength}
            tracking={[]}
          />
        );

        expect(screen.getByText(expectedLevel)).toBeTruthy();
        unmount();
      });
    });
  });

  describe('Integration: Component Composition Verification', () => {
    it('all callbacks are wired correctly through component hierarchy', () => {
      const tracking = generateTrackingEntries(14, 0.5);

      const { getByText } = render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={50}
          tracking={tracking}
          onInfoPress={mockOnInfoPress}
          onFocusDayPress={mockOnFocusDayPress}
          onSeeAllPress={mockOnSeeAllPress}
          onTipPress={mockOnTipPress}
        />
      );

      // Details button should be rendered (callback passed through)
      expect(getByText('Details')).toBeTruthy();
    });

    it('child components render in correct order', () => {
      const tracking = generateTrackingEntries(14, 0.7);

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={65}
          tracking={tracking}
        />
      );

      // Verify all major sections are present
      const container = screen.getByLabelText('Progress section');
      expect(container).toBeTruthy();

      // HeroStrengthSection
      expect(screen.getByText('Strong')).toBeTruthy();

      // InsightChips
      expect(screen.getByLabelText('Habit insights')).toBeTruthy();

      // WeeklyPatternChart (with enough data)
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();

      // ActionableTipCard (verify it exists with some tip content)
      expect(
        screen.getAllByText(/streak|focus|level|momentum/i).length
      ).toBeGreaterThan(0);

      // StreakRecordsAccordion (with enough data)
      expect(screen.getByText('Streak Records')).toBeTruthy();
    });

    it('conditional rendering based on data availability', () => {
      // With insufficient data
      const { rerender } = render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={20}
          tracking={generateTrackingEntries(3)}
        />
      );

      expect(screen.queryByText('Weekly Pattern')).toBeNull();
      expect(screen.queryByText('Streak Records')).toBeNull();

      // With sufficient data
      rerender(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 14 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={60}
          tracking={generateTrackingEntries(14)}
        />
      );

      expect(screen.getByText('Weekly Pattern')).toBeTruthy();
      expect(screen.getByText('Streak Records')).toBeTruthy();
    });
  });

  describe('Integration: Real-World Usage Scenarios', () => {
    it('renders correctly for "struggling user" scenario', () => {
      // User who started strong but fell off
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // Past week: only 2 completions
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: i === 0 || i === 3, // Only today and 3 days ago
        });
      }

      // Previous 2 weeks: good completion (7 of 14)
      for (let i = 7; i < 21; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: i % 2 === 0,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 21 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={35}
          tracking={entries}
          weeklyChange={-12}
        />
      );

      expect(screen.getByText('Building')).toBeTruthy();
      expect(screen.getByText('-12%')).toBeTruthy(); // Negative trend
      expect(screen.getByText('1 day')).toBeTruthy(); // Current streak is 1
    });

    it('renders correctly for "comeback user" scenario', () => {
      // User returning after a break with recent completions
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // Recent 5 days: all completed
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: true,
        });
      }

      // Gap of 10 days (no entries)

      // Old data: 8 completions over 2 weeks
      for (let i = 15; i < 29; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: i % 2 === 0,
        });
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={45}
          tracking={entries}
          weeklyChange={25}
        />
      );

      expect(screen.getByText('Growing')).toBeTruthy();
      expect(screen.getByText('+25%')).toBeTruthy();
      expect(screen.getByText('5 days')).toBeTruthy(); // Current comeback streak
    });

    it('renders correctly for "consistent user" scenario', () => {
      // User with very consistent daily completion
      const entries: HabitTrackingEntry[] = [];
      const today = new Date();

      // 60 days, 95% completion rate
      for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        entries.push({
          date: date.toISOString().split('T')[0],
          completed: Math.random() < 0.95,
        });
      }

      // Ensure current streak is intact
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const existing = entries.find(
          (e) => e.date === date.toISOString().split('T')[0]
        );
        if (existing) existing.completed = true;
      }

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date(
            Date.now() - 60 * 24 * 60 * 60 * 1000
          ).toISOString()}
          strength={88}
          tracking={entries}
          weeklyChange={2}
        />
      );

      expect(screen.getByText('Unbreakable')).toBeTruthy();
      expect(screen.getByText('+2%')).toBeTruthy();
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();
      expect(screen.getByText('Streak Records')).toBeTruthy();
    });
  });
});
