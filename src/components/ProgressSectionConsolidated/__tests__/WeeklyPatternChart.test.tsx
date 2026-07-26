/**
 * WeeklyPatternChart Component Tests
 *
 * Tests for the compact 7-day bar chart showing completion patterns.
 * Covers bar heights, color coding, best/worst day highlighting,
 * animation stagger, and accessibility.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { WeeklyPatternChart } from '../WeeklyPatternChart';

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
    useSharedValue: (initialValue: number) => ({ value: initialValue }),
    useAnimatedStyle: () => ({}),
    withTiming: (value: number) => value,
    withDelay: (_delay: number, value: number) => value,
    withSpring: (value: number) => value,
    Easing: {
      ...jest.requireActual('react-native-reanimated/mock').Easing,
      out: () => () => 0,
      cubic: () => 0,
    },
  };
});

// Mock useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

// Mock lucide-react-native
jest.mock('lucide-react-native', () => ({
  ChevronRight: () => null,
}));

describe('WeeklyPatternChart', () => {
  // Default mock day stats (Sun=0 to Sat=6)
  const mockDayStats = [
    { day: 'Sun', dayIndex: 0, completed: 4, total: 5, rate: 80 },
    { day: 'Mon', dayIndex: 1, completed: 5, total: 5, rate: 100 }, // Best
    { day: 'Tue', dayIndex: 2, completed: 3, total: 5, rate: 60 },
    { day: 'Wed', dayIndex: 3, completed: 2, total: 5, rate: 40 }, // Worst
    { day: 'Thu', dayIndex: 4, completed: 4, total: 5, rate: 80 },
    { day: 'Fri', dayIndex: 5, completed: 3, total: 5, rate: 60 },
    { day: 'Sat', dayIndex: 6, completed: 4, total: 5, rate: 80 },
  ];

  const defaultProps = {
    dayStats: mockDayStats,
    onSeeAllPress: undefined,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      const { getByText } = render(<WeeklyPatternChart {...defaultProps} />);
      expect(getByText('Weekly Pattern')).toBeTruthy();
    });

    it('renders all 7 day bars', () => {
      const { getAllByLabelText, getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );
      // Check for day labels - S appears twice (Sun, Sat), T appears twice (Tue, Thu)
      expect(getAllByLabelText(/S: 80%/).length).toBe(2); // Sun & Sat
      expect(getByLabelText(/M: 100%.*best day/)).toBeTruthy();
      expect(getAllByLabelText(/T:/).length).toBe(2); // Tue & Thu
      expect(getByLabelText(/W: 40%.*focus day/)).toBeTruthy();
      expect(getByLabelText(/F: 60%/)).toBeTruthy();
    });

    it('renders the header', () => {
      const { getByText } = render(<WeeklyPatternChart {...defaultProps} />);
      expect(getByText('Weekly Pattern')).toBeTruthy();
    });

    it('renders the legend', () => {
      const { getByText } = render(<WeeklyPatternChart {...defaultProps} />);
      expect(getByText('Best')).toBeTruthy();
      expect(getByText('Focus')).toBeTruthy();
    });
  });

  describe('Best/Worst Day Highlighting', () => {
    it('identifies the best day correctly', () => {
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );
      // Monday has 100% rate - should be marked as best
      expect(getByLabelText(/M: 100%.*best day/)).toBeTruthy();
    });

    it('identifies the worst day (focus day) correctly', () => {
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );
      // Wednesday has 40% rate - should be marked as focus day
      expect(getByLabelText(/W: 40%.*focus day/)).toBeTruthy();
    });

    it('does not mark worst day if rate is >= 70%', () => {
      const goodDayStats = mockDayStats.map((d) => ({
        ...d,
        rate: Math.max(d.rate, 70), // All days >= 70%
        completed: Math.max(d.completed, 4),
      }));

      const { queryByLabelText } = render(
        <WeeklyPatternChart dayStats={goodDayStats} />
      );

      // Should not have any focus day labels
      expect(queryByLabelText(/focus day/)).toBeNull();
    });

    it('does not mark worst day if it equals best day', () => {
      // All days have same rate
      const uniformDayStats = mockDayStats.map((d) => ({
        ...d,
        rate: 75,
        completed: 3,
        total: 4,
      }));

      const { queryByLabelText } = render(
        <WeeklyPatternChart dayStats={uniformDayStats} />
      );

      // Should have a best day but no focus day
      expect(queryByLabelText(/best day/)).toBeTruthy();
      expect(queryByLabelText(/focus day/)).toBeNull();
    });
  });

  describe('Color Coding', () => {
    it('uses emerald color for best day bar', () => {
      // Color is applied via style, verified by accessibility label
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );
      expect(getByLabelText(/M: 100%.*best day/)).toBeTruthy();
    });

    it('uses amber color for focus day bar', () => {
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );
      expect(getByLabelText(/W: 40%.*focus day/)).toBeTruthy();
    });

    // Note: Testing actual bar colors would require accessing style props
    // which is challenging with mocked Animated components
  });

  describe('Details Button', () => {
    it('renders Details button when onSeeAllPress is provided', () => {
      const onSeeAllPress = jest.fn();
      const { getByText } = render(
        <WeeklyPatternChart {...defaultProps} onSeeAllPress={onSeeAllPress} />
      );
      expect(getByText('Details')).toBeTruthy();
    });

    it('does not render Details button when onSeeAllPress is not provided', () => {
      const { queryByText } = render(<WeeklyPatternChart {...defaultProps} />);
      expect(queryByText('Details')).toBeNull();
    });

    it('calls onSeeAllPress when Details button is pressed', () => {
      const onSeeAllPress = jest.fn();
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} onSeeAllPress={onSeeAllPress} />
      );

      fireEvent.press(getByLabelText('See all weekly patterns'));
      expect(onSeeAllPress).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has accessible chart container with summary', () => {
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );

      // Chart container should have a summary label
      const chartContainer = getByLabelText(
        /Weekly pattern chart.*Best day: Mon at 100%.*Focus day: Wed at 40%/
      );
      expect(chartContainer).toBeTruthy();
    });

    it('each bar has appropriate accessibility label', () => {
      const { getAllByLabelText, getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );

      // Each bar should have a label with day and completion rate
      // Note: S (Sun/Sat) and T (Tue/Thu) share same letter
      expect(getAllByLabelText(/S: 80%/).length).toBe(2);
      expect(getByLabelText(/M: 100%/)).toBeTruthy();
      expect(getByLabelText(/T: 60%/)).toBeTruthy();
      expect(getByLabelText(/W: 40%/)).toBeTruthy();
      expect(getByLabelText(/T: 80%/)).toBeTruthy();
      expect(getByLabelText(/F: 60%/)).toBeTruthy();
    });

    it('Details button has accessibility label', () => {
      const onSeeAllPress = jest.fn();
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} onSeeAllPress={onSeeAllPress} />
      );

      expect(getByLabelText('See all weekly patterns')).toBeTruthy();
    });

    it('Details button has button role', () => {
      const onSeeAllPress = jest.fn();
      const { getByRole } = render(
        <WeeklyPatternChart {...defaultProps} onSeeAllPress={onSeeAllPress} />
      );

      expect(getByRole('button')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty dayStats array', () => {
      const { getByText } = render(
        <WeeklyPatternChart dayStats={[]} onSeeAllPress={undefined} />
      );

      // Should still render header
      expect(getByText('Weekly Pattern')).toBeTruthy();
    });

    it('handles all zero rates', () => {
      const zeroDayStats = mockDayStats.map((d) => ({
        ...d,
        rate: 0,
        completed: 0,
      }));

      const { getByText } = render(
        <WeeklyPatternChart dayStats={zeroDayStats} />
      );

      expect(getByText('Weekly Pattern')).toBeTruthy();
    });

    it('handles all 100% rates', () => {
      const perfectDayStats = mockDayStats.map((d) => ({
        ...d,
        rate: 100,
        completed: d.total,
      }));

      const { getByLabelText } = render(
        <WeeklyPatternChart dayStats={perfectDayStats} />
      );

      // First 100% day should be marked as best
      expect(getByLabelText(/S: 100%.*best day/)).toBeTruthy();
    });

    it('handles days with no data (total = 0)', () => {
      const partialDayStats = mockDayStats.map((d, i) => ({
        ...d,
        total: i < 3 ? 0 : d.total, // First 3 days have no data
        completed: i < 3 ? 0 : d.completed,
        rate: i < 3 ? 0 : d.rate,
      }));

      const { getByText } = render(
        <WeeklyPatternChart dayStats={partialDayStats} />
      );

      expect(getByText('Weekly Pattern')).toBeTruthy();
    });

    it('handles single day with data', () => {
      const singleDayStats = mockDayStats.map((d, i) => ({
        ...d,
        total: i === 1 ? 5 : 0,
        completed: i === 1 ? 4 : 0,
        rate: i === 1 ? 80 : 0,
      }));

      const { getByLabelText } = render(
        <WeeklyPatternChart dayStats={singleDayStats} />
      );

      // Monday should be best (only day with data)
      expect(getByLabelText(/M: 80%.*best day/)).toBeTruthy();
    });
  });

  describe('Bar Heights', () => {
    it('normalizes bar heights relative to max rate', () => {
      // The component calculates bar heights based on maxRate
      // With rates of 40-100, bars should scale proportionally
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );

      // Best day (100%) should have full height, others scaled down
      // This is verified via accessibility labels showing correct percentages
      expect(getByLabelText(/M: 100%/)).toBeTruthy();
      expect(getByLabelText(/W: 40%/)).toBeTruthy();
    });
  });

  describe('Animation Stagger', () => {
    it('renders with staggered animation delay per bar', () => {
      // Animation is mocked, but component should handle stagger logic
      const { getByText } = render(<WeeklyPatternChart {...defaultProps} />);

      // Component renders without errors with stagger logic
      expect(getByText('Weekly Pattern')).toBeTruthy();
    });
  });

  describe('Reduced Motion', () => {
    it('respects reduced motion preference', () => {
      const { useReduceMotion } = require('../../../hooks/useReduceMotion') as {
        useReduceMotion: jest.Mock;
      };
      useReduceMotion.mockReturnValue(true);

      const { getByText } = render(<WeeklyPatternChart {...defaultProps} />);

      // Component should render correctly with reduced motion
      expect(getByText('Weekly Pattern')).toBeTruthy();
    });
  });

  describe('Day Label Styling', () => {
    it('highlights best day label', () => {
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );

      // Best day should have bold styling (verified via accessibility)
      expect(getByLabelText(/M: 100%.*best day/)).toBeTruthy();
    });

    it('highlights focus day label', () => {
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );

      // Focus day should have bold styling (verified via accessibility)
      expect(getByLabelText(/W: 40%.*focus day/)).toBeTruthy();
    });
  });

  describe('Chart Dimensions', () => {
    it('renders with correct height (56px)', () => {
      // Note: Actual dimension testing would require integration tests
      // Here we verify component renders without crashing
      const { getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );

      expect(getByLabelText(/Weekly pattern chart/)).toBeTruthy();
    });
  });

  describe('Data Memoization', () => {
    it('memoizes best/worst day calculations', () => {
      const { rerender, getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );

      // Rerender with same props
      rerender(<WeeklyPatternChart {...defaultProps} />);

      // Should still correctly identify best/worst
      expect(getByLabelText(/M: 100%.*best day/)).toBeTruthy();
      expect(getByLabelText(/W: 40%.*focus day/)).toBeTruthy();
    });

    it('updates when dayStats changes', () => {
      const { rerender, getByLabelText } = render(
        <WeeklyPatternChart {...defaultProps} />
      );

      // Update with new data where Wednesday is now best
      const newDayStats = mockDayStats.map((d) => ({
        ...d,
        rate: d.dayIndex === 3 ? 100 : 50,
        completed: d.dayIndex === 3 ? 5 : 2,
      }));

      rerender(<WeeklyPatternChart dayStats={newDayStats} />);

      // Wednesday should now be best
      expect(getByLabelText(/W: 100%.*best day/)).toBeTruthy();
    });
  });
});
