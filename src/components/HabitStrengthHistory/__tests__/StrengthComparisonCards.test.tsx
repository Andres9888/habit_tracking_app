/**
 * StrengthComparisonCards Component Tests
 *
 * Tests for the three-card strength comparison layout:
 * - Renders three cards (Now, 30 Days, 1 Year)
 * - Displays correct strength percentages
 * - Shows appropriate labels based on habit age
 * - Handles edge cases (new habits, null values)
 * - Delta badge displays correctly
 * - Accessibility attributes are present
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { StrengthComparisonCards } from '../StrengthComparisonCards';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Mock useReducedMotion to return TRUE in tests so animations don't affect values
  // This ensures displayed values show immediately without animation
  Reanimated.useReducedMotion = jest.fn(() => true);

  // Mock FadeIn entering animation
  Reanimated.FadeIn = {
    delay: jest.fn(() => ({
      duration: jest.fn(() => ({})),
    })),
  };

  // Mock runOnJS to execute the function immediately
  Reanimated.runOnJS = jest.fn((fn) => fn);

  // Mock useAnimatedReaction as a no-op to avoid infinite loops
  // When useReducedMotion is true, the component sets the value directly via useState
  Reanimated.useAnimatedReaction = jest.fn(() => {});

  return Reanimated;
});

// Mock react-native-svg
jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: ({
      children,
      width,
      height,
      ...props
    }: {
      children?: React.ReactNode;
      width?: number;
      height?: number;
    }) =>
      React.createElement(
        View,
        { testID: 'svg-container', ...props, style: { width, height } },
        children
      ),
    Svg: ({
      children,
      width,
      height,
      ...props
    }: {
      children?: React.ReactNode;
      width?: number;
      height?: number;
    }) =>
      React.createElement(
        View,
        { testID: 'svg-container', ...props, style: { width, height } },
        children
      ),
    Circle: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'svg-circle', ...props }),
  };
});

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    TrendingUp: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-trending-up', ...props }),
    TrendingDown: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-trending-down', ...props }),
    Minus: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-minus', ...props }),
    Sparkles: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-sparkles', ...props }),
  };
});

describe('StrengthComparisonCards', () => {
  const defaultProps = {
    current: 73,
    thirtyDaysAgo: 45,
    oneYearAgo: 22,
    deltaVsMonth: 28,
    habitAgeDays: 400,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const Reanimated = require('react-native-reanimated');
    // Use reduced motion in tests so values appear immediately without animation
    Reanimated.useReducedMotion.mockReturnValue(true);
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<StrengthComparisonCards {...defaultProps} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render three cards', () => {
      const { getAllByTestId } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      // Each card has an SVG container with circles
      const svgContainers = getAllByTestId('svg-container');
      expect(svgContainers.length).toBe(3);
    });

    it('should render six circles (2 per card - background and progress)', () => {
      const { getAllByTestId } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      const circles = getAllByTestId('svg-circle');
      expect(circles.length).toBe(6);
    });
  });

  describe('Strength Percentages', () => {
    it('should display current strength percentage', () => {
      const { getByText } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      expect(getByText('73%')).toBeTruthy();
    });

    it('should display 30 days ago strength percentage', () => {
      const { getByText } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      expect(getByText('45%')).toBeTruthy();
    });

    it('should display 1 year ago strength percentage', () => {
      const { getByText } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      expect(getByText('22%')).toBeTruthy();
    });

    it('should round strength to nearest integer', () => {
      const { getByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          current={73.7}
          thirtyDaysAgo={45.3}
          oneYearAgo={22.9}
        />
      );
      expect(getByText('74%')).toBeTruthy();
      expect(getByText('45%')).toBeTruthy();
      expect(getByText('23%')).toBeTruthy();
    });
  });

  describe('Time Labels', () => {
    it('should display "Now" label for current strength', () => {
      const { getByText } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      expect(getByText('Now')).toBeTruthy();
    });

    it('should display "30 Days" when habit is older than 30 days', () => {
      const { getByText } = render(
        <StrengthComparisonCards {...defaultProps} habitAgeDays={60} />
      );
      expect(getByText('30 Days')).toBeTruthy();
    });

    it('should display "Start" instead of "30 Days" for young habits', () => {
      const { queryByText, getAllByText } = render(
        <StrengthComparisonCards {...defaultProps} habitAgeDays={15} />
      );
      expect(queryByText('30 Days')).toBeNull();
      // Should have two "Start" labels (for 30 days and 1 year)
      const startLabels = getAllByText('Start');
      expect(startLabels.length).toBe(2);
    });

    it('should display "1 Year" when habit is older than 365 days', () => {
      const { getByText } = render(
        <StrengthComparisonCards {...defaultProps} habitAgeDays={400} />
      );
      expect(getByText('1 Year')).toBeTruthy();
    });

    it('should display "Start" instead of "1 Year" for habits younger than a year', () => {
      const { queryByText, getByText } = render(
        <StrengthComparisonCards {...defaultProps} habitAgeDays={200} />
      );
      expect(queryByText('1 Year')).toBeNull();
      expect(getByText('Start')).toBeTruthy();
    });
  });

  describe('Strength Labels', () => {
    it('should display "Strong" for strength >= 70', () => {
      const { getByText } = render(
        <StrengthComparisonCards {...defaultProps} current={85} />
      );
      expect(getByText('Strong')).toBeTruthy();
    });

    it('should display "Developing" for strength between 30-69', () => {
      const { getAllByText } = render(
        <StrengthComparisonCards {...defaultProps} current={50} />
      );
      // Multiple cards may show "Developing" label
      expect(getAllByText('Developing').length).toBeGreaterThanOrEqual(1);
    });

    it('should display "Weak" for strength < 30', () => {
      const { getAllByText } = render(
        <StrengthComparisonCards {...defaultProps} current={15} />
      );
      // Multiple cards may show "Weak" label
      expect(getAllByText('Weak').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Delta Badge', () => {
    it('should show positive delta with trending up icon', () => {
      const { getByTestId, getByText } = render(
        <StrengthComparisonCards {...defaultProps} deltaVsMonth={15.5} />
      );
      expect(getByTestId('icon-trending-up')).toBeTruthy();
      expect(getByText('+15.5%')).toBeTruthy();
    });

    it('should show negative delta with trending down icon', () => {
      const { getByTestId, getByText } = render(
        <StrengthComparisonCards {...defaultProps} deltaVsMonth={-10.2} />
      );
      expect(getByTestId('icon-trending-down')).toBeTruthy();
      expect(getByText('-10.2%')).toBeTruthy();
    });

    it('should show zero delta with minus icon', () => {
      const { getByTestId, getByText } = render(
        <StrengthComparisonCards {...defaultProps} deltaVsMonth={0} />
      );
      expect(getByTestId('icon-minus')).toBeTruthy();
      expect(getByText('0.0%')).toBeTruthy();
    });
  });

  describe('Edge Cases - Null Values', () => {
    it('should show 0% when thirtyDaysAgo is null', () => {
      const { getByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          thirtyDaysAgo={null}
          habitAgeDays={15}
        />
      );
      // Should render 0% for the "Start" card
      expect(getByText('0%')).toBeTruthy();
    });

    it('should show 0% when oneYearAgo is null', () => {
      const { getAllByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          thirtyDaysAgo={45}
          oneYearAgo={null}
          habitAgeDays={200}
        />
      );
      // Should have at least one 0%
      const zeros = getAllByText('0%');
      expect(zeros.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle both null values gracefully', () => {
      const { getAllByText, queryByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          thirtyDaysAgo={null}
          oneYearAgo={null}
          habitAgeDays={5}
        />
      );
      // Should show two 0% values
      const zeros = getAllByText('0%');
      expect(zeros.length).toBe(2);
      // Should show the current strength
      expect(queryByText('73%')).toBeTruthy();
    });
  });

  describe('Edge Cases - Boundary Values', () => {
    it('should handle 0% strength', () => {
      const { getAllByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          current={0}
          thirtyDaysAgo={0}
          oneYearAgo={0}
        />
      );
      const zeros = getAllByText('0%');
      expect(zeros.length).toBe(3);
    });

    it('should handle 100% strength', () => {
      const { getAllByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          current={100}
          thirtyDaysAgo={100}
          oneYearAgo={100}
        />
      );
      // All three should be 100%
      const hundredPercents = getAllByText('100%');
      expect(hundredPercents.length).toBe(3);
    });

    it('should handle exactly 30 days old habit', () => {
      const { getByText, queryByText } = render(
        <StrengthComparisonCards {...defaultProps} habitAgeDays={30} />
      );
      expect(getByText('30 Days')).toBeTruthy();
      // Should still show "Start" for 1 year
      expect(queryByText('1 Year')).toBeNull();
    });

    it('should handle exactly 365 days old habit', () => {
      const { getByText } = render(
        <StrengthComparisonCards {...defaultProps} habitAgeDays={365} />
      );
      expect(getByText('30 Days')).toBeTruthy();
      expect(getByText('1 Year')).toBeTruthy();
    });
  });

  describe('Reduced Motion', () => {
    it('should render correctly with reduced motion', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      const { toJSON } = render(<StrengthComparisonCards {...defaultProps} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should still display all percentages with reduced motion', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      const { getByText } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      expect(getByText('73%')).toBeTruthy();
      expect(getByText('45%')).toBeTruthy();
      expect(getByText('22%')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible container', () => {
      const { getByLabelText } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      // The container should have an accessibility label
      const container = getByLabelText(
        'Habit strength comparison across timeframes'
      );
      expect(container).toBeTruthy();
    });

    it('should have accessibility label on container', () => {
      const { getByLabelText } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      const container = getByLabelText(
        'Habit strength comparison across timeframes'
      );
      expect(container.props.accessible).toBe(true);
    });
  });

  describe('SVG Circle Attributes', () => {
    it('should render progress circles with ring color from strength', () => {
      const { getAllByTestId } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      const circles = getAllByTestId('svg-circle');

      // Progress circles (every other one starting from index 1)
      // Strong (73%): Emerald ring color
      const progressCircle = circles[1];
      expect(progressCircle.props.stroke).toBe('#6ee7b7'); // Emerald-300
    });

    it('should render background circles with stone color', () => {
      const { getAllByTestId } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      const circles = getAllByTestId('svg-circle');

      // Background circles (every other one starting from index 0)
      const backgroundCircle = circles[0];
      expect(backgroundCircle.props.stroke).toBe('#e7e5e4'); // stone-200
    });

    it('should have correct strokeLinecap on progress circles', () => {
      const { getAllByTestId } = render(
        <StrengthComparisonCards {...defaultProps} />
      );
      const circles = getAllByTestId('svg-circle');

      // Progress circles have strokeLinecap="round"
      expect(circles[1].props.strokeLinecap).toBe('round');
      expect(circles[3].props.strokeLinecap).toBe('round');
      expect(circles[5].props.strokeLinecap).toBe('round');
    });
  });

  describe('Perfect Badge', () => {
    it('should show Perfect badge when completedDates covers all habit days (>= 3 days)', () => {
      // Create a Set with 5 consecutive dates (100% completion for 5 days)
      const completedDates = new Set([
        '2024-12-25',
        '2024-12-26',
        '2024-12-27',
        '2024-12-28',
        '2024-12-29',
      ]);

      const { getByTestId, getByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          completedDates={completedDates}
          habitAgeDays={5}
        />
      );

      expect(getByTestId('perfect-badge')).toBeTruthy();
      expect(getByText('Perfect!')).toBeTruthy();
      expect(getByTestId('icon-sparkles')).toBeTruthy();
    });

    it('should not show Perfect badge for habits younger than 3 days', () => {
      const completedDates = new Set(['2024-12-28', '2024-12-29']);

      const { queryByTestId, queryByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          completedDates={completedDates}
          habitAgeDays={2}
        />
      );

      expect(queryByTestId('perfect-badge')).toBeNull();
      expect(queryByText('Perfect!')).toBeNull();
    });

    it('should not show Perfect badge when completion rate is less than 100%', () => {
      // 3 completions out of 5 days = 60% completion
      const completedDates = new Set([
        '2024-12-25',
        '2024-12-27',
        '2024-12-29',
      ]);

      const { queryByTestId, queryByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          completedDates={completedDates}
          habitAgeDays={5}
        />
      );

      expect(queryByTestId('perfect-badge')).toBeNull();
      expect(queryByText('Perfect!')).toBeNull();
    });

    it('should not show Perfect badge when completedDates is undefined', () => {
      const { queryByTestId, queryByText } = render(
        <StrengthComparisonCards {...defaultProps} />
      );

      expect(queryByTestId('perfect-badge')).toBeNull();
      expect(queryByText('Perfect!')).toBeNull();
    });

    it('should show both delta badge and Perfect badge when conditions are met', () => {
      const completedDates = new Set([
        '2024-12-26',
        '2024-12-27',
        '2024-12-28',
        '2024-12-29',
      ]);

      const { getByTestId, getByText } = render(
        <StrengthComparisonCards
          {...defaultProps}
          completedDates={completedDates}
          habitAgeDays={4}
          deltaVsMonth={25}
        />
      );

      // Should have both badges
      expect(getByTestId('perfect-badge')).toBeTruthy();
      expect(getByText('Perfect!')).toBeTruthy();
      expect(getByTestId('icon-trending-up')).toBeTruthy();
      expect(getByText('+25.0%')).toBeTruthy();
    });

    it('should have correct accessibility label on Perfect badge', () => {
      const completedDates = new Set([
        '2024-12-27',
        '2024-12-28',
        '2024-12-29',
      ]);

      const { getByTestId } = render(
        <StrengthComparisonCards
          {...defaultProps}
          completedDates={completedDates}
          habitAgeDays={3}
        />
      );

      const perfectBadge = getByTestId('perfect-badge');
      expect(perfectBadge.props.accessibilityLabel).toBe(
        'Perfect streak! You have completed every day since starting this habit'
      );
    });
  });
});
