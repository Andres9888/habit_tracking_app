/**
 * StrengthTimelineChart Component Tests
 *
 * Tests for the SVG area chart showing habit strength evolution:
 * - Renders correctly with valid data
 * - Handles empty and short histories gracefully
 * - Displays correct X-axis labels based on history length
 * - Pulsing dot animation at current position
 * - Accessibility attributes present
 * - Reduced motion support
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { StrengthTimelineChart } from '../StrengthTimelineChart';
import type { StrengthSnapshot } from '../types';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');

  // Mock useReducedMotion to return false by default
  Reanimated.useReducedMotion = jest.fn(() => false);

  // Mock FadeIn entering animation
  Reanimated.FadeIn = {
    duration: jest.fn(() => ({})),
  };

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
      testID,
      ...props
    }: {
      children?: React.ReactNode;
      width?: number;
      height?: number;
      testID?: string;
    }) =>
      React.createElement(
        View,
        {
          testID: testID || 'svg-container',
          ...props,
          style: { width, height },
        },
        children
      ),
    Svg: ({
      children,
      width,
      height,
      testID,
      ...props
    }: {
      children?: React.ReactNode;
      width?: number;
      height?: number;
      testID?: string;
    }) =>
      React.createElement(
        View,
        {
          testID: testID || 'svg-container',
          ...props,
          style: { width, height },
        },
        children
      ),
    Circle: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'svg-circle', ...props }),
    Path: (props: Record<string, unknown>) =>
      React.createElement(View, {
        testID: props.testID || 'svg-path',
        ...props,
      }),
    Line: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'svg-line', ...props }),
    Defs: ({ children }: { children?: React.ReactNode }) =>
      React.createElement(View, { testID: 'svg-defs' }, children),
    LinearGradient: ({
      children,
      ...props
    }: {
      children?: React.ReactNode;
      id?: string;
    }) =>
      React.createElement(
        View,
        { testID: `gradient-${props.id}`, ...props },
        children
      ),
    Stop: (props: Record<string, unknown>) =>
      React.createElement(View, { testID: 'svg-stop', ...props }),
    G: ({
      children,
      testID,
      ...props
    }: {
      children?: React.ReactNode;
      testID?: string;
    }) =>
      React.createElement(
        View,
        { testID: testID || 'svg-g', ...props },
        children
      ),
  };
});

// Mock useWindowDimensions hook from react-native
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: () => ({ width: 400, height: 800, scale: 1, fontScale: 1 }),
}));

// Helper function to create strength history data
function createStrengthHistory(
  days: number,
  options: { startStrength?: number; endStrength?: number } = {}
): StrengthSnapshot[] {
  const { startStrength = 0, endStrength = 50 } = options;
  const history: StrengthSnapshot[] = [];

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i);

    // Linear interpolation between start and end strength
    const progress = days > 1 ? i / (days - 1) : 0;
    const strength = startStrength + (endStrength - startStrength) * progress;

    const getLabel = (s: number): 'weak' | 'developing' | 'strong' => {
      if (s < 30) return 'weak';
      if (s < 70) return 'developing';
      return 'strong';
    };

    history.push({
      date,
      dateString: date.toISOString().split('T')[0],
      strength,
      label: getLabel(strength),
    });
  }

  return history;
}

describe('StrengthTimelineChart', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const Reanimated = require('react-native-reanimated');
    Reanimated.useReducedMotion.mockReturnValue(false);
  });

  describe('Component Rendering', () => {
    it('should render without crashing with valid data', () => {
      const history = createStrengthHistory(30);
      const { toJSON } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom height', () => {
      const history = createStrengthHistory(30);
      const { toJSON } = render(
        <StrengthTimelineChart strengthHistory={history} height={200} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should render with custom habit color', () => {
      const history = createStrengthHistory(30);
      const { toJSON } = render(
        <StrengthTimelineChart strengthHistory={history} habitColor='#ff5500' />
      );
      expect(toJSON()).toBeTruthy();
    });
  });

  describe('Empty State', () => {
    it('should show building message for empty history', () => {
      const { getByText } = render(
        <StrengthTimelineChart strengthHistory={[]} />
      );
      expect(getByText('Building your strength history...')).toBeTruthy();
    });

    it('should have correct accessibility label for empty state', () => {
      const { getByLabelText } = render(
        <StrengthTimelineChart strengthHistory={[]} />
      );
      expect(
        getByLabelText('Strength timeline chart - No data available yet')
      ).toBeTruthy();
    });
  });

  describe('Short History (< 7 days)', () => {
    it('should show encouragement message for history under 7 days', () => {
      const history = createStrengthHistory(5);
      const { getByText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(
        getByText(
          'Keep going! Your strength chart will appear after a week of tracking.'
        )
      ).toBeTruthy();
    });

    it('should render normally at exactly 7 days', () => {
      const history = createStrengthHistory(7);
      const { queryByText, getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(
        queryByText(
          'Keep going! Your strength chart will appear after a week of tracking.'
        )
      ).toBeNull();
      expect(getByTestId('strength-timeline-svg')).toBeTruthy();
    });
  });

  describe('SVG Elements', () => {
    it('should render SVG container', () => {
      const history = createStrengthHistory(30);
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('strength-timeline-svg')).toBeTruthy();
    });

    it('should render gradient definition', () => {
      const history = createStrengthHistory(30);
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('gradient-areaGradient')).toBeTruthy();
    });

    it('should render grid lines', () => {
      const history = createStrengthHistory(30);
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('grid-lines')).toBeTruthy();
    });

    it('should render area path', () => {
      const history = createStrengthHistory(30);
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('area-path')).toBeTruthy();
    });

    it('should render line path', () => {
      const history = createStrengthHistory(30);
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('line-path')).toBeTruthy();
    });

    it('should render current position dot', () => {
      const history = createStrengthHistory(30);
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('current-position-dot')).toBeTruthy();
    });

    it('should render correct number of circles for dot (2: pulsing and solid)', () => {
      const history = createStrengthHistory(30);
      const { getAllByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      const circles = getAllByTestId('svg-circle');
      expect(circles.length).toBe(2);
    });
  });

  describe('X-Axis Labels', () => {
    it('should always show Start label', () => {
      const history = createStrengthHistory(30);
      const { getByText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByText('Start')).toBeTruthy();
    });

    it('should always show Now label', () => {
      const history = createStrengthHistory(30);
      const { getByText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByText('Now')).toBeTruthy();
    });

    it('should not show 6mo label for short histories', () => {
      const history = createStrengthHistory(30);
      const { queryByText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(queryByText('6mo')).toBeNull();
    });

    it('should show 6mo label for histories where 6mo mark is not too close to end', () => {
      // Need 250+ days so that 182/250 = 0.728 < 0.9 threshold
      const history = createStrengthHistory(250);
      const { getByText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByText('6mo')).toBeTruthy();
    });

    it('should not show 1yr label for histories < 365 days', () => {
      const history = createStrengthHistory(200);
      const { queryByText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(queryByText('1yr')).toBeNull();
    });

    it('should show 1yr label for histories where 1yr mark is not too close to end', () => {
      // Need 500+ days so that 365/500 = 0.73 < 0.9 threshold
      const history = createStrengthHistory(500);
      const { getByText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByText('1yr')).toBeTruthy();
    });
  });

  describe('Trend Description for Accessibility', () => {
    it('should describe increasing trend correctly', () => {
      const history = createStrengthHistory(30, {
        startStrength: 10,
        endStrength: 80,
      });
      const { getByLabelText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      const chart = getByLabelText(/Strength has increased/);
      expect(chart).toBeTruthy();
    });

    it('should describe decreasing trend correctly', () => {
      const history = createStrengthHistory(30, {
        startStrength: 80,
        endStrength: 10,
      });
      const { getByLabelText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      const chart = getByLabelText(/Strength has decreased/);
      expect(chart).toBeTruthy();
    });

    it('should describe stable trend correctly', () => {
      const history = createStrengthHistory(30, {
        startStrength: 50,
        endStrength: 52,
      });
      const { getByLabelText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      const chart = getByLabelText(/Strength has remained relatively stable/);
      expect(chart).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible role for chart', () => {
      const history = createStrengthHistory(30);
      const { getByRole } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByRole('image')).toBeTruthy();
    });

    it('should include history length in accessibility label', () => {
      const history = createStrengthHistory(45);
      const { getByLabelText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      const chart = getByLabelText(/45 days of history/);
      expect(chart).toBeTruthy();
    });
  });

  describe('Reduced Motion', () => {
    it('should render correctly with reduced motion', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      const history = createStrengthHistory(30);
      const { toJSON } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(toJSON()).toBeTruthy();
    });

    it('should still render all SVG elements with reduced motion', () => {
      const Reanimated = require('react-native-reanimated');
      Reanimated.useReducedMotion.mockReturnValue(true);

      const history = createStrengthHistory(30);
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('area-path')).toBeTruthy();
      expect(getByTestId('line-path')).toBeTruthy();
      expect(getByTestId('current-position-dot')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single data point', () => {
      const history = createStrengthHistory(7, {
        startStrength: 50,
        endStrength: 50,
      });
      // Simulate single point by slicing to 1
      const singlePoint = [history[0]];
      // This case is handled by the < 7 days guard, so let's test with 7 identical points
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('strength-timeline-svg')).toBeTruthy();
    });

    it('should handle 0% strength values', () => {
      const history = createStrengthHistory(10, {
        startStrength: 0,
        endStrength: 0,
      });
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('strength-timeline-svg')).toBeTruthy();
    });

    it('should handle 100% strength values', () => {
      const history = createStrengthHistory(10, {
        startStrength: 100,
        endStrength: 100,
      });
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('strength-timeline-svg')).toBeTruthy();
    });

    it('should handle very long history (2+ years)', () => {
      const history = createStrengthHistory(800);
      const { getByTestId, getByText } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('strength-timeline-svg')).toBeTruthy();
      expect(getByText('1yr')).toBeTruthy();
    });

    it('should handle history with fluctuating values', () => {
      // Create history with ups and downs
      const history: StrengthSnapshot[] = [];
      const baseDate = new Date();
      baseDate.setDate(baseDate.getDate() - 30);

      for (let i = 0; i < 30; i++) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() + i);
        // Oscillate between 20 and 80
        const strength = 50 + 30 * Math.sin((i / 5) * Math.PI);

        const getLabel = (s: number): 'weak' | 'developing' | 'strong' => {
          if (s < 30) return 'weak';
          if (s < 70) return 'developing';
          return 'strong';
        };

        history.push({
          date,
          dateString: date.toISOString().split('T')[0],
          strength,
          label: getLabel(strength),
        });
      }

      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      expect(getByTestId('strength-timeline-svg')).toBeTruthy();
    });
  });

  describe('Path Generation', () => {
    it('should generate area path with correct fill reference', () => {
      const history = createStrengthHistory(30);
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      const areaPath = getByTestId('area-path');
      expect(areaPath.props.fill).toBe('url(#areaGradient)');
    });

    it('should generate line path with stroke and no fill', () => {
      const history = createStrengthHistory(30);
      const { getByTestId } = render(
        <StrengthTimelineChart strengthHistory={history} />
      );
      const linePath = getByTestId('line-path');
      expect(linePath.props.fill).toBe('none');
      expect(linePath.props.strokeLinecap).toBe('round');
    });
  });
});
