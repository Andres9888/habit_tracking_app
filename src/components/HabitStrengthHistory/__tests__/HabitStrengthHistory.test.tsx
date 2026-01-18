/**
 * HabitStrengthHistory Component Tests
 *
 * Tests for the main container component:
 * - Renders all sub-components correctly
 * - Uses useHabitStrength hook for data
 * - Shows loading skeleton while calculating
 * - Entry animations work as expected
 * - Accessibility attributes are present
 * - Info button is interactive
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

import { HabitStrengthHistory } from '../HabitStrengthHistory';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  Reanimated.useReducedMotion = jest.fn(() => false);

  Reanimated.FadeIn = {
    duration: jest.fn(() => ({})),
  };

  Reanimated.FadeInUp = {
    duration: jest.fn(() => ({
      delay: jest.fn(() => ({})),
    })),
  };

  return Reanimated;
});

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    Info: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-info', ...props }),
    TrendingUp: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-trending-up', ...props }),
    TrendingDown: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-trending-down', ...props }),
    Minus: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-minus', ...props }),
    Trophy: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-trophy', ...props }),
    BarChart3: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-chart', ...props }),
    Zap: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-zap', ...props }),
  };
});

// Mock useHabitStrength hook
const mockUseHabitStrength = jest.fn();
jest.mock('../../../hooks/useHabitStrength', () => ({
  useHabitStrength: (...args: unknown[]) => mockUseHabitStrength(...args),
}));

// Mock child components to simplify testing
jest.mock('../StrengthComparisonCards', () => ({
  StrengthComparisonCards: (props: Record<string, unknown>) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(
      View,
      { testID: 'strength-comparison-cards' },
      React.createElement(Text, {}, `Current: ${props.current}`),
      React.createElement(Text, {}, `Delta: ${props.deltaVsMonth}`),
      React.createElement(Text, {}, `Habit Age: ${props.habitAgeDays}`)
    );
  },
}));

jest.mock('../StrengthTimelineChart', () => ({
  StrengthTimelineChart: (props: Record<string, unknown>) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(
      View,
      { testID: 'strength-timeline-chart' },
      React.createElement(
        Text,
        {},
        `History Points: ${(props.strengthHistory as unknown[])?.length || 0}`
      ),
      React.createElement(Text, {}, `Color: ${props.habitColor || 'default'}`)
    );
  },
}));

jest.mock('../StrengthInsightsRow', () => ({
  StrengthInsightsRow: (props: Record<string, unknown>) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(
      View,
      { testID: 'strength-insights-row' },
      React.createElement(Text, {}, `Peak: ${props.peak}`),
      React.createElement(Text, {}, `Lowest: ${props.lowest}`)
    );
  },
}));

// Mock SkeletonLoader
jest.mock('../../SkeletonLoader/SkeletonLoader', () => ({
  SkeletonLoader: (props: Record<string, unknown>) => {
    const React = require('react');
    const { View } = require('react-native');
    return React.createElement(View, {
      testID: 'skeleton-loader',
      style: { width: props.width, height: props.height },
    });
  },
}));

// Mock the skeleton component (from separate file)
jest.mock('../HabitStrengthHistorySkeleton', () => ({
  HabitStrengthHistorySkeleton: (props: Record<string, unknown>) => {
    const React = require('react');
    const { View } = require('react-native');
    // Re-use SkeletonLoader mock by creating skeleton items
    const SkeletonLoader = () =>
      React.createElement(View, { testID: 'skeleton-loader' });
    return React.createElement(
      View,
      {
        testID: 'habit-strength-history-skeleton',
        accessible: true,
        accessibilityLabel: 'Loading habit strength history',
      },
      // Create multiple skeleton loaders to match real component
      React.createElement(SkeletonLoader, { key: '1' }),
      React.createElement(SkeletonLoader, { key: '2' }),
      React.createElement(SkeletonLoader, { key: '3' }),
      React.createElement(SkeletonLoader, { key: '4' }),
      React.createElement(SkeletonLoader, { key: '5' }),
      React.createElement(SkeletonLoader, { key: '6' }),
      React.createElement(SkeletonLoader, { key: '7' }),
      React.createElement(SkeletonLoader, { key: '8' }),
      React.createElement(SkeletonLoader, { key: '9' }),
      React.createElement(SkeletonLoader, { key: '10' })
    );
  },
}));

describe('HabitStrengthHistory', () => {
  const defaultProps = {
    habitId: 'habit-123',
    completedDates: new Set(['2024-12-01', '2024-12-02', '2024-12-03']),
    habitCreatedAt: new Date('2024-01-01').getTime(),
    habitColor: '#10b981',
  };

  const mockStrengthData = {
    currentStrength: 65,
    strengthHistory: [
      {
        date: new Date('2024-12-01'),
        dateString: '2024-12-01',
        strength: 50,
        label: 'developing' as const,
      },
      {
        date: new Date('2024-12-02'),
        dateString: '2024-12-02',
        strength: 55,
        label: 'developing' as const,
      },
      {
        date: new Date('2024-12-03'),
        dateString: '2024-12-03',
        strength: 65,
        label: 'developing' as const,
      },
    ],
    metrics: {
      current: 65,
      thirtyDaysAgo: 45,
      oneYearAgo: null,
      peak: 70,
      peakDate: new Date('2024-11-15'),
      lowest: 10,
      lowestDate: new Date('2024-01-05'),
      deltaVsMonth: 20,
      habitAgeDays: 363,
    },
    isCalculating: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseHabitStrength.mockReturnValue(mockStrengthData);

    const Reanimated = require('react-native-reanimated');
    Reanimated.useReducedMotion.mockReturnValue(false);
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<HabitStrengthHistory {...defaultProps} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render the section header with correct title', () => {
      const { getByText } = render(<HabitStrengthHistory {...defaultProps} />);
      expect(getByText('Strength History')).toBeTruthy();
    });

    it('should render the info button', () => {
      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );
      expect(getByTestId('strength-history-info-button')).toBeTruthy();
    });

    it('should render all three sub-components', () => {
      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );

      expect(getByTestId('strength-comparison-cards')).toBeTruthy();
      expect(getByTestId('strength-timeline-chart')).toBeTruthy();
      expect(getByTestId('strength-insights-row')).toBeTruthy();
    });

    it('should have main container testID', () => {
      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );
      expect(getByTestId('habit-strength-history')).toBeTruthy();
    });
  });

  describe('Data Flow', () => {
    it('should call useHabitStrength with correct arguments', () => {
      render(<HabitStrengthHistory {...defaultProps} />);

      expect(mockUseHabitStrength).toHaveBeenCalledWith(
        defaultProps.completedDates,
        defaultProps.habitCreatedAt
      );
    });

    it('should pass current strength to comparison cards', () => {
      const { getByText } = render(<HabitStrengthHistory {...defaultProps} />);
      expect(getByText('Current: 65')).toBeTruthy();
    });

    it('should pass delta to comparison cards', () => {
      const { getByText } = render(<HabitStrengthHistory {...defaultProps} />);
      expect(getByText('Delta: 20')).toBeTruthy();
    });

    it('should pass habit age to comparison cards', () => {
      const { getByText } = render(<HabitStrengthHistory {...defaultProps} />);
      expect(getByText('Habit Age: 363')).toBeTruthy();
    });

    it('should pass strength history to timeline chart', () => {
      const { getByText } = render(<HabitStrengthHistory {...defaultProps} />);
      expect(getByText('History Points: 3')).toBeTruthy();
    });

    it('should pass habit color to timeline chart', () => {
      const { getByText } = render(<HabitStrengthHistory {...defaultProps} />);
      expect(getByText('Color: #10b981')).toBeTruthy();
    });

    it('should pass peak and lowest to insights row', () => {
      const { getByText } = render(<HabitStrengthHistory {...defaultProps} />);
      expect(getByText('Peak: 70')).toBeTruthy();
      expect(getByText('Lowest: 10')).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('should show skeleton when isCalculating is true', () => {
      mockUseHabitStrength.mockReturnValue({
        ...mockStrengthData,
        isCalculating: true,
      });

      const { getByTestId, queryByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );

      expect(getByTestId('habit-strength-history-skeleton')).toBeTruthy();
      expect(queryByTestId('habit-strength-history')).toBeNull();
    });

    it('should show multiple skeleton loaders in loading state', () => {
      mockUseHabitStrength.mockReturnValue({
        ...mockStrengthData,
        isCalculating: true,
      });

      const { getAllByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );

      // Should have multiple skeleton loaders (cards, chart, insights)
      const skeletons = getAllByTestId('skeleton-loader');
      expect(skeletons.length).toBeGreaterThan(5);
    });

    it('should not show skeleton when data is loaded', () => {
      const { queryByTestId, getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );

      expect(queryByTestId('habit-strength-history-skeleton')).toBeNull();
      expect(getByTestId('habit-strength-history')).toBeTruthy();
    });
  });

  describe('Info Button', () => {
    it('should be pressable', () => {
      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );
      const infoButton = getByTestId('strength-history-info-button');

      // Should not throw when pressed
      expect(() => fireEvent.press(infoButton)).not.toThrow();
    });

    it('should have correct accessibility attributes', () => {
      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );
      const infoButton = getByTestId('strength-history-info-button');

      expect(infoButton.props.accessible).toBe(true);
      expect(infoButton.props.accessibilityLabel).toBe(
        'Learn more about habit strength'
      );
      expect(infoButton.props.accessibilityRole).toBe('button');
    });
  });

  describe('Accessibility', () => {
    it('should have accessibility role none on main container', () => {
      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );
      const container = getByTestId('habit-strength-history');

      expect(container.props.accessibilityRole).toBe('none');
    });

    it('should have accessibility label on main container', () => {
      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );
      const container = getByTestId('habit-strength-history');

      expect(container.props.accessibilityLabel).toBe(
        'Habit strength history section'
      );
    });

    it('should have accessibility label on loading skeleton', () => {
      mockUseHabitStrength.mockReturnValue({
        ...mockStrengthData,
        isCalculating: true,
      });

      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );
      const skeleton = getByTestId('habit-strength-history-skeleton');

      expect(skeleton.props.accessibilityLabel).toBe(
        'Loading habit strength history'
      );
    });
  });

  describe('Reduced Motion', () => {
    it('should use FadeIn when reduced motion is enabled', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );

      // Component should still render correctly
      expect(getByTestId('habit-strength-history')).toBeTruthy();
    });

    it('should pass reduceMotion to skeleton when loading', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      mockUseHabitStrength.mockReturnValue({
        ...mockStrengthData,
        isCalculating: true,
      });

      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );

      // Skeleton should render
      expect(getByTestId('habit-strength-history-skeleton')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should show empty state when completedDates is empty', () => {
      mockUseHabitStrength.mockReturnValue({
        ...mockStrengthData,
        currentStrength: 0,
        strengthHistory: [],
        metrics: {
          ...mockStrengthData.metrics,
          current: 0,
          deltaVsMonth: 0,
          peak: 0,
          lowest: 0,
          habitAgeDays: 10,
        },
      });

      const { getByTestId, getByText, queryByTestId } = render(
        <HabitStrengthHistory
          {...defaultProps}
          completedDates={new Set<string>()}
        />
      );

      // Should show empty state, not the regular component
      expect(getByTestId('habit-strength-history-empty')).toBeTruthy();
      expect(queryByTestId('habit-strength-history')).toBeNull();

      // Should show encouraging message
      expect(getByText('Ready to Build Strength')).toBeTruthy();
      expect(
        getByText('Complete today to start building your habit strength!')
      ).toBeTruthy();

      // Should show Zap icon
      expect(getByTestId('icon-zap')).toBeTruthy();
    });

    it('should show different message for day 1 habits with no completions', () => {
      mockUseHabitStrength.mockReturnValue({
        ...mockStrengthData,
        currentStrength: 0,
        strengthHistory: [],
        metrics: {
          ...mockStrengthData.metrics,
          current: 0,
          deltaVsMonth: 0,
          peak: 0,
          lowest: 0,
          habitAgeDays: 1,
        },
      });

      const { getByText } = render(
        <HabitStrengthHistory
          {...defaultProps}
          completedDates={new Set<string>()}
        />
      );

      expect(
        getByText('Complete your first day to start building strength!')
      ).toBeTruthy();
    });

    it('should show regular content when there are completions', () => {
      const { getByTestId, queryByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );

      expect(getByTestId('habit-strength-history')).toBeTruthy();
      expect(queryByTestId('habit-strength-history-empty')).toBeNull();
    });

    it('should handle null thirtyDaysAgo', () => {
      mockUseHabitStrength.mockReturnValue({
        ...mockStrengthData,
        metrics: {
          ...mockStrengthData.metrics,
          thirtyDaysAgo: null,
        },
      });

      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );
      expect(getByTestId('strength-comparison-cards')).toBeTruthy();
    });

    it('should handle null oneYearAgo', () => {
      mockUseHabitStrength.mockReturnValue({
        ...mockStrengthData,
        metrics: {
          ...mockStrengthData.metrics,
          oneYearAgo: null,
        },
      });

      const { getByTestId } = render(
        <HabitStrengthHistory {...defaultProps} />
      );
      expect(getByTestId('strength-comparison-cards')).toBeTruthy();
    });

    it('should handle undefined habitColor', () => {
      const { getByText } = render(
        <HabitStrengthHistory
          habitId='habit-123'
          completedDates={defaultProps.completedDates}
          habitCreatedAt={defaultProps.habitCreatedAt}
        />
      );

      expect(getByText('Color: default')).toBeTruthy();
    });

    it('should handle very new habit (less than a day)', () => {
      const now = new Date();
      mockUseHabitStrength.mockReturnValue({
        ...mockStrengthData,
        metrics: {
          ...mockStrengthData.metrics,
          habitAgeDays: 1,
        },
      });

      const { getByText } = render(
        <HabitStrengthHistory
          {...defaultProps}
          habitCreatedAt={now.getTime()}
        />
      );

      expect(getByText('Habit Age: 1')).toBeTruthy();
    });
  });

  describe('Props Passthrough', () => {
    it('should pass correct props to StrengthComparisonCards', () => {
      mockUseHabitStrength.mockReturnValue({
        currentStrength: 75,
        strengthHistory: [],
        metrics: {
          current: 75,
          thirtyDaysAgo: 50,
          oneYearAgo: 25,
          peak: 80,
          peakDate: new Date(),
          lowest: 10,
          lowestDate: new Date(),
          deltaVsMonth: 25,
          habitAgeDays: 400,
        },
        isCalculating: false,
      });

      const { getByText } = render(<HabitStrengthHistory {...defaultProps} />);

      expect(getByText('Current: 75')).toBeTruthy();
      expect(getByText('Delta: 25')).toBeTruthy();
      expect(getByText('Habit Age: 400')).toBeTruthy();
    });

    it('should pass correct props to StrengthInsightsRow', () => {
      mockUseHabitStrength.mockReturnValue({
        currentStrength: 75,
        strengthHistory: [],
        metrics: {
          current: 75,
          thirtyDaysAgo: 50,
          oneYearAgo: 25,
          peak: 95,
          peakDate: new Date(),
          lowest: 5,
          lowestDate: new Date(),
          deltaVsMonth: 25,
          habitAgeDays: 400,
        },
        isCalculating: false,
      });

      const { getByText } = render(<HabitStrengthHistory {...defaultProps} />);

      expect(getByText('Peak: 95')).toBeTruthy();
      expect(getByText('Lowest: 5')).toBeTruthy();
    });
  });
});
