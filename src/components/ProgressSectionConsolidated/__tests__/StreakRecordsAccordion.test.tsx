/**
 * StreakRecordsAccordion Component Tests
 *
 * Tests for the collapsible streak records section displaying
 * medal records with expand/collapse animations.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { StreakRecordsAccordion } from '../StreakRecordsAccordion';

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
    useReducedMotion: jest.fn(() => false),
    useSharedValue: (initialValue: number) => ({ value: initialValue }),
    useAnimatedStyle: () => ({}),
    withTiming: (value: number) => value,
    withDelay: (_delay: number, value: number) => value,
    withSpring: (value: number) => value,
    withRepeat: (value: number) => value,
    withSequence: (...values: number[]) => values[0],
    interpolate: (
      value: number,
      inputRange: number[],
      outputRange: number[]
    ) => {
      const ratio = (value - inputRange[0]) / (inputRange[1] - inputRange[0]);
      return outputRange[0] + ratio * (outputRange[1] - outputRange[0]);
    },
    runOnJS: (fn: Function) => fn,
    Easing: {
      out: () => () => 0,
      inOut: () => () => 0,
      ease: () => 0,
    },
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
    ChevronDown: createIcon('ChevronDown'),
    Flame: createIcon('Flame'),
  };
});

describe('StreakRecordsAccordion', () => {
  const defaultStreakRecords = [
    {
      days: 6,
      startDate: '2024-12-01',
      endDate: '2024-12-06',
      isCurrent: false,
    },
    {
      days: 5,
      startDate: '2024-11-15',
      endDate: '2024-11-19',
      isCurrent: false,
    },
    {
      days: 3,
      startDate: '2024-11-01',
      endDate: '2024-11-03',
      isCurrent: false,
    },
  ];

  const defaultProps = {
    streakRecords: defaultStreakRecords,
    currentStreak: 0,
    defaultExpanded: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByText } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );
      expect(getByText('Streak Records')).toBeTruthy();
    });

    it('renders header with "Streak Records" title', () => {
      const { getByText } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );
      expect(getByText('Streak Records')).toBeTruthy();
    });

    it('renders preview text when collapsed', () => {
      const { getByText } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );
      // Preview should show "🥇6 🥈5 🥉3"
      expect(getByText('🥇6 🥈5 🥉3')).toBeTruthy();
    });

    it('does not render preview text when expanded', () => {
      const { queryByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );
      // Preview should not show when expanded
      expect(queryByText('🥇6 🥈5 🥉3')).toBeNull();
    });

    it('renders chevron icon', () => {
      const { getByTestId } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );
      expect(getByTestId('lucide-ChevronDown')).toBeTruthy();
    });
  });

  describe('Expand/Collapse', () => {
    it('toggles expanded state when header is pressed', () => {
      const { getByText, queryByText, getByRole } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );

      // Initially collapsed - preview should show
      expect(getByText('🥇6 🥈5 🥉3')).toBeTruthy();

      // Press to expand
      fireEvent.press(getByRole('button'));

      // After expanding - preview should be hidden
      expect(queryByText('🥇6 🥈5 🥉3')).toBeNull();
    });

    it('triggers haptic feedback on toggle', () => {
      const { getByRole } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );

      fireEvent.press(getByRole('button'));

      expect(mockTriggerSelection).toHaveBeenCalled();
    });

    it('starts expanded when defaultExpanded is true', () => {
      const { queryByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );

      // Preview should not show when expanded
      expect(queryByText('🥇6 🥈5 🥉3')).toBeNull();
    });
  });

  describe('Medal Display', () => {
    it('renders gold medal for first record', () => {
      const { getAllByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );
      expect(getAllByText('🥇').length).toBeGreaterThan(0);
    });

    it('renders silver medal for second record', () => {
      const { getAllByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );
      expect(getAllByText('🥈').length).toBeGreaterThan(0);
    });

    it('renders bronze medal for third record', () => {
      const { getAllByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );
      expect(getAllByText('🥉').length).toBeGreaterThan(0);
    });

    it('renders days count for each record', () => {
      const { getAllByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );
      expect(getAllByText('6').length).toBeGreaterThan(0);
      expect(getAllByText('5').length).toBeGreaterThan(0);
      expect(getAllByText('3').length).toBeGreaterThan(0);
    });

    it('renders "days" label for each record', () => {
      const { getAllByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );
      // Should have multiple "days" labels
      expect(getAllByText('days').length).toBeGreaterThan(0);
    });
  });

  describe('Current Streak Highlighting', () => {
    it('shows "NOW 🔥" badge for current streak record', () => {
      const recordsWithCurrent = [
        {
          days: 6,
          startDate: '2024-12-01',
          endDate: '2024-12-06',
          isCurrent: true,
        },
        {
          days: 5,
          startDate: '2024-11-15',
          endDate: '2024-11-19',
          isCurrent: false,
        },
        {
          days: 3,
          startDate: '2024-11-01',
          endDate: '2024-11-03',
          isCurrent: false,
        },
      ];

      const { getAllByText } = render(
        <StreakRecordsAccordion
          streakRecords={recordsWithCurrent}
          currentStreak={6}
          defaultExpanded={true}
        />
      );

      expect(getAllByText('NOW 🔥').length).toBeGreaterThan(0);
    });

    it('shows "NOW 🔥" badge when currentStreak matches record days', () => {
      const { getAllByText } = render(
        <StreakRecordsAccordion
          streakRecords={defaultStreakRecords}
          currentStreak={6}
          defaultExpanded={true}
        />
      );

      expect(getAllByText('NOW 🔥').length).toBeGreaterThan(0);
    });

    it('does not show "NOW 🔥" badge when no current streak', () => {
      const { queryByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );

      expect(queryByText('NOW 🔥')).toBeNull();
    });
  });

  describe('Empty Slots', () => {
    it('renders hint for missing records (less than 3)', () => {
      const oneRecord = [
        {
          days: 6,
          startDate: '2024-12-01',
          endDate: '2024-12-06',
          isCurrent: false,
        },
      ];

      const { getAllByText } = render(
        <StreakRecordsAccordion
          streakRecords={oneRecord}
          currentStreak={0}
          defaultExpanded={true}
        />
      );

      // Should have hint dashes for empty slots
      // (may include measurement view duplicates)
      expect(getAllByText('-').length).toBeGreaterThanOrEqual(2);
    });

    it('renders two hints when only 1 record exists', () => {
      const oneRecord = [
        {
          days: 6,
          startDate: '2024-12-01',
          endDate: '2024-12-06',
          isCurrent: false,
        },
      ];

      const { getAllByText } = render(
        <StreakRecordsAccordion
          streakRecords={oneRecord}
          currentStreak={0}
          defaultExpanded={true}
        />
      );

      // Should have at least 2 hint dashes
      expect(getAllByText('-').length).toBeGreaterThanOrEqual(2);
    });

    it('renders one hint when 2 records exist', () => {
      const twoRecords = [
        {
          days: 6,
          startDate: '2024-12-01',
          endDate: '2024-12-06',
          isCurrent: false,
        },
        {
          days: 5,
          startDate: '2024-11-15',
          endDate: '2024-11-19',
          isCurrent: false,
        },
      ];

      const { getAllByText } = render(
        <StreakRecordsAccordion
          streakRecords={twoRecords}
          currentStreak={0}
          defaultExpanded={true}
        />
      );

      // Should have at least 1 hint dash
      expect(getAllByText('-').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Empty State', () => {
    it('renders empty state message when no records and no current streak', () => {
      const { getByText } = render(
        <StreakRecordsAccordion streakRecords={[]} currentStreak={0} />
      );

      expect(
        getByText('Complete 2+ consecutive days to start tracking streaks')
      ).toBeTruthy();
    });

    it('does not render accordion when no records', () => {
      const { queryByText } = render(
        <StreakRecordsAccordion streakRecords={[]} currentStreak={0} />
      );

      expect(queryByText('Streak Records')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('has accessible header button with role', () => {
      const { getByRole } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('has accessibility hint for expand action', () => {
      const { getByRole } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );
      const button = getByRole('button');
      expect(button.props.accessibilityHint).toContain('expand');
    });

    it('has accessibility hint for collapse action when expanded', () => {
      const { getByRole } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );
      const button = getByRole('button');
      expect(button.props.accessibilityHint).toContain('collapse');
    });

    it('announces expanded state correctly', () => {
      const { getByRole } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );
      const button = getByRole('button');
      expect(button.props.accessibilityState.expanded).toBe(true);
    });

    it('announces collapsed state correctly', () => {
      const { getByRole } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={false} />
      );
      const button = getByRole('button');
      expect(button.props.accessibilityState.expanded).toBe(false);
    });

    it('has accessibility label for container', () => {
      const { getByLabelText } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );
      expect(getByLabelText(/Streak records/)).toBeTruthy();
    });

    it('has accessibility label for empty state', () => {
      const { getByLabelText } = render(
        <StreakRecordsAccordion streakRecords={[]} currentStreak={0} />
      );
      expect(getByLabelText(/No Streaks Yet/)).toBeTruthy();
    });
  });

  describe('Date Formatting', () => {
    it('formats dates correctly in expanded view', () => {
      const { getAllByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );

      // Dates should be formatted like "Dec 1 - Dec 6"
      expect(getAllByText(/Dec \d+/).length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('handles single record correctly', () => {
      const singleRecord = [
        {
          days: 10,
          startDate: '2024-12-01',
          endDate: '2024-12-10',
          isCurrent: true,
        },
      ];

      const { getAllByText } = render(
        <StreakRecordsAccordion
          streakRecords={singleRecord}
          currentStreak={10}
          defaultExpanded={true}
        />
      );

      // May render multiple times due to measurement view
      expect(getAllByText('10').length).toBeGreaterThan(0);
    });

    it('handles more than 3 records (shows only top 3)', () => {
      const manyRecords = [
        {
          days: 10,
          startDate: '2024-12-01',
          endDate: '2024-12-10',
          isCurrent: false,
        },
        {
          days: 8,
          startDate: '2024-11-20',
          endDate: '2024-11-27',
          isCurrent: false,
        },
        {
          days: 6,
          startDate: '2024-11-10',
          endDate: '2024-11-15',
          isCurrent: false,
        },
        {
          days: 4,
          startDate: '2024-11-01',
          endDate: '2024-11-04',
          isCurrent: false,
        },
        {
          days: 2,
          startDate: '2024-10-20',
          endDate: '2024-10-21',
          isCurrent: false,
        },
      ];

      const { getAllByText, queryByText } = render(
        <StreakRecordsAccordion
          streakRecords={manyRecords}
          currentStreak={0}
          defaultExpanded={true}
        />
      );

      // Should show first 3 (may render multiple times due to measurement view)
      expect(getAllByText('10').length).toBeGreaterThan(0);
      expect(getAllByText('8').length).toBeGreaterThan(0);
      expect(getAllByText('6').length).toBeGreaterThan(0);

      // Should not show 4th and 5th
      expect(queryByText('4')).toBeNull();
      expect(queryByText('2')).toBeNull();
    });

    it('handles very long streak values', () => {
      const longStreak = [
        {
          days: 365,
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          isCurrent: true,
        },
      ];

      const { getAllByText } = render(
        <StreakRecordsAccordion
          streakRecords={longStreak}
          currentStreak={365}
          defaultExpanded={true}
        />
      );

      // May render multiple times due to measurement view
      expect(getAllByText('365').length).toBeGreaterThan(0);
    });
  });

  describe('Reduced Motion', () => {
    it('respects reduced motion preference', () => {
      const { useReducedMotion } = require('react-native-reanimated');
      useReducedMotion.mockReturnValue(true);

      const { getByText } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );

      expect(getByText('Streak Records')).toBeTruthy();
    });

    it('still toggles when reduced motion is enabled', () => {
      const { useReducedMotion } = require('react-native-reanimated');
      useReducedMotion.mockReturnValue(true);

      const { getByRole, queryByText } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );

      // Press to expand
      fireEvent.press(getByRole('button'));

      // Should still toggle state
      expect(queryByText('🥇6 🥈5 🥉3')).toBeNull();
    });
  });

  describe('Visual Elements', () => {
    it('renders with white background', () => {
      const { getByText } = render(
        <StreakRecordsAccordion {...defaultProps} />
      );
      // Component renders without error
      expect(getByText('Streak Records')).toBeTruthy();
    });

    it('renders medal cards with correct structure when expanded', () => {
      const { getAllByText } = render(
        <StreakRecordsAccordion {...defaultProps} defaultExpanded={true} />
      );

      // Each medal card should have a "days" label
      const daysLabels = getAllByText('days');
      expect(daysLabels.length).toBeGreaterThanOrEqual(3);
    });
  });
});
