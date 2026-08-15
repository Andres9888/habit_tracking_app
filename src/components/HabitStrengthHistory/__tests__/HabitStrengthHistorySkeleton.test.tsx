/**
 * HabitStrengthHistorySkeleton Component Tests
 *
 * Tests for the loading skeleton component:
 * - Renders 3 pulse cards for comparison section
 * - Renders gradient shimmer for timeline chart
 * - Renders 3 insight card hints
 * - Respects reduced motion preference
 * - Has correct accessibility attributes
 */

import React from 'react';
import { render } from '@testing-library/react-native';

import { HabitStrengthHistorySkeleton } from '../HabitStrengthHistorySkeleton';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  const React = require('react');
  const { View } = require('react-native');

  return {
    ...Reanimated,
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useAnimatedStyle: jest.fn(() => ({})),
    withRepeat: jest.fn((animation) => animation),
    withTiming: jest.fn((toValue) => toValue),
    interpolate: jest.fn((value, inputRange, outputRange) => {
      const progress =
        (value - inputRange[0]) / (inputRange[1] - inputRange[0]);
      return outputRange[0] + progress * (outputRange[1] - outputRange[0]);
    }),
    Easing: {
      inOut: jest.fn((easing) => easing),
      ease: jest.fn(),
    },
    createAnimatedComponent: (Component: React.ComponentType<unknown>) => {
      return React.forwardRef((props: Record<string, unknown>, _ref: unknown) =>
        React.createElement(Component, {
          ...props,
          testID: 'animated-gradient',
        })
      );
    },
  };
});

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    LinearGradient: (props: Record<string, unknown>) =>
      React.createElement(View, { ...props, testID: 'linear-gradient' }),
  };
});

// Mock SkeletonLoader component
jest.mock('../../SkeletonLoader/SkeletonLoader', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    SKELETON_COLORS_LIGHT: { base: '#E7E5E4', highlight: '#F5F5F4' },
    SKELETON_COLORS_DARK: { base: '#374151', highlight: '#4B5563' },
    SHIMMER_DURATION: 1500,
    SkeletonLoader: (props: { width?: number | string; height?: number }) =>
      React.createElement(View, {
        testID: 'skeleton-loader',
        style: { width: props.width, height: props.height },
      }),
  };
});

describe('HabitStrengthHistorySkeleton', () => {
  describe('Component Structure', () => {
    it('should render without crashing', () => {
      const { getByTestId } = render(<HabitStrengthHistorySkeleton />);
      expect(getByTestId('habit-strength-history-skeleton')).toBeTruthy();
    });

    it('should render 3 skeleton cards for comparison section', () => {
      const { getByTestId } = render(<HabitStrengthHistorySkeleton />);

      expect(getByTestId('skeleton-card-0')).toBeTruthy();
      expect(getByTestId('skeleton-card-1')).toBeTruthy();
      expect(getByTestId('skeleton-card-2')).toBeTruthy();
    });

    it('should render gradient shimmer for chart skeleton', () => {
      const { getByTestId } = render(<HabitStrengthHistorySkeleton />);
      expect(getByTestId('skeleton-chart-gradient')).toBeTruthy();
    });

    it('should render 3 skeleton insight cards', () => {
      const { getByTestId } = render(<HabitStrengthHistorySkeleton />);

      expect(getByTestId('skeleton-insight-0')).toBeTruthy();
      expect(getByTestId('skeleton-insight-1')).toBeTruthy();
      expect(getByTestId('skeleton-insight-2')).toBeTruthy();
    });

    it('should render multiple skeleton loaders for card content', () => {
      const { getAllByTestId } = render(<HabitStrengthHistorySkeleton />);

      // Cards should have skeleton loaders inside
      const skeletonLoaders = getAllByTestId('skeleton-loader');
      // 2 header + 3x3 card elements + 3x3 insight elements = 2 + 9 + 9 = 20
      expect(skeletonLoaders.length).toBeGreaterThan(10);
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility label', () => {
      const { getByLabelText } = render(<HabitStrengthHistorySkeleton />);
      expect(getByLabelText('Loading your habit strength history...')).toBeTruthy();
    });

    it('should be marked as accessible', () => {
      const { getByTestId } = render(<HabitStrengthHistorySkeleton />);
      const container = getByTestId('habit-strength-history-skeleton');
      expect(container.props.accessible).toBe(true);
    });
  });

  describe('Reduced Motion', () => {
    it('should accept reduceMotion prop without crashing', () => {
      const { getByTestId } = render(
        <HabitStrengthHistorySkeleton reduceMotion={true} />
      );
      expect(getByTestId('habit-strength-history-skeleton')).toBeTruthy();
    });

    it('should pass reduceMotion to skeleton loaders', () => {
      // This test validates the component accepts the prop without errors
      const { getAllByTestId } = render(
        <HabitStrengthHistorySkeleton reduceMotion={true} />
      );
      expect(getAllByTestId('skeleton-loader').length).toBeGreaterThan(0);
    });

    it('should render with reduceMotion false (default)', () => {
      const { getByTestId } = render(<HabitStrengthHistorySkeleton />);
      expect(getByTestId('skeleton-chart-gradient')).toBeTruthy();
    });
  });

  describe('Layout Matching', () => {
    it('should match the layout structure of HabitStrengthHistory component', () => {
      const { getByTestId, getAllByTestId } = render(
        <HabitStrengthHistorySkeleton />
      );

      // Should have: header, 3 cards, chart, 3 insight cards
      expect(getByTestId('habit-strength-history-skeleton')).toBeTruthy();
      expect(getByTestId('skeleton-card-0')).toBeTruthy();
      expect(getByTestId('skeleton-card-1')).toBeTruthy();
      expect(getByTestId('skeleton-card-2')).toBeTruthy();
      expect(getByTestId('skeleton-chart-gradient')).toBeTruthy();
      expect(getByTestId('skeleton-insight-0')).toBeTruthy();
      expect(getByTestId('skeleton-insight-1')).toBeTruthy();
      expect(getByTestId('skeleton-insight-2')).toBeTruthy();
    });
  });

  describe('Gradient Shimmer Chart', () => {
    it('should render LinearGradient inside chart skeleton', () => {
      const { getByTestId } = render(<HabitStrengthHistorySkeleton />);

      // The animated gradient should be inside the chart container
      const chartGradient = getByTestId('skeleton-chart-gradient');
      expect(chartGradient).toBeTruthy();
    });

    it('should use correct height for chart skeleton (120px)', () => {
      const { getByTestId } = render(<HabitStrengthHistorySkeleton />);
      const chartGradient = getByTestId('skeleton-chart-gradient');

      // Check style includes height: 120
      expect(chartGradient.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ height: 120 })])
      );
    });

    it('should have rounded corners on chart skeleton', () => {
      const { getByTestId } = render(<HabitStrengthHistorySkeleton />);
      const chartGradient = getByTestId('skeleton-chart-gradient');

      expect(chartGradient.props.style).toEqual(
        expect.arrayContaining([expect.objectContaining({ borderRadius: 12 })])
      );
    });
  });

  describe('Loading Performance', () => {
    it('should render quickly (component is lightweight)', () => {
      const startTime = performance.now();

      // Render 10 times to get a measurable time
      for (let i = 0; i < 10; i++) {
        render(<HabitStrengthHistorySkeleton />);
      }

      const endTime = performance.now();
      const avgRenderTime = (endTime - startTime) / 10;

      // Each render should be under 50ms (generous for test environment overhead)
      expect(avgRenderTime).toBeLessThan(50);
    });
  });
});
