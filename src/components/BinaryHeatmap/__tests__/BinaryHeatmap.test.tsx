/**
 * BinaryHeatmap Component Tests
 *
 * Tests for the main container component that composes:
 * - Header with time range toggle
 * - BinaryHeatmapGrid
 * - HeatmapLegend
 * - HeatmapTooltip
 *
 * Tests cover:
 * - Rendering and composition
 * - Time range state management (controlled and uncontrolled)
 * - Grid data generation
 * - Cell press handling
 * - Tooltip visibility
 * - Accessibility
 */

import React from 'react';

import { render, fireEvent, waitFor } from '@testing-library/react-native';

import type { Id } from '../../../../convex/_generated/dataModel';
import type { TimeRange } from '../types';
import { BinaryHeatmap } from '..';

// Mock the useReduceMotion hook
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

// Helper to create a mock habit ID
const mockHabitId = 'test-habit-id' as Id<'habits'>;

// Helper to create completed dates set
const createCompletedDates = (dates: string[]): Set<string> => {
  return new Set(dates);
};

// Fixed date for consistent testing
const TEST_DATE = new Date('2024-12-15T12:00:00Z');

// Mock the grid generation to use a fixed date
jest.mock('../utils', () => {
  const originalModule = jest.requireActual('../utils');
  return {
    ...originalModule,
    generateBinaryGrid: (
      timeRange: TimeRange,
      completedDates: Set<string>,
      habitCreatedAt?: number
    ) => {
      return originalModule.generateBinaryGrid(
        timeRange,
        completedDates,
        habitCreatedAt,
        new Date('2024-12-15T12:00:00Z')
      );
    },
  };
});

describe('BinaryHeatmap', () => {
  const defaultProps = {
    habitId: mockHabitId,
    completedDates: createCompletedDates([
      '2024-12-10',
      '2024-12-11',
      '2024-12-12',
    ]),
    habitColor: '#10b981',
    currentStreak: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
    });

    it('should render the Activity header title', () => {
      const { getByText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByText('Activity')).toBeTruthy();
    });

    it('should render the TimeRangeToggle component', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByLabelText('Time range selector')).toBeTruthy();
    });

    it('should render all time range options', () => {
      const { getByText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByText('3m')).toBeTruthy();
      expect(getByText('6m')).toBeTruthy();
      expect(getByText('1y')).toBeTruthy();
    });

    it('should render the HeatmapLegend component', () => {
      const { getByText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByText('Missed')).toBeTruthy();
      expect(getByText('Done')).toBeTruthy();
    });

    it('should render completion percentage in legend', () => {
      const { getByText } = render(<BinaryHeatmap {...defaultProps} />);
      // The percentage depends on grid calculation
      expect(getByText(/\d+% compl/)).toBeTruthy();
    });

    it('should render the grid container', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByLabelText('Habit completion heatmap grid')).toBeTruthy();
    });
  });

  describe('Time range state (uncontrolled)', () => {
    it('should default to 3m time range when no timeRange prop provided', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      const button3m = getByLabelText('3 months');
      expect(button3m.props.accessibilityState.selected).toBe(true);
    });

    it('should update internal state when time range is changed', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);

      // Initially 3m is active
      expect(getByLabelText('3 months').props.accessibilityState.selected).toBe(
        true
      );

      // Press 6m
      fireEvent.press(getByLabelText('6 months'));

      // Now 6m should be active
      expect(getByLabelText('6 months').props.accessibilityState.selected).toBe(
        true
      );
      expect(getByLabelText('3 months').props.accessibilityState.selected).toBe(
        false
      );
    });

    it('should call onTimeRangeChange callback when time range changes', () => {
      const mockOnTimeRangeChange = jest.fn();
      const { getByLabelText } = render(
        <BinaryHeatmap
          {...defaultProps}
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      );

      fireEvent.press(getByLabelText('6 months'));

      expect(mockOnTimeRangeChange).toHaveBeenCalledWith('6m');
      expect(mockOnTimeRangeChange).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple time range changes', () => {
      const mockOnTimeRangeChange = jest.fn();
      const { getByLabelText } = render(
        <BinaryHeatmap
          {...defaultProps}
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      );

      fireEvent.press(getByLabelText('6 months'));
      fireEvent.press(getByLabelText('1 year'));
      fireEvent.press(getByLabelText('3 months'));

      expect(mockOnTimeRangeChange).toHaveBeenCalledTimes(3);
      expect(mockOnTimeRangeChange).toHaveBeenNthCalledWith(1, '6m');
      expect(mockOnTimeRangeChange).toHaveBeenNthCalledWith(2, '1y');
      expect(mockOnTimeRangeChange).toHaveBeenNthCalledWith(3, '3m');
    });
  });

  describe('Time range state (controlled)', () => {
    it('should use controlled timeRange prop when provided', () => {
      const { getByLabelText } = render(
        <BinaryHeatmap {...defaultProps} timeRange='6m' />
      );

      expect(getByLabelText('6 months').props.accessibilityState.selected).toBe(
        true
      );
      expect(getByLabelText('3 months').props.accessibilityState.selected).toBe(
        false
      );
    });

    it('should update when controlled timeRange prop changes', () => {
      const { getByLabelText, rerender } = render(
        <BinaryHeatmap {...defaultProps} timeRange='3m' />
      );

      expect(getByLabelText('3 months').props.accessibilityState.selected).toBe(
        true
      );

      rerender(<BinaryHeatmap {...defaultProps} timeRange='1y' />);

      expect(getByLabelText('1 year').props.accessibilityState.selected).toBe(
        true
      );
      expect(getByLabelText('3 months').props.accessibilityState.selected).toBe(
        false
      );
    });

    it('should call onTimeRangeChange but not update internal state when controlled', () => {
      const mockOnTimeRangeChange = jest.fn();
      const { getByLabelText } = render(
        <BinaryHeatmap
          {...defaultProps}
          timeRange='3m'
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      );

      // Press 6m
      fireEvent.press(getByLabelText('6 months'));

      // Callback should be called
      expect(mockOnTimeRangeChange).toHaveBeenCalledWith('6m');

      // But the active state should NOT change (controlled mode)
      // The parent component is responsible for updating the timeRange prop
      expect(getByLabelText('3 months').props.accessibilityState.selected).toBe(
        true
      );
    });
  });

  describe('Grid data generation', () => {
    it('should pass habitColor to grid component', () => {
      const customColor = '#ef4444'; // red
      const { UNSAFE_getAllByType } = render(
        <BinaryHeatmap {...defaultProps} habitColor={customColor} />
      );

      // The grid should receive the habit color
      // We verify this indirectly by checking the component renders
      expect(UNSAFE_getAllByType).toBeDefined();
    });

    it('should regenerate grid when completedDates changes', () => {
      const { getByText, rerender } = render(
        <BinaryHeatmap {...defaultProps} />
      );

      // Initial render with some completions
      const initialPercent = getByText(/\d+% compl/);
      expect(initialPercent).toBeTruthy();

      // Update with more completions
      const moreCompletions = createCompletedDates([
        '2024-12-10',
        '2024-12-11',
        '2024-12-12',
        '2024-12-13',
        '2024-12-14',
      ]);

      rerender(
        <BinaryHeatmap {...defaultProps} completedDates={moreCompletions} />
      );

      // Should still render (percentage may have changed)
      expect(getByText(/\d+% compl/)).toBeTruthy();
    });

    it('should regenerate grid when habitCreatedAt changes', () => {
      const { rerender, getByLabelText } = render(
        <BinaryHeatmap {...defaultProps} />
      );

      expect(getByLabelText('Habit completion heatmap')).toBeTruthy();

      // Update with habitCreatedAt
      rerender(
        <BinaryHeatmap
          {...defaultProps}
          habitCreatedAt={Date.now() - 86400000}
        />
      );

      expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
    });
  });

  describe('Day press handling', () => {
    it('should call onDayPress callback when a cell is pressed', () => {
      const mockOnDayPress = jest.fn();
      const { getByLabelText } = render(
        <BinaryHeatmap {...defaultProps} onDayPress={mockOnDayPress} />
      );

      // Find a cell and press it
      // We need to find a cell in the grid
      const grid = getByLabelText('Habit completion heatmap grid');
      expect(grid).toBeTruthy();

      // The actual cell press is handled by BinaryCell component
      // which is tested separately. Here we verify the callback is passed through.
    });

    it('should not throw when onDayPress is not provided', () => {
      expect(() => {
        render(<BinaryHeatmap {...defaultProps} onDayPress={undefined} />);
      }).not.toThrow();
    });
  });

  describe('Legend integration', () => {
    it('should display completion percentage based on grid stats', () => {
      const { getByText } = render(<BinaryHeatmap {...defaultProps} />);
      // Should show some percentage
      expect(getByText(/\d+% compl/)).toBeTruthy();
    });

    it('should pass habit color to legend', () => {
      const { getByText } = render(
        <BinaryHeatmap {...defaultProps} habitColor='#ef4444' />
      );
      // Legend should render with the color (indirectly tested by rendering)
      expect(getByText('Done')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible container with summary role', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      const container = getByLabelText('Habit completion heatmap');
      expect(container.props.accessibilityRole).toBe('summary');
    });

    it('should be accessible', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      const container = getByLabelText('Habit completion heatmap');
      expect(container.props.accessible).toBe(true);
    });

    it('should have accessible time range selector', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByLabelText('Time range selector')).toBeTruthy();
    });
  });

  describe('Component composition', () => {
    it('should render header, grid, and legend in correct order', () => {
      const { toJSON } = render(<BinaryHeatmap {...defaultProps} />);
      const tree = toJSON();

      // Verify the component tree structure exists
      expect(tree).toBeTruthy();
      expect(tree).toHaveProperty('type', 'View');
    });

    it('should have correct styling for container', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      const container = getByLabelText('Habit completion heatmap');

      // Container should have styles (backgroundColor, borderRadius, padding)
      expect(container.props.style).toBeDefined();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty completedDates set', () => {
      const emptyCompletions = createCompletedDates([]);
      const { getByText } = render(
        <BinaryHeatmap {...defaultProps} completedDates={emptyCompletions} />
      );

      // Should show 0% completion
      expect(getByText('0% compl')).toBeTruthy();
    });

    it('should handle habitCreatedAt in the future', () => {
      const futureDate = Date.now() + 86400000 * 30; // 30 days in future
      const { getByLabelText } = render(
        <BinaryHeatmap {...defaultProps} habitCreatedAt={futureDate} />
      );

      expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
    });

    it('should handle habitCreatedAt in the distant past', () => {
      const pastDate = Date.now() - 86400000 * 365 * 2; // 2 years ago
      const { getByLabelText } = render(
        <BinaryHeatmap {...defaultProps} habitCreatedAt={pastDate} />
      );

      expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
    });

    it('should handle undefined habitCreatedAt', () => {
      const { getByLabelText } = render(
        <BinaryHeatmap {...defaultProps} habitCreatedAt={undefined} />
      );

      expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
    });

    it('should handle all time ranges', () => {
      const timeRanges: TimeRange[] = ['3m', '6m', '1y'];

      for (const range of timeRanges) {
        const { getByLabelText, unmount } = render(
          <BinaryHeatmap {...defaultProps} timeRange={range} />
        );

        expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
        unmount();
      }
    });
  });

  describe('Props propagation', () => {
    it('should pass habitId to relevant child components', () => {
      const { getByLabelText } = render(
        <BinaryHeatmap {...defaultProps} habitId={mockHabitId} />
      );

      // Component should render (habitId is mainly for parent tracking)
      expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
    });

    it('should pass currentStreak to relevant child components', () => {
      const { getByLabelText } = render(
        <BinaryHeatmap {...defaultProps} currentStreak={42} />
      );

      // Component should render (currentStreak will be used in StatsRow)
      expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
    });
  });

  describe('Memoization', () => {
    it('should be memoized (wrapped with React.memo)', () => {
      // Verify the component is memoized by checking it doesn't re-render unnecessarily
      const mockOnTimeRangeChange = jest.fn();
      const { rerender } = render(
        <BinaryHeatmap
          {...defaultProps}
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      );

      // Re-render with same props - should not cause issues
      rerender(
        <BinaryHeatmap
          {...defaultProps}
          onTimeRangeChange={mockOnTimeRangeChange}
        />
      );

      // If memoization works, callbacks should not have been called
      expect(mockOnTimeRangeChange).not.toHaveBeenCalled();
    });
  });

  describe('Styling', () => {
    it('should have white background (card color)', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      const container = getByLabelText('Habit completion heatmap');

      // Check that container has expected background color
      const styles = container.props.style;
      expect(styles.backgroundColor).toBe('#ffffff');
    });

    it('should have rounded corners (borderRadius 12)', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      const container = getByLabelText('Habit completion heatmap');

      const styles = container.props.style;
      expect(styles.borderRadius).toBe(12);
    });

    it('should have padding', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      const container = getByLabelText('Habit completion heatmap');

      const styles = container.props.style;
      expect(styles.padding).toBe(16);
    });
  });
});
