/**
 * FailureViz Tests
 * Story T8.4 - Create FailureViz component (always shows failure)
 *
 * Tests:
 * - Component rendering
 * - Visualization data display (Body, Mind, Emotion)
 * - Streak loss preview
 * - Empty state handling
 * - Accessibility
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { FailureViz, type FailureVisualizationData } from '../FailureViz';

// Mock expo-haptics
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
}));

// Mock lucide-react-native icons
jest.mock('lucide-react-native', () => ({
  AlertTriangle: () => null,
  Brain: () => null,
  Heart: () => null,
  User: () => null,
  Flame: () => null,
}));

// Mock clsx
jest.mock('clsx', () => ({
  clsx: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = jest.requireActual('react-native-reanimated/mock');
  const View = require('react-native').View;
  return {
    __esModule: true,
    ...Reanimated,
    default: {
      ...Reanimated.default,
      View,
      createAnimatedComponent: (Component: React.ComponentType<unknown>) => Component,
    },
    useSharedValue: (initial: unknown) => ({ value: initial }),
    useAnimatedStyle: () => ({}),
    withSpring: (value: unknown) => value,
    withTiming: (value: unknown) => value,
    withDelay: (_delay: unknown, value: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    View,
  };
});

describe('FailureViz', () => {
  const mockVisualization: FailureVisualizationData = {
    failureBody: 'Heavy, sluggish, stuck in bed',
    failureMind: 'Foggy, making excuses, self-doubt',
    failureEmotion: 'Regret, shame, broken promise to myself',
  };

  describe('Rendering', () => {
    it('renders with visualization data', () => {
      const { getByText } = render(
        <FailureViz visualization={mockVisualization} />
      );

      expect(getByText('If You Skip Today...')).toBeTruthy();
    });

    it('renders header subtitle', () => {
      const { getByText } = render(
        <FailureViz visualization={mockVisualization} />
      );

      expect(getByText('Feel the weight of not doing this')).toBeTruthy();
    });
  });

  describe('Visualization fields', () => {
    it('displays Body field', () => {
      const { getByText } = render(
        <FailureViz visualization={mockVisualization} />
      );

      expect(getByText('Body')).toBeTruthy();
      expect(getByText('Heavy, sluggish, stuck in bed')).toBeTruthy();
    });

    it('displays Mind field', () => {
      const { getByText } = render(
        <FailureViz visualization={mockVisualization} />
      );

      expect(getByText('Mind')).toBeTruthy();
      expect(getByText('Foggy, making excuses, self-doubt')).toBeTruthy();
    });

    it('displays Emotion field', () => {
      const { getByText } = render(
        <FailureViz visualization={mockVisualization} />
      );

      expect(getByText('Emotion')).toBeTruthy();
      expect(getByText('Regret, shame, broken promise to myself')).toBeTruthy();
    });

    it('handles partial visualization data', () => {
      const partialViz: FailureVisualizationData = {
        failureBody: 'Just the body feeling',
      };
      const { getByText, queryByText } = render(
        <FailureViz visualization={partialViz} />
      );

      expect(getByText('Body')).toBeTruthy();
      expect(getByText('Just the body feeling')).toBeTruthy();
      expect(queryByText('Mind')).toBeNull();
      expect(queryByText('Emotion')).toBeNull();
    });
  });

  describe('Streak loss preview', () => {
    it('displays streak loss when streakCount is provided', () => {
      const { getByText } = render(
        <FailureViz visualization={mockVisualization} streakCount={14} />
      );

      expect(getByText('14 days gone. Starting over from zero.')).toBeTruthy();
    });

    it('hides streak loss when streakCount is 0', () => {
      const { queryByText } = render(
        <FailureViz visualization={mockVisualization} streakCount={0} />
      );

      expect(queryByText(/days gone/)).toBeNull();
    });

    it('hides streak loss when streakCount is undefined', () => {
      const { queryByText } = render(
        <FailureViz visualization={mockVisualization} />
      );

      expect(queryByText(/days gone/)).toBeNull();
    });
  });

  describe('Empty state', () => {
    it('shows empty state when visualization is undefined', () => {
      const { getByText } = render(<FailureViz visualization={undefined} />);

      expect(getByText("Imagine how you'll feel if you skip")).toBeTruthy();
    });

    it('shows empty state when all fields are empty', () => {
      const emptyViz: FailureVisualizationData = {};
      const { getByText } = render(<FailureViz visualization={emptyViz} />);

      expect(getByText("Imagine how you'll feel if you skip")).toBeTruthy();
    });

    it('shows guidance to add visualization', () => {
      const { getByText } = render(<FailureViz visualization={undefined} />);

      expect(
        getByText('Add failure visualization in the Motivation tab')
      ).toBeTruthy();
    });
  });

  describe('Science tip', () => {
    it('displays loss aversion science tip', () => {
      const { getByText } = render(
        <FailureViz visualization={mockVisualization} />
      );

      expect(
        getByText(/Loss aversion: This feeling moves you 2x more/)
      ).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('accepts reduceMotion prop', () => {
      const { getByText } = render(
        <FailureViz visualization={mockVisualization} reduceMotion={true} />
      );

      expect(getByText('If You Skip Today...')).toBeTruthy();
    });

    it('accepts className prop', () => {
      const { getByText } = render(
        <FailureViz
          visualization={mockVisualization}
          className='custom-class'
        />
      );

      expect(getByText('If You Skip Today...')).toBeTruthy();
    });
  });
});
