/**
 * StrengthInsightsRow Component Tests
 *
 * Tests for the three-column insights layout:
 * - Renders three insight cards (Delta, Peak, Lowest)
 * - Displays correct values and formatting
 * - Shows appropriate icons for delta direction
 * - Handles edge cases (zero, negative, boundary values)
 * - Accessibility attributes are present
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { StrengthInsightsRow } from '../StrengthInsightsRow';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Mock useReducedMotion to return false by default
  Reanimated.useReducedMotion = jest.fn(() => false);

  // Mock FadeIn entering animation
  Reanimated.FadeIn = {
    delay: jest.fn(() => ({
      duration: jest.fn(() => ({})),
    })),
  };

  return Reanimated;
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
    Trophy: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-trophy', ...props }),
    BarChart3: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'icon-chart', ...props }),
  };
});

describe('StrengthInsightsRow', () => {
  const defaultProps = {
    deltaVsMonth: 28,
    peak: 89,
    lowest: 12,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const Reanimated = require('react-native-reanimated');
    Reanimated.useReducedMotion.mockReturnValue(false);
  });

  describe('Component Rendering', () => {
    it('should render without crashing', () => {
      const { toJSON } = render(<StrengthInsightsRow {...defaultProps} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should render three insight cards', () => {
      const { getByText } = render(<StrengthInsightsRow {...defaultProps} />);

      // Check all three labels are present
      expect(getByText('vs Month')).toBeTruthy();
      expect(getByText('Peak')).toBeTruthy();
      expect(getByText('Lowest')).toBeTruthy();
    });

    it('should render all required icons', () => {
      const { getByTestId } = render(<StrengthInsightsRow {...defaultProps} />);

      expect(getByTestId('icon-trending-up')).toBeTruthy();
      expect(getByTestId('icon-trophy')).toBeTruthy();
      expect(getByTestId('icon-chart')).toBeTruthy();
    });
  });

  describe('Delta Values', () => {
    it('should display positive delta with plus sign', () => {
      const { getByText } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={15} />
      );
      expect(getByText('+15%')).toBeTruthy();
    });

    it('should display negative delta with minus sign', () => {
      const { getByText } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={-10} />
      );
      expect(getByText('-10%')).toBeTruthy();
    });

    it('should display zero delta as 0%', () => {
      const { getByText } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={0} />
      );
      expect(getByText('0%')).toBeTruthy();
    });

    it('should round decimal delta values', () => {
      const { getByText } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={15.7} />
      );
      expect(getByText('+16%')).toBeTruthy();
    });
  });

  describe('Delta Icons', () => {
    it('should show trending up icon for positive delta', () => {
      const { getByTestId, queryByTestId } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={10} />
      );
      expect(getByTestId('icon-trending-up')).toBeTruthy();
      expect(queryByTestId('icon-trending-down')).toBeNull();
      // Minus icon won't be shown in delta card
    });

    it('should show trending down icon for negative delta', () => {
      const { getByTestId, queryByTestId } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={-10} />
      );
      expect(getByTestId('icon-trending-down')).toBeTruthy();
      expect(queryByTestId('icon-trending-up')).toBeNull();
    });

    it('should show minus icon for zero delta', () => {
      const { getByTestId, queryByTestId } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={0} />
      );
      expect(getByTestId('icon-minus')).toBeTruthy();
      expect(queryByTestId('icon-trending-up')).toBeNull();
      expect(queryByTestId('icon-trending-down')).toBeNull();
    });
  });

  describe('Peak and Lowest Values', () => {
    it('should display peak percentage correctly', () => {
      const { getByText } = render(<StrengthInsightsRow {...defaultProps} />);
      expect(getByText('89%')).toBeTruthy();
    });

    it('should display lowest percentage correctly', () => {
      const { getByText } = render(<StrengthInsightsRow {...defaultProps} />);
      expect(getByText('12%')).toBeTruthy();
    });

    it('should round peak to nearest integer', () => {
      const { getByText } = render(
        <StrengthInsightsRow {...defaultProps} peak={89.7} />
      );
      expect(getByText('90%')).toBeTruthy();
    });

    it('should round lowest to nearest integer', () => {
      const { getByText } = render(
        <StrengthInsightsRow {...defaultProps} lowest={12.3} />
      );
      expect(getByText('12%')).toBeTruthy();
    });
  });

  describe('Edge Cases - Boundary Values', () => {
    it('should handle 0% peak', () => {
      const { getAllByText } = render(
        <StrengthInsightsRow {...defaultProps} peak={0} />
      );
      // Multiple 0% values may appear (including delta if zero)
      const zeroValues = getAllByText('0%');
      expect(zeroValues.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle 100% peak', () => {
      const { getByText } = render(
        <StrengthInsightsRow {...defaultProps} peak={100} />
      );
      expect(getByText('100%')).toBeTruthy();
    });

    it('should handle 0% lowest', () => {
      const { getAllByText } = render(
        <StrengthInsightsRow {...defaultProps} lowest={0} />
      );
      const zeroValues = getAllByText('0%');
      expect(zeroValues.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle same peak and lowest', () => {
      const { getAllByText } = render(
        <StrengthInsightsRow {...defaultProps} peak={50} lowest={50} />
      );
      // Both should show 50%
      const fiftyPercents = getAllByText('50%');
      expect(fiftyPercents.length).toBe(2);
    });

    it('should handle large positive delta', () => {
      const { getByText } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={100} />
      );
      expect(getByText('+100%')).toBeTruthy();
    });

    it('should handle large negative delta', () => {
      const { getByText } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={-100} />
      );
      expect(getByText('-100%')).toBeTruthy();
    });
  });

  describe('Reduced Motion', () => {
    it('should render correctly with reduced motion', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      const { toJSON } = render(<StrengthInsightsRow {...defaultProps} />);
      expect(toJSON()).toBeTruthy();
    });

    it('should still display all values with reduced motion', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      const { getByText } = render(<StrengthInsightsRow {...defaultProps} />);
      expect(getByText('+28%')).toBeTruthy();
      expect(getByText('89%')).toBeTruthy();
      expect(getByText('12%')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible container', () => {
      const { getByLabelText } = render(
        <StrengthInsightsRow {...defaultProps} />
      );
      const container = getByLabelText(
        'Habit strength insights and statistics'
      );
      expect(container).toBeTruthy();
    });

    it('should have accessibility labels for delta card', () => {
      const { getByLabelText } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={15} />
      );
      const deltaCard = getByLabelText(
        'Improved 15 percent compared to last month'
      );
      expect(deltaCard).toBeTruthy();
    });

    it('should have accessibility labels for declined delta', () => {
      const { getByLabelText } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={-10} />
      );
      const deltaCard = getByLabelText(
        'Declined 10 percent compared to last month'
      );
      expect(deltaCard).toBeTruthy();
    });

    it('should have accessibility label for peak card', () => {
      const { getByLabelText } = render(
        <StrengthInsightsRow {...defaultProps} />
      );
      const peakCard = getByLabelText('Peak strength: 89 percent');
      expect(peakCard).toBeTruthy();
    });

    it('should have accessibility label for lowest card', () => {
      const { getByLabelText } = render(
        <StrengthInsightsRow {...defaultProps} />
      );
      const lowestCard = getByLabelText('Lowest strength: 12 percent');
      expect(lowestCard).toBeTruthy();
    });

    it('should have text accessibility role on cards', () => {
      const { getByLabelText } = render(
        <StrengthInsightsRow {...defaultProps} />
      );
      const peakCard = getByLabelText('Peak strength: 89 percent');
      expect(peakCard.props.accessibilityRole).toBe('text');
    });
  });

  describe('Icon Props', () => {
    // Delta icon colors updated to WCAG AA compliant variants
    it('should have correct color for positive delta icon (WCAG AA)', () => {
      const { getByTestId } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={10} />
      );
      const icon = getByTestId('icon-trending-up');
      expect(icon.props.color).toBe('#047857'); // emerald-700 (WCAG AA: 5.48:1)
    });

    it('should have correct color for negative delta icon (WCAG AA)', () => {
      const { getByTestId } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={-10} />
      );
      const icon = getByTestId('icon-trending-down');
      expect(icon.props.color).toBe('#dc2626'); // red-600 (WCAG AA: 4.83:1)
    });

    it('should have correct color for zero delta icon (WCAG AA)', () => {
      const { getByTestId } = render(
        <StrengthInsightsRow {...defaultProps} deltaVsMonth={0} />
      );
      const icon = getByTestId('icon-minus');
      expect(icon.props.color).toBe('#78716c'); // stone-500 (WCAG AA: 4.80:1)
    });

    it('should have correct color for trophy icon', () => {
      const { getByTestId } = render(<StrengthInsightsRow {...defaultProps} />);
      const icon = getByTestId('icon-trophy');
      // Trophy is decorative (paired with text label), amber-500 retained for visual appeal
      expect(icon.props.color).toBe('#f59e0b'); // amber-500
    });

    it('should have correct color for chart icon', () => {
      const { getByTestId } = render(<StrengthInsightsRow {...defaultProps} />);
      const icon = getByTestId('icon-chart');
      expect(icon.props.color).toBe('#6b7280'); // gray-500
    });

    it('should have correct size for all icons', () => {
      const { getByTestId } = render(<StrengthInsightsRow {...defaultProps} />);

      expect(getByTestId('icon-trending-up').props.size).toBe(18);
      expect(getByTestId('icon-trophy').props.size).toBe(18);
      expect(getByTestId('icon-chart').props.size).toBe(18);
    });
  });
});
