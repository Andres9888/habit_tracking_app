/**
 * ContextAwareViz Tests
 * Story T7.5 - Create `ContextAwareViz` that shows success OR failure
 *
 * Tests:
 * - Shows success visualization when motivated (ready)
 * - Shows failure visualization when unmotivated (not_motivated, meh)
 * - Displays Body/Mind/Emotion fields correctly
 * - Shows empty state when no visualization data
 * - forceType prop overrides motivation logic
 * - Compact mode rendering
 * - Accessibility support
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { ContextAwareViz, type VisualizationData } from '../ContextAwareViz';
import type { MotivationLevel } from '../MotivationCheck';

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
  Sparkles: () => null,
  AlertTriangle: () => null,
  Brain: () => null,
  Heart: () => null,
  User: () => null,
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
    withTiming: (value: unknown, _config?: unknown, _callback?: unknown) => value,
    withSequence: (...values: unknown[]) => values[values.length - 1],
    withDelay: (_delay: unknown, value: unknown) => value,
    View,
  };
});

// Mock MotivationCheck's shouldShowFailureViz
jest.mock('../MotivationCheck', () => ({
  shouldShowFailureViz: (level: MotivationLevel | undefined) => {
    if (!level) return false;
    return level === 'not_motivated' || level === 'meh';
  },
}));

describe('ContextAwareViz', () => {
  const fullVisualization: VisualizationData = {
    successBody: 'Light and energetic',
    successMind: 'Clear and focused',
    successEmotion: 'Proud and accomplished',
    failureBody: 'Heavy and sluggish',
    failureMind: 'Foggy and making excuses',
    failureEmotion: 'Regret and disappointment',
  };

  const successOnlyVisualization: VisualizationData = {
    successBody: 'Light and energetic',
    successMind: 'Clear and focused',
    successEmotion: 'Proud and accomplished',
  };

  const failureOnlyVisualization: VisualizationData = {
    failureBody: 'Heavy and sluggish',
    failureMind: 'Foggy and making excuses',
    failureEmotion: 'Regret and disappointment',
  };

  describe('Motivation-based visualization selection', () => {
    it('shows success visualization when motivationLevel is ready', () => {
      const { getByText, queryByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={fullVisualization}
        />
      );

      // Should show success content
      expect(getByText('Visualize Success')).toBeTruthy();
      expect(getByText('Light and energetic')).toBeTruthy();
      expect(getByText('Clear and focused')).toBeTruthy();
      expect(getByText('Proud and accomplished')).toBeTruthy();

      // Should NOT show failure content
      expect(queryByText('Visualize Consequences')).toBeNull();
      expect(queryByText('Heavy and sluggish')).toBeNull();
    });

    it('shows failure visualization when motivationLevel is not_motivated', () => {
      const { getByText, queryByText } = render(
        <ContextAwareViz
          motivationLevel='not_motivated'
          visualization={fullVisualization}
        />
      );

      // Should show failure content
      expect(getByText('Visualize Consequences')).toBeTruthy();
      expect(getByText('Heavy and sluggish')).toBeTruthy();
      expect(getByText('Foggy and making excuses')).toBeTruthy();
      expect(getByText('Regret and disappointment')).toBeTruthy();

      // Should NOT show success content
      expect(queryByText('Visualize Success')).toBeNull();
      expect(queryByText('Light and energetic')).toBeNull();
    });

    it('shows failure visualization when motivationLevel is meh', () => {
      const { getByText, queryByText } = render(
        <ContextAwareViz
          motivationLevel='meh'
          visualization={fullVisualization}
        />
      );

      // Should show failure content
      expect(getByText('Visualize Consequences')).toBeTruthy();
      expect(getByText('Heavy and sluggish')).toBeTruthy();

      // Should NOT show success content
      expect(queryByText('Visualize Success')).toBeNull();
    });
  });

  describe('Body/Mind/Emotion fields', () => {
    it('displays all three field labels', () => {
      const { getAllByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={fullVisualization}
        />
      );

      expect(getAllByText('Body').length).toBe(1);
      expect(getAllByText('Mind').length).toBe(1);
      expect(getAllByText('Emotion').length).toBe(1);
    });

    it('shows only filled fields', () => {
      const partialViz: VisualizationData = {
        successBody: 'Light and energetic',
        // No successMind
        successEmotion: 'Proud',
      };

      const { getByText, queryByText } = render(
        <ContextAwareViz motivationLevel='ready' visualization={partialViz} />
      );

      expect(getByText('Light and energetic')).toBeTruthy();
      expect(getByText('Proud')).toBeTruthy();
      // Mind field should not appear since it's not set
    });
  });

  describe('Empty state', () => {
    it('shows empty state when no visualization data', () => {
      const { getByText } = render(
        <ContextAwareViz motivationLevel='ready' visualization={undefined} />
      );

      expect(getByText('No visualization set up yet')).toBeTruthy();
    });

    it('shows empty state when visualization is empty object', () => {
      const { getByText } = render(
        <ContextAwareViz motivationLevel='ready' visualization={{}} />
      );

      expect(getByText('No visualization set up yet')).toBeTruthy();
    });

    it('shows empty state for success when only failure data exists', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={failureOnlyVisualization}
        />
      );

      // Should show success header but empty state
      expect(getByText('Visualize Success')).toBeTruthy();
      expect(getByText('No visualization set up yet')).toBeTruthy();
    });

    it('shows empty state for failure when only success data exists', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='not_motivated'
          visualization={successOnlyVisualization}
        />
      );

      // Should show failure header but empty state
      expect(getByText('Visualize Consequences')).toBeTruthy();
      expect(getByText('No visualization set up yet')).toBeTruthy();
    });
  });

  describe('forceType prop', () => {
    it('shows success visualization when forceType is success regardless of motivation', () => {
      const { getByText, queryByText } = render(
        <ContextAwareViz
          motivationLevel='not_motivated'
          visualization={fullVisualization}
          forceType='success'
        />
      );

      expect(getByText('Visualize Success')).toBeTruthy();
      expect(getByText('Light and energetic')).toBeTruthy();
      expect(queryByText('Visualize Consequences')).toBeNull();
    });

    it('shows failure visualization when forceType is failure regardless of motivation', () => {
      const { getByText, queryByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={fullVisualization}
          forceType='failure'
        />
      );

      expect(getByText('Visualize Consequences')).toBeTruthy();
      expect(getByText('Heavy and sluggish')).toBeTruthy();
      expect(queryByText('Visualize Success')).toBeNull();
    });
  });

  describe('Compact mode', () => {
    it('renders in compact mode without header', () => {
      const { getByText, queryByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={fullVisualization}
          compact={true}
        />
      );

      // Should show content but not the header
      expect(getByText('Light and energetic')).toBeTruthy();
      expect(queryByText('Visualize Success')).toBeNull();
    });

    it('shows compact empty state message', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={{}}
          compact={true}
        />
      );

      expect(
        getByText(/Set up success visualization in the Motivation tab/)
      ).toBeTruthy();
    });
  });

  describe('Science tips', () => {
    it('shows "Feel it" prompt for success visualization', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={fullVisualization}
        />
      );

      expect(getByText(/Feel this success in your body now/)).toBeTruthy();
    });

    it('shows "Feel it" prompt for failure visualization', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='not_motivated'
          visualization={fullVisualization}
        />
      );

      expect(getByText(/Feel this weight of skipping now/)).toBeTruthy();
    });

    it('shows loss aversion tip for failure visualization', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='not_motivated'
          visualization={fullVisualization}
        />
      );

      expect(getByText(/Loss aversion/)).toBeTruthy();
    });

    it('does NOT show loss aversion tip for success visualization', () => {
      const { queryByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={fullVisualization}
        />
      );

      expect(queryByText(/Loss aversion/)).toBeNull();
    });
  });

  describe('Subtitles', () => {
    it('shows appropriate subtitle for success', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={fullVisualization}
        />
      );

      expect(getByText('Feel the energy of completing this')).toBeTruthy();
    });

    it('shows appropriate subtitle for failure', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='not_motivated'
          visualization={fullVisualization}
        />
      );

      expect(getByText('Feel the weight of skipping this')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('accepts reduceMotion prop', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel='ready'
          visualization={fullVisualization}
          reduceMotion={true}
        />
      );

      expect(getByText('Visualize Success')).toBeTruthy();
    });
  });

  describe('Edge cases', () => {
    it('handles undefined motivationLevel by showing success (default)', () => {
      const { getByText } = render(
        <ContextAwareViz
          motivationLevel={undefined}
          visualization={fullVisualization}
        />
      );

      // When motivation is undefined, shouldShowFailureViz returns false
      // so we show success
      expect(getByText('Visualize Success')).toBeTruthy();
    });
  });
});
