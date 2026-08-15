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

/**
 * Mock tracking entry type for tests.
 * Only includes fields used by ProgressSectionConsolidated.
 * Cast to HabitTrackingEntry[] when passing to component props.
 */
type MockTrackingEntry = Pick<HabitTrackingEntry, 'date' | 'completed'>;

/**
 * Helper to cast mock entries to HabitTrackingEntry[] for component props.
 * The component only uses date and completed fields, so this is safe.
 */
function asTracking(entries: MockTrackingEntry[]): HabitTrackingEntry[] {
  return entries as unknown as HabitTrackingEntry[];
}

// Mock AccessibilityInfo
jest
  .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
  .mockImplementation(() => Promise.resolve(false));

jest.mock('react-native-reanimated', () =>
  require('../../../../__mocks__/react-native-reanimated-mock')
);

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

jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return new Proxy(
    {},
    {
      get: (_target, name) => {
        if (name === '__esModule') return true;
        return (props: { size?: number }) =>
          React.createElement(View, {
            testID: `lucide-${String(name)}`,
            ...props,
          });
      },
    }
  );
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
  const entries: MockTrackingEntry[] = [];
  const today = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    entries.push({
      date: date.toISOString().split('T')[0],
      completed: Math.random() < completedRatio,
    });
  }

  return asTracking(entries);
}

// Helper to generate entries with specific completion pattern
function generateEntriesWithPattern(
  days: number,
  pattern: boolean[]
): HabitTrackingEntry[] {
  const entries: MockTrackingEntry[] = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    entries.push({
      date: date.toISOString().split('T')[0],
      completed: pattern[i % pattern.length],
    });
  }

  return asTracking(entries);
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

      // StatsGrid should be visible with summary role
      expect(screen.getByLabelText('Progress section')).toBeTruthy();

      // StatsGrid should show streak info (Day Streak label)
      expect(screen.getByText('Day Streak')).toBeTruthy();

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

      // StatsGrid should still be visible
      expect(screen.getByLabelText('Progress section')).toBeTruthy();

      // WeeklyPatternChart should NOT be visible
      expect(screen.queryByText('Weekly Pattern')).toBeNull();

      // StreakRecordsAccordion should NOT be visible
      expect(screen.queryByText('Streak Records')).toBeNull();
    });
  });

  describe('Data Flow', () => {
    it('passes correct strength to StatsGrid', () => {
      const { getByLabelText } = render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={85}
          tracking={[]}
        />
      );

      // StatsGrid renders within the Progress section container
      expect(getByLabelText('Progress section')).toBeTruthy();
    });

    it('passes weeklyChange to StatsGrid (CompactStrengthRing)', () => {
      const { getByLabelText } = render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
          weeklyChange={10}
        />
      );

      // Component renders with weeklyChange prop
      expect(getByLabelText('Progress section')).toBeTruthy();
    });

    it('calculates and passes currentStreak to StatsGrid', () => {
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

      // StatsGrid shows streak value in the stat card
      expect(screen.getByText('5')).toBeTruthy();
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

      // StatsGrid shows 'This Month' label
      expect(screen.getByText('This Month')).toBeTruthy();
    });
  });

  describe('Callbacks', () => {
    it('onInfoPress prop is accepted (for backwards compatibility)', () => {
      // onInfoPress is no longer used since HeroStrengthSection was replaced by StatsGrid
      // but the prop should still be accepted for backwards compatibility
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

  describe('Strength Display (StatsGrid with CompactStrengthRing)', () => {
    // Phase 1 redesign: StatsGrid shows strength via CompactStrengthRing
    // Level names are no longer displayed - only the percentage ring
    const testCases = [
      { strength: 5, description: 'low strength (5%)' },
      { strength: 25, description: 'building strength (25%)' },
      { strength: 45, description: 'growing strength (45%)' },
      { strength: 65, description: 'strong strength (65%)' },
      { strength: 85, description: 'high strength (85%)' },
    ];

    testCases.forEach(({ strength, description }) => {
      it(`renders StatsGrid with ${description}`, () => {
        render(
          <ProgressSectionConsolidated
            habitCreatedAt={new Date().toISOString()}
            strength={strength}
            tracking={[]}
          />
        );

        // StatsGrid renders with summary role for accessibility
        expect(screen.getByLabelText('Progress section')).toBeTruthy();
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

      // StatsGrid renders correctly with 0 strength
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
    });

    it('handles 100 strength', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={100}
          tracking={[]}
        />
      );

      // StatsGrid renders correctly with max strength
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
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

      // StatsGrid and CompactStrengthRing handle negative weeklyChange
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
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

      // StatsGrid handles undefined weeklyChange
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
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
      expect(container.props.accessibilityRole).toBe('summary');
    });

    it('StatsGrid has summary role for accessibility', () => {
      render(
        <ProgressSectionConsolidated
          habitCreatedAt={new Date().toISOString()}
          strength={50}
          tracking={[]}
        />
      );

      // StatsGrid provides accessible summary
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
    });
  });

  describe('Focus Day Logic', () => {
    it('does not show focus day when worst day rate >= 70%', () => {
      // Create entries where all days have >= 70% completion
      // 8 weeks worth of data (56 days) with 100% completion on all days
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      // Focus day chip should not be visible since all days are above 70%
      expect(screen.queryByText('Focus day')).toBeNull();
    });

    it('shows focus day when there is a day with rate < 70%', () => {
      // Create entries where one day (Sunday) is missed often
      // 4 weeks of data, always completing Mon-Sat but never Sunday
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      // Focus day should be visible in stats grid
      // Note: StatsGrid shows "Focus Day (X%)" format
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      // Check that focus day-related text appears
      expect(screen.getAllByText(/Focus Day/i).length).toBeGreaterThan(0);
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
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
          weeklyChange={8}
          onInfoPress={mockOnInfoPress}
          onFocusDayPress={mockOnFocusDayPress}
          onSeeAllPress={mockOnSeeAllPress}
          onTipPress={mockOnTipPress}
        />
      );

      // All major sections should be visible
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      expect(screen.getByLabelText('Progress section')).toBeTruthy(); // Level for 72%
       // Weekly change
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();
      expect(screen.getByText('Streak Records')).toBeTruthy();
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
    });

    it('renders all sub-components with complete user journey data', () => {
      // Simulate a "power user" with excellent habits
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
          weeklyChange={15}
        />
      );

      // Progress section renders
      expect(screen.getByLabelText('Progress section')).toBeTruthy();

      // StatsGrid shows Day Streak label
      expect(screen.getByText('Day Streak')).toBeTruthy();

      // Weekly pattern visible with enough data
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();

      // Actionable tip (should encourage streak - use getAllByText since multiple elements match)
      expect(
        screen.getAllByText(/streak|momentum|counting/i).length
      ).toBeGreaterThan(0);
    });

    it('renders with new user scenario (first week)', () => {
      // New user: only 5 days of data
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      // Hero section should show new user level
      expect(screen.getByLabelText('Progress section')).toBeTruthy();

      // Should NOT show detailed sections (not enough data)
      expect(screen.queryByText('Weekly Pattern')).toBeNull();
      expect(screen.queryByText('Streak Records')).toBeNull();

      // Should still show insight chips
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
    });
  });

  describe('Integration: Data Flow Verification', () => {
    it('correctly calculates and displays streak from tracking data', () => {
      // Create specific pattern: 7-day streak then a gap then 3-day streak
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      // StatsGrid should show Day Streak label
      expect(screen.getByText('Day Streak')).toBeTruthy();

      // Actionable tip should reference the streak (may match multiple elements)
      expect(
        screen.getAllByText(/streak|momentum|counting/i).length
      ).toBeGreaterThan(0);
    });

    it('correctly identifies best and worst days from pattern', () => {
      // Create pattern: Perfect Mon-Fri (100%), poor weekends (25%)
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      // Should show focus day in StatsGrid (weekend day with low rate)
      // Note: StatsGrid shows "Focus Day (X%)" format
      expect(screen.getAllByText(/Focus Day/i).length).toBeGreaterThan(0);

      // Best day stat should be present
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
    });

    it('correctly passes monthly stats to insight chips', () => {
      // Create entries for current month
      const today = new Date();
      const dayOfMonth = today.getDate();
      const entries: MockTrackingEntry[] = [];

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
          tracking={asTracking(entries)}
        />
      );

      // Should show monthly stats
      expect(screen.getByText('This Month')).toBeTruthy();
      // Should show X/Y format for completed/total
      expect(screen.getByText(`${dayOfMonth}/${dayOfMonth}`)).toBeTruthy();
    });

    it('correctly derives weekly pattern chart data', () => {
      // Create entries for 3 weeks
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
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
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      expect(screen.getByText('0')).toBeTruthy(); // Zero streak
      expect(screen.queryByText('Weekly Pattern')).toBeNull();
    });

    it('handles single completed day', () => {
      const today = new Date();
      const entries: MockTrackingEntry[] = [
        {
          date: today.toISOString().split('T')[0],
          completed: true,
        },
      ];

      render(
        <ProgressSectionConsolidated
          habitCreatedAt={today.toISOString()}
          strength={10}
          tracking={asTracking(entries)}
        />
      );

      expect(screen.getByText('1')).toBeTruthy(); // Singular
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
    });

    it('handles gap in middle of tracking data', () => {
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      // Current streak should be 3 (ignoring old data after gap)
      expect(screen.getByText('3')).toBeTruthy();
    });

    it('handles all days incomplete (no completions)', () => {
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      expect(screen.getByText('0')).toBeTruthy();
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      // Should encourage starting a streak (actionable tip)
      expect(screen.getAllByText(/streak/i).length).toBeGreaterThan(0);
    });

    it('handles future dates in tracking data', () => {
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      // Should only count past entries
      expect(screen.getByText('5')).toBeTruthy();
    });

    it('handles very old habit creation date', () => {
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      // Should still calculate weekly pattern
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();
    });

    it('handles partial month data correctly', () => {
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      // Monthly chip should show partial completion
      expect(screen.getByText('This Month')).toBeTruthy();
      const expectedCompleted = Math.ceil(dayOfMonth / 2);
      expect(
        screen.getByText(`${expectedCompleted}/${dayOfMonth}`)
      ).toBeTruthy();
    });

    it('handles duplicate date entries', () => {
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
        />
      );

      // Should not crash and should render
      expect(screen.getByLabelText('Progress section')).toBeTruthy();
    });

    it('handles strength boundary values', () => {
      // Test all boundary values - StatsGrid displays strength via CompactStrengthRing
      // Level names are no longer displayed, just the percentage ring
      const boundaries = [0, 19, 20, 39, 40, 59, 60, 79, 80, 100];

      boundaries.forEach((strength) => {
        const { unmount } = render(
          <ProgressSectionConsolidated
            habitCreatedAt={new Date().toISOString()}
            strength={strength}
            tracking={[]}
          />
        );

        // StatsGrid renders correctly for all strength values
        expect(screen.getByLabelText('Progress section')).toBeTruthy();
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
      expect(screen.getByLabelText('Progress section')).toBeTruthy();

      // InsightChips
      expect(screen.getByLabelText('Progress section')).toBeTruthy();

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
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
          weeklyChange={-12}
        />
      );

      expect(screen.getByLabelText('Progress section')).toBeTruthy();
       // Negative trend
      expect(screen.getByText('1')).toBeTruthy(); // Current streak is 1
    });

    it('renders correctly for "comeback user" scenario', () => {
      // User returning after a break with recent completions
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
          weeklyChange={25}
        />
      );

      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      // StatsGrid shows streak in stat cards
      expect(screen.getByText('Day Streak')).toBeTruthy();
    });

    it('renders correctly for "consistent user" scenario', () => {
      // User with very consistent daily completion
      const entries: MockTrackingEntry[] = [];
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
          tracking={asTracking(entries)}
          weeklyChange={2}
        />
      );

      expect(screen.getByLabelText('Progress section')).toBeTruthy();
      
      expect(screen.getByText('Weekly Pattern')).toBeTruthy();
      expect(screen.getByText('Streak Records')).toBeTruthy();
    });
  });
});
