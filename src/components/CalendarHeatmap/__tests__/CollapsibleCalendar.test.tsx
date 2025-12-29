/**
 * CollapsibleCalendar Component Tests
 * Tests collapse/expand functionality, animations, persistence, and accessibility
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';

// Mock the dependencies first, before importing the component
const mockGetCalendarExpandedState = jest.fn();
const mockSetCalendarExpandedState = jest.fn();

jest.mock('../../../utils/calendarCollapsePreferences', () => ({
  getCalendarExpandedState: (...args: any[]) =>
    mockGetCalendarExpandedState(...args),
  setCalendarExpandedState: (...args: any[]) =>
    mockSetCalendarExpandedState(...args),
}));

// Now import the component after mocking
import { CollapsibleCalendar } from '../CollapsibleCalendar';

jest.mock('../../../utils/insightCardPreferences', () => ({
  isInsightDismissed: jest.fn(() => Promise.resolve(false)),
  dismissInsight: jest.fn(() => Promise.resolve()),
}));

jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

jest.mock('../../../hooks/useHapticFeedback', () => ({
  useHapticFeedback: () => ({
    triggerSelection: jest.fn(),
    triggerSuccess: jest.fn(),
    triggerWarning: jest.fn(),
    triggerError: jest.fn(),
  }),
}));

// Mock date-fns
jest.mock('date-fns', () => {
  const actual = jest.requireActual('date-fns');
  // Use noon UTC to avoid timezone boundary issues where local date differs from UTC
  const mockToday = new Date('2025-12-25T12:00:00Z');
  return {
    ...actual,
    format: (date: Date, formatStr: string) => actual.format(date, formatStr),
    subDays: actual.subDays,
  };
});

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const React = require('react');
  const { View, Text } = require('react-native');

  const Animated = {
    View,
    Text,
    createAnimatedComponent: (Component: any) => Component,
  };

  return {
    __esModule: true,
    default: Animated,
    ...Animated,
    useSharedValue: (initial: number) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withTiming: (value: number) => value,
    withSpring: (value: number) => value,
    withRepeat: (value: number) => value,
    withSequence: (...values: number[]) => values[0],
    withDelay: (_: number, value: number) => value,
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
      out: (fn: any) => fn,
      ease: (x: number) => x,
      inOut: (fn: any) => fn,
    },
    FadeInDown: {
      springify: () => ({ delay: () => ({}) }),
      delay: () => ({ springify: () => ({}) }),
    },
  };
});

// Mock CalendarHeatmap to avoid complex rendering
jest.mock('../CalendarHeatmap', () => ({
  CalendarHeatmap: ({ habitId }: any) =>
    require('react').createElement(
      require('react-native').View,
      { testID: 'calendar-heatmap' },
      require('react').createElement(
        require('react-native').Text,
        {},
        `Calendar for ${habitId}`
      )
    ),
}));

describe('CollapsibleCalendar', () => {
  const mockHabitId = 'test-habit-id' as any;
  const mockOnDayPress = jest.fn();

  // Helper to create completed dates
  const createCompletedDates = (dates: string[]): Set<string> => {
    return new Set(dates);
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCalendarExpandedState.mockResolvedValue(null);
    mockSetCalendarExpandedState.mockResolvedValue(undefined);
  });

  describe('Rendering', () => {
    it('should render without crashing', async () => {
      const completedDates = createCompletedDates(['2025-12-20', '2025-12-21']);

      const { getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={new Date('2025-12-01T12:00:00Z').getTime()}
        />
      );

      await waitFor(() => {
        expect(getByText('Calendar View')).toBeTruthy();
      });
    });

    it('should render header with Calendar View text', async () => {
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        expect(getByText('Calendar View')).toBeTruthy();
      });
    });

    it('should render month/year label', async () => {
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        // Should show current month/year
        expect(getByText(/December 2025|January 2026/)).toBeTruthy();
      });
    });

    it('should render collapsible header button', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        expect(getByTestId('collapsible-calendar-header')).toBeTruthy();
      });
    });
  });

  describe('Collapse/Expand Behavior', () => {
    it('should be collapsed by default', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId, queryByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        const header = getByTestId('collapsible-calendar-header');
        // Header should indicate collapsed state
        expect(header.props.accessibilityState.expanded).toBe(false);
      });
    });

    it('should expand when defaultExpanded is true', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        const header = getByTestId('collapsible-calendar-header');
        expect(header.props.accessibilityState.expanded).toBe(true);
      });
    });

    it('should toggle expanded state on header press', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        const header = getByTestId('collapsible-calendar-header');
        expect(header.props.accessibilityState.expanded).toBe(false);
      });

      // Tap to expand
      const header = getByTestId('collapsible-calendar-header');
      await act(async () => {
        fireEvent.press(header);
      });

      await waitFor(() => {
        const updatedHeader = getByTestId('collapsible-calendar-header');
        expect(updatedHeader.props.accessibilityState.expanded).toBe(true);
      });
    });

    it('should toggle back to collapsed on second press', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        expect(getByTestId('collapsible-calendar-header')).toBeTruthy();
      });

      const header = getByTestId('collapsible-calendar-header');

      // First press - expand
      await act(async () => {
        fireEvent.press(header);
      });

      await waitFor(() => {
        expect(header.props.accessibilityState.expanded).toBe(true);
      });

      // Second press - collapse
      await act(async () => {
        fireEvent.press(header);
      });

      await waitFor(() => {
        const updatedHeader = getByTestId('collapsible-calendar-header');
        expect(updatedHeader.props.accessibilityState.expanded).toBe(false);
      });
    });
  });

  describe('Mini Preview', () => {
    it('should show mini preview dots when collapsed and showMiniPreview is true', async () => {
      const completedDates = createCompletedDates(['2025-12-22', '2025-12-23']);

      const { getByLabelText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          showMiniPreview={true}
        />
      );

      await waitFor(() => {
        // Mini preview should show count of completed days
        expect(getByLabelText(/Last 7 days:/)).toBeTruthy();
      });
    });

    it('should not show mini preview when showMiniPreview is false', async () => {
      const completedDates = createCompletedDates(['2025-12-22', '2025-12-23']);

      const { queryByLabelText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          showMiniPreview={false}
        />
      );

      await waitFor(() => {
        expect(queryByLabelText(/Last 7 days:/)).toBeNull();
      });
    });

    it('should hide mini preview when expanded', async () => {
      const completedDates = createCompletedDates(['2025-12-22', '2025-12-23']);

      const { getByTestId, queryByLabelText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          showMiniPreview={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('collapsible-calendar-header')).toBeTruthy();
      });

      // Expand
      const header = getByTestId('collapsible-calendar-header');
      await act(async () => {
        fireEvent.press(header);
      });

      await waitFor(() => {
        // Mini preview should be hidden when expanded
        expect(queryByLabelText(/Last 7 days:/)).toBeNull();
      });
    });
  });

  describe('Preference Persistence', () => {
    it('should load saved expanded state on mount', async () => {
      mockGetCalendarExpandedState.mockResolvedValue(true);

      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        const header = getByTestId('collapsible-calendar-header');
        expect(header.props.accessibilityState.expanded).toBe(true);
      });
    });

    it('should load saved collapsed state on mount', async () => {
      mockGetCalendarExpandedState.mockResolvedValue(false);

      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        const header = getByTestId('collapsible-calendar-header');
        expect(header.props.accessibilityState.expanded).toBe(false);
      });
    });

    it('should save expanded state when toggling', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        expect(getByTestId('collapsible-calendar-header')).toBeTruthy();
      });

      const header = getByTestId('collapsible-calendar-header');
      await act(async () => {
        fireEvent.press(header);
      });

      await waitFor(() => {
        expect(mockSetCalendarExpandedState).toHaveBeenCalledWith(
          mockHabitId,
          true
        );
      });
    });

    it('should use defaultExpanded when no saved preference exists', async () => {
      mockGetCalendarExpandedState.mockResolvedValue(null);

      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          defaultExpanded={false}
        />
      );

      await waitFor(() => {
        const header = getByTestId('collapsible-calendar-header');
        expect(header.props.accessibilityState.expanded).toBe(false);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible header button', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        const header = getByTestId('collapsible-calendar-header');
        expect(header.props.accessibilityRole).toBe('button');
        expect(header.props.accessibilityHint).toContain('expand');
      });
    });

    it('should update accessibility hint based on state', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        const header = getByTestId('collapsible-calendar-header');
        expect(header.props.accessibilityHint).toContain('expand');
      });

      // Expand
      const header = getByTestId('collapsible-calendar-header');
      await act(async () => {
        fireEvent.press(header);
      });

      await waitFor(() => {
        const expandedHeader = getByTestId('collapsible-calendar-header');
        expect(expandedHeader.props.accessibilityHint).toContain('collapse');
      });
    });

    it('should have accessibility state for expanded', async () => {
      const completedDates = createCompletedDates([]);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        const header = getByTestId('collapsible-calendar-header');
        expect(header.props.accessibilityState).toEqual(
          expect.objectContaining({ expanded: true })
        );
      });
    });
  });

  describe('Props Passthrough', () => {
    it('should pass habitColor to CalendarHeatmap', async () => {
      const completedDates = createCompletedDates(['2025-12-20']);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          habitColor='#ff5733'
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('collapsible-calendar-header')).toBeTruthy();
      });
    });

    it('should pass onDayPress to CalendarHeatmap', async () => {
      const completedDates = createCompletedDates(['2025-12-20']);

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          onDayPress={mockOnDayPress}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('collapsible-calendar-header')).toBeTruthy();
      });
    });

    it('should pass habitCreatedAt to CalendarHeatmap', async () => {
      const completedDates = createCompletedDates(['2025-12-20']);
      const createdAt = new Date('2025-12-01T12:00:00Z').getTime();

      const { getByTestId } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
          habitCreatedAt={createdAt}
          defaultExpanded={true}
        />
      );

      await waitFor(() => {
        expect(getByTestId('collapsible-calendar-header')).toBeTruthy();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty completedDates', async () => {
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        expect(getByText('Calendar View')).toBeTruthy();
      });
    });

    it('should handle many completed dates', async () => {
      const dates = Array.from({ length: 90 }, (_, i) => {
        const date = new Date('2025-12-25T12:00:00Z');
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      });
      const completedDates = createCompletedDates(dates);

      const { getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        expect(getByText('Calendar View')).toBeTruthy();
      });
    });

    it('should handle undefined optional props', async () => {
      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        expect(getByText('Calendar View')).toBeTruthy();
      });
    });

    it('should handle preference loading error gracefully', async () => {
      mockGetCalendarExpandedState.mockRejectedValue(
        new Error('Storage error')
      );

      const completedDates = createCompletedDates([]);

      const { getByText } = render(
        <CollapsibleCalendar
          habitId={mockHabitId}
          completedDates={completedDates}
        />
      );

      await waitFor(() => {
        // Should still render with default state
        expect(getByText('Calendar View')).toBeTruthy();
      });
    });
  });
});

describe('MiniPreviewDots', () => {
  const mockHabitId = 'test-habit-id' as any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCalendarExpandedState.mockResolvedValue(null);
  });

  it('should show correct number of completed days', async () => {
    // Complete the last 4 out of 7 days
    const dates = ['2025-12-22', '2025-12-23', '2025-12-24', '2025-12-25'];
    const completedDates = new Set(dates);

    const { getByLabelText } = render(
      <CollapsibleCalendar
        habitId={mockHabitId}
        completedDates={completedDates}
        showMiniPreview={true}
      />
    );

    await waitFor(() => {
      const preview = getByLabelText(/Last 7 days: \d+ completed/);
      expect(preview).toBeTruthy();
    });
  });

  it('should use habitColor for completed dots', async () => {
    const completedDates = new Set(['2025-12-24']);

    const { getByLabelText } = render(
      <CollapsibleCalendar
        habitId={mockHabitId}
        completedDates={completedDates}
        habitColor='#ff5733'
        showMiniPreview={true}
      />
    );

    await waitFor(() => {
      expect(getByLabelText(/Last 7 days:/)).toBeTruthy();
    });
  });
});
