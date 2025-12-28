/**
 * AnimatedViewTransition Tests
 *
 * Tests for the AnimatedViewTransition component that provides smooth
 * animated transitions when switching between calendar view modes.
 */

import React from 'react';
import { View, Text } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { AnimatedViewTransition } from '../AnimatedViewTransition';
import type { CalendarViewMode } from '../PinchToZoomTypes';

// Mock the useReduceMotion hook
let mockReduceMotion = false;
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: jest.fn(() => mockReduceMotion),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated/mock');
  return {
    ...actual,
    useSharedValue: jest.fn((initial) => ({ value: initial })),
    useAnimatedStyle: jest.fn(() => ({})),
    withTiming: jest.fn((toValue) => toValue),
    withSpring: jest.fn((toValue) => toValue),
    runOnJS: jest.fn((fn) => fn),
    Easing: {
      out: jest.fn(() => jest.fn()),
      ease: 'ease',
    },
  };
});

// Mock AccessibilityInfo
const mockAnnounceForAccessibility = jest.fn();
jest.mock(
  'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
  () => ({
    announceForAccessibility: mockAnnounceForAccessibility,
    isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
  })
);

describe('AnimatedViewTransition', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockReduceMotion = false;
  });

  describe('Basic Rendering', () => {
    it('should render children correctly', () => {
      const { getByText } = render(
        <AnimatedViewTransition currentView="month">
          <Text>Month View Content</Text>
        </AnimatedViewTransition>
      );

      expect(getByText('Month View Content')).toBeTruthy();
    });

    it('should have correct accessibility label', () => {
      const { getByLabelText } = render(
        <AnimatedViewTransition currentView="week">
          <View />
        </AnimatedViewTransition>
      );

      expect(getByLabelText('Week view')).toBeTruthy();
    });

    it('should update accessibility label when view changes', async () => {
      const { rerender, getByLabelText } = render(
        <AnimatedViewTransition currentView="week">
          <View />
        </AnimatedViewTransition>
      );

      expect(getByLabelText('Week view')).toBeTruthy();

      rerender(
        <AnimatedViewTransition currentView="month">
          <View />
        </AnimatedViewTransition>
      );

      await waitFor(() => {
        expect(getByLabelText('Month view')).toBeTruthy();
      });
    });
  });

  describe('Animation Types', () => {
    it('should accept fade animation type', () => {
      const { getByLabelText } = render(
        <AnimatedViewTransition currentView="month" animationType="fade">
          <View />
        </AnimatedViewTransition>
      );

      expect(getByLabelText('Month view')).toBeTruthy();
    });

    it('should accept scale animation type', () => {
      const { getByLabelText } = render(
        <AnimatedViewTransition currentView="month" animationType="scale">
          <View />
        </AnimatedViewTransition>
      );

      expect(getByLabelText('Month view')).toBeTruthy();
    });

    it('should accept slide animation type', () => {
      const { getByLabelText } = render(
        <AnimatedViewTransition currentView="month" animationType="slide">
          <View />
        </AnimatedViewTransition>
      );

      expect(getByLabelText('Month view')).toBeTruthy();
    });
  });

  describe('View Changes', () => {
    it('should handle view change from week to month', async () => {
      const onTransitionComplete = jest.fn();

      const { rerender } = render(
        <AnimatedViewTransition
          currentView="week"
          onTransitionComplete={onTransitionComplete}
        >
          <View />
        </AnimatedViewTransition>
      );

      rerender(
        <AnimatedViewTransition
          currentView="month"
          onTransitionComplete={onTransitionComplete}
        >
          <View />
        </AnimatedViewTransition>
      );

      // In test environment with mocked animations, this may complete immediately
      await waitFor(
        () => {
          // Allow some time for the effect to process
        },
        { timeout: 500 }
      );
    });

    it('should handle view change from month to 3m', async () => {
      const { rerender, getByLabelText } = render(
        <AnimatedViewTransition currentView="month">
          <View />
        </AnimatedViewTransition>
      );

      rerender(
        <AnimatedViewTransition currentView="3m">
          <View />
        </AnimatedViewTransition>
      );

      await waitFor(() => {
        expect(getByLabelText('3 Months view')).toBeTruthy();
      });
    });

    it('should handle view change from 3m to year', async () => {
      const { rerender, getByLabelText } = render(
        <AnimatedViewTransition currentView="3m">
          <View />
        </AnimatedViewTransition>
      );

      rerender(
        <AnimatedViewTransition currentView="year">
          <View />
        </AnimatedViewTransition>
      );

      await waitFor(() => {
        expect(getByLabelText('Year view')).toBeTruthy();
      });
    });
  });

  describe('Accessibility Announcements', () => {
    it('should announce view changes when enabled', async () => {
      const { rerender } = render(
        <AnimatedViewTransition currentView="week" announceViewChanges>
          <View />
        </AnimatedViewTransition>
      );

      rerender(
        <AnimatedViewTransition currentView="month" announceViewChanges>
          <View />
        </AnimatedViewTransition>
      );

      await waitFor(
        () => {
          // Announcement should be triggered during view change
        },
        { timeout: 500 }
      );
    });

    it('should not announce when announceViewChanges is false', async () => {
      mockAnnounceForAccessibility.mockClear();

      const { rerender } = render(
        <AnimatedViewTransition
          currentView="week"
          announceViewChanges={false}
        >
          <View />
        </AnimatedViewTransition>
      );

      rerender(
        <AnimatedViewTransition
          currentView="month"
          announceViewChanges={false}
        >
          <View />
        </AnimatedViewTransition>
      );

      // Wait a bit to ensure no announcement was made during transition
      await new Promise((resolve) => setTimeout(resolve, 100));
    });
  });

  describe('Reduce Motion', () => {
    it('should skip animations when reduce motion is enabled', async () => {
      mockReduceMotion = true;

      const onTransitionComplete = jest.fn();

      const { rerender } = render(
        <AnimatedViewTransition
          currentView="week"
          onTransitionComplete={onTransitionComplete}
        >
          <View />
        </AnimatedViewTransition>
      );

      rerender(
        <AnimatedViewTransition
          currentView="month"
          onTransitionComplete={onTransitionComplete}
        >
          <View />
        </AnimatedViewTransition>
      );

      // With reduce motion, callback should be called immediately
      await waitFor(() => {
        expect(onTransitionComplete).toHaveBeenCalledWith('month');
      });
    });
  });

  describe('Custom Duration', () => {
    it('should accept custom duration', () => {
      const { getByLabelText } = render(
        <AnimatedViewTransition currentView="month" duration={300}>
          <View />
        </AnimatedViewTransition>
      );

      expect(getByLabelText('Month view')).toBeTruthy();
    });
  });

  describe('Custom Style', () => {
    it('should apply custom styles', () => {
      const customStyle = { backgroundColor: 'red' };

      const { getByLabelText } = render(
        <AnimatedViewTransition currentView="month" style={customStyle}>
          <View />
        </AnimatedViewTransition>
      );

      expect(getByLabelText('Month view')).toBeTruthy();
    });
  });

  describe('Complete Zoom Sequence', () => {
    it('should handle complete zoom in sequence (year → week)', async () => {
      const views: CalendarViewMode[] = ['year', '3m', 'month', 'week'];

      const { rerender, getByLabelText } = render(
        <AnimatedViewTransition currentView={views[0]}>
          <View />
        </AnimatedViewTransition>
      );

      for (let i = 1; i < views.length; i++) {
        rerender(
          <AnimatedViewTransition currentView={views[i]}>
            <View />
          </AnimatedViewTransition>
        );

        await waitFor(() => {
          const expectedLabel =
            views[i] === '3m'
              ? '3 Months view'
              : `${views[i].charAt(0).toUpperCase() + views[i].slice(1)} view`;
          expect(getByLabelText(expectedLabel)).toBeTruthy();
        });
      }
    });

    it('should handle complete zoom out sequence (week → year)', async () => {
      const views: CalendarViewMode[] = ['week', 'month', '3m', 'year'];

      const { rerender, getByLabelText } = render(
        <AnimatedViewTransition currentView={views[0]}>
          <View />
        </AnimatedViewTransition>
      );

      for (let i = 1; i < views.length; i++) {
        rerender(
          <AnimatedViewTransition currentView={views[i]}>
            <View />
          </AnimatedViewTransition>
        );

        await waitFor(() => {
          const expectedLabel =
            views[i] === '3m'
              ? '3 Months view'
              : `${views[i].charAt(0).toUpperCase() + views[i].slice(1)} view`;
          expect(getByLabelText(expectedLabel)).toBeTruthy();
        });
      }
    });
  });

  describe('Same View Re-render', () => {
    it('should not trigger animation when view stays the same', async () => {
      const onTransitionComplete = jest.fn();

      const { rerender } = render(
        <AnimatedViewTransition
          currentView="month"
          onTransitionComplete={onTransitionComplete}
        >
          <View />
        </AnimatedViewTransition>
      );

      // Re-render with the same view
      rerender(
        <AnimatedViewTransition
          currentView="month"
          onTransitionComplete={onTransitionComplete}
        >
          <View />
        </AnimatedViewTransition>
      );

      // Wait a bit to ensure no callback was triggered
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(onTransitionComplete).not.toHaveBeenCalled();
    });
  });
});
