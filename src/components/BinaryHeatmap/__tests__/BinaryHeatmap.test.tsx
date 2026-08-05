/**
 * BinaryHeatmap Component Tests
 *
 * Container that composes: themed card, HeatmapHeader (title + completion stat),
 * InlineHeatmapGrid, HeatmapLegend, and a tap-anchored HeatmapTooltip.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { BinaryHeatmap } from '..';
import type { TimeRange } from '../types';
import type { Id } from '../../../../convex/_generated/dataModel';

jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => false),
}));

// Pin grid generation to a fixed "today" for deterministic stats.
jest.mock('../utils', () => {
  const actual = jest.requireActual('../utils');
  return {
    ...actual,
    generateBinaryGrid: (
      timeRange: TimeRange,
      completedDates: Set<string>,
      habitCreatedAt?: number
    ) =>
      actual.generateBinaryGrid(
        timeRange,
        completedDates,
        habitCreatedAt,
        new Date('2024-12-15T12:00:00Z')
      ),
  };
});

const mockHabitId = 'test-habit-id' as Id<'habits'>;

const defaultProps = {
  habitId: mockHabitId,
  completedDates: new Set(['2024-12-10', '2024-12-11', '2024-12-12']),
  habitColor: '#10b981',
  currentStreak: 3,
};

describe('BinaryHeatmap', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('Rendering', () => {
    it('renders the accessible heatmap container', () => {
      const { getByLabelText } = render(<BinaryHeatmap {...defaultProps} />);
      const container = getByLabelText('Habit completion heatmap');
      expect(container.props.accessibilityRole).toBe('summary');
    });

    it('renders the default "Activity" title', () => {
      const { getByText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByText('Activity')).toBeTruthy();
    });

    it('renders a custom title when provided', () => {
      const { getByText } = render(
        <BinaryHeatmap {...defaultProps} title='Year Overview' />
      );
      expect(getByText('Year Overview')).toBeTruthy();
    });

    it('renders the legend Missed and Done indicators', () => {
      const { getByText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByText('Missed')).toBeTruthy();
      expect(getByText('Done')).toBeTruthy();
    });
  });

  describe('Header completion stat', () => {
    it('shows the percentage and day count by default', () => {
      const { getByText } = render(<BinaryHeatmap {...defaultProps} />);
      expect(getByText(/^\d+%$/)).toBeTruthy();
      expect(getByText(/^\d+\/\d+ days$/)).toBeTruthy();
    });

    it('hides the stat when showCompletionRate is false', () => {
      const { queryByText } = render(
        <BinaryHeatmap {...defaultProps} showCompletionRate={false} />
      );
      expect(queryByText(/^\d+\/\d+ days$/)).toBeNull();
    });

    it('shows 0% for an empty completion set', () => {
      const { getByText } = render(
        <BinaryHeatmap {...defaultProps} completedDates={new Set()} />
      );
      expect(getByText('0%')).toBeTruthy();
    });
  });

  describe('Day press handling', () => {
    it('calls onDayPress when a day cell is pressed', () => {
      const onDayPress = jest.fn();
      const { getAllByRole } = render(
        <BinaryHeatmap {...defaultProps} onDayPress={onDayPress} />
      );
      const cells = getAllByRole('button');
      fireEvent.press(cells[0], { nativeEvent: { pageX: 10, pageY: 20 } });
      expect(onDayPress).toHaveBeenCalled();
    });

    it('does not throw when onDayPress is omitted', () => {
      expect(() =>
        render(<BinaryHeatmap {...defaultProps} onDayPress={undefined} />)
      ).not.toThrow();
    });
  });

  describe('Edge cases', () => {
    it('renders across all time ranges', () => {
      const ranges: TimeRange[] = ['3m', '6m', '1y'];
      for (const timeRange of ranges) {
        const { getByLabelText, unmount } = render(
          <BinaryHeatmap {...defaultProps} timeRange={timeRange} />
        );
        expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
        unmount();
      }
    });

    it('handles undefined, future, and distant-past habitCreatedAt', () => {
      const cases = [undefined, Date.now() + 8.64e7 * 30, Date.now() - 8.64e7 * 730];
      for (const habitCreatedAt of cases) {
        const { getByLabelText, unmount } = render(
          <BinaryHeatmap {...defaultProps} habitCreatedAt={habitCreatedAt} />
        );
        expect(getByLabelText('Habit completion heatmap')).toBeTruthy();
        unmount();
      }
    });
  });
});
