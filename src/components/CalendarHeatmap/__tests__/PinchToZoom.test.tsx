/**
 * PinchToZoom Tests
 * Unit and integration tests for pinch-to-zoom view transition functionality
 */

import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { Text, View } from 'react-native';
import { PinchToZoomContainer } from '../PinchToZoomContainer';
import {
  VIEW_ZOOM_ORDER,
  VIEW_MODE_LABELS,
  getZoomInView,
  getZoomOutView,
  canZoomIn,
  canZoomOut,
} from '../PinchToZoomTypes';
import type { CalendarViewMode, ZoomDirection } from '../PinchToZoomTypes';

// Mock dependencies - using global mocks from jest.setup.js for:
// - react-native-reanimated
// - react-native-gesture-handler
// - expo-haptics

// Only define test-specific mocks here
jest.mock('../../../hooks/useReduceMotion', () => ({
  useReduceMotion: () => false,
}));

// Mock AccessibilityInfo module
jest.mock(
  'react-native/Libraries/Components/AccessibilityInfo/AccessibilityInfo',
  () => ({
    __esModule: true,
    default: {
      announceForAccessibility: jest.fn(),
      isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
      addEventListener: jest.fn(() => ({ remove: jest.fn() })),
      removeEventListener: jest.fn(),
    },
    announceForAccessibility: jest.fn(),
    isReduceMotionEnabled: jest.fn(() => Promise.resolve(false)),
    addEventListener: jest.fn(() => ({ remove: jest.fn() })),
    removeEventListener: jest.fn(),
  })
);

import { AccessibilityInfo } from 'react-native';
import * as Haptics from 'expo-haptics';

describe('PinchToZoom', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // Utility Functions Tests
  // ============================================================================

  describe('VIEW_ZOOM_ORDER', () => {
    it('should have correct order from most zoomed in to most zoomed out', () => {
      expect(VIEW_ZOOM_ORDER).toEqual(['week', 'month', '3m', 'year']);
    });

    it('should have exactly 4 view modes', () => {
      expect(VIEW_ZOOM_ORDER).toHaveLength(4);
    });
  });

  describe('VIEW_MODE_LABELS', () => {
    it('should have labels for all view modes', () => {
      expect(VIEW_MODE_LABELS).toEqual({
        week: 'Week',
        month: 'Month',
        '3m': '3 Months',
        year: 'Year',
      });
    });

    it('should have label for each view in zoom order', () => {
      VIEW_ZOOM_ORDER.forEach((view) => {
        expect(VIEW_MODE_LABELS[view]).toBeDefined();
        expect(typeof VIEW_MODE_LABELS[view]).toBe('string');
      });
    });
  });

  describe('getZoomInView', () => {
    it('should return null when already at week view (most zoomed in)', () => {
      expect(getZoomInView('week')).toBeNull();
    });

    it('should return week when at month view', () => {
      expect(getZoomInView('month')).toBe('week');
    });

    it('should return month when at 3m view', () => {
      expect(getZoomInView('3m')).toBe('month');
    });

    it('should return 3m when at year view', () => {
      expect(getZoomInView('year')).toBe('3m');
    });
  });

  describe('getZoomOutView', () => {
    it('should return month when at week view', () => {
      expect(getZoomOutView('week')).toBe('month');
    });

    it('should return 3m when at month view', () => {
      expect(getZoomOutView('month')).toBe('3m');
    });

    it('should return year when at 3m view', () => {
      expect(getZoomOutView('3m')).toBe('year');
    });

    it('should return null when already at year view (most zoomed out)', () => {
      expect(getZoomOutView('year')).toBeNull();
    });
  });

  describe('canZoomIn', () => {
    it('should return false for week view', () => {
      expect(canZoomIn('week')).toBe(false);
    });

    it('should return true for month view', () => {
      expect(canZoomIn('month')).toBe(true);
    });

    it('should return true for 3m view', () => {
      expect(canZoomIn('3m')).toBe(true);
    });

    it('should return true for year view', () => {
      expect(canZoomIn('year')).toBe(true);
    });
  });

  describe('canZoomOut', () => {
    it('should return true for week view (premium)', () => {
      expect(canZoomOut('week', true)).toBe(true);
    });

    it('should return true for month view (premium)', () => {
      expect(canZoomOut('month', true)).toBe(true);
    });

    it('should return true for 3m view (premium)', () => {
      expect(canZoomOut('3m', true)).toBe(true);
    });

    it('should return false for year view (already most zoomed out)', () => {
      expect(canZoomOut('year', true)).toBe(false);
    });

    it('should return false for 3m view when non-premium (year requires premium)', () => {
      expect(canZoomOut('3m', false)).toBe(false);
    });

    it('should return true for month view when non-premium (3m does not require premium)', () => {
      expect(canZoomOut('month', false)).toBe(true);
    });

    it('should return true for week view when non-premium', () => {
      expect(canZoomOut('week', false)).toBe(true);
    });

    it('should default to premium=true when not specified', () => {
      expect(canZoomOut('3m')).toBe(true);
    });
  });

  // ============================================================================
  // PinchToZoomContainer Tests
  // ============================================================================

  describe('PinchToZoomContainer', () => {
    const defaultProps = {
      currentView: 'month' as CalendarViewMode,
      onViewChange: jest.fn(),
    };

    const MockChild = () => (
      <View testID='mock-child'>
        <Text>Calendar Content</Text>
      </View>
    );

    describe('Rendering', () => {
      it('should render children', () => {
        const { getByTestId } = render(
          <PinchToZoomContainer {...defaultProps}>
            <MockChild />
          </PinchToZoomContainer>
        );

        expect(getByTestId('mock-child')).toBeDefined();
      });

      it('should render pinch zoom container', () => {
        const { getByTestId } = render(
          <PinchToZoomContainer {...defaultProps}>
            <MockChild />
          </PinchToZoomContainer>
        );

        // The GestureDetector wrapper is transparent in mocks, just verify the inner container
        expect(getByTestId('pinch-zoom-container')).toBeDefined();
      });

      it('should render with all view modes', () => {
        VIEW_ZOOM_ORDER.forEach((view) => {
          const { getByTestId } = render(
            <PinchToZoomContainer {...defaultProps} currentView={view}>
              <MockChild />
            </PinchToZoomContainer>
          );

          expect(getByTestId('mock-child')).toBeDefined();
        });
      });
    });

    describe('Accessibility', () => {
      it('should have adjustable role', () => {
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer {...defaultProps}>
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        expect(container).toBeDefined();
      });

      it('should have accessibility label with current view', () => {
        const { getByLabelText } = render(
          <PinchToZoomContainer {...defaultProps} currentView='month'>
            <MockChild />
          </PinchToZoomContainer>
        );

        expect(getByLabelText('Calendar Month view')).toBeDefined();
      });

      it('should have accessibility label for each view mode', () => {
        VIEW_ZOOM_ORDER.forEach((view) => {
          const { getByLabelText } = render(
            <PinchToZoomContainer {...defaultProps} currentView={view}>
              <MockChild />
            </PinchToZoomContainer>
          );

          const label = `Calendar ${VIEW_MODE_LABELS[view]} view`;
          expect(getByLabelText(label)).toBeDefined();
        });
      });

      it('should have accessibility hint when pinch enabled', () => {
        const { getByA11yHint } = render(
          <PinchToZoomContainer {...defaultProps} currentView='month'>
            <MockChild />
          </PinchToZoomContainer>
        );

        // Month view can zoom in to week and zoom out to 3m
        expect(
          getByA11yHint(/Pinch outward to zoom in to Week view/)
        ).toBeDefined();
      });

      it('should not have accessibility hint when pinch disabled', () => {
        const { queryByA11yHint } = render(
          <PinchToZoomContainer {...defaultProps} pinchEnabled={false}>
            <MockChild />
          </PinchToZoomContainer>
        );

        expect(queryByA11yHint(/Pinch/)).toBeNull();
      });

      it('should have accessibility actions for increment and decrement', () => {
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer {...defaultProps}>
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        expect(container.props.accessibilityActions).toEqual([
          { name: 'increment', label: 'Zoom in' },
          { name: 'decrement', label: 'Zoom out' },
        ]);
      });

      it('should handle accessibility increment action (zoom in)', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='month'
            onViewChange={onViewChange}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'increment' },
          });
        });

        expect(onViewChange).toHaveBeenCalledWith('week', 'in');
      });

      it('should handle accessibility decrement action (zoom out)', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='month'
            onViewChange={onViewChange}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });

        expect(onViewChange).toHaveBeenCalledWith('3m', 'out');
      });

      it('should announce view change for screen readers on zoom in', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='month'
            onViewChange={onViewChange}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'increment' },
          });
        });

        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          'Zoomed in to Week view'
        );
      });

      it('should announce view change for screen readers on zoom out', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='month'
            onViewChange={onViewChange}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });

        expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(
          'Zoomed out to 3 Months view'
        );
      });
    });

    describe('Premium Gating', () => {
      it('should include premium message in hint when zooming out to year is blocked', () => {
        const { getByA11yHint } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='3m'
            isPremium={false}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        expect(
          getByA11yHint(/Year view requires premium subscription/)
        ).toBeDefined();
      });

      it('should call onPremiumUpsell when non-premium user tries to zoom to year', () => {
        const onPremiumUpsell = jest.fn();
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='3m'
            isPremium={false}
            onPremiumUpsell={onPremiumUpsell}
            onViewChange={onViewChange}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });

        expect(onPremiumUpsell).toHaveBeenCalled();
        expect(onViewChange).not.toHaveBeenCalled();
      });

      it('should allow zoom to year for premium users', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='3m'
            isPremium={true}
            onViewChange={onViewChange}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });

        expect(onViewChange).toHaveBeenCalledWith('year', 'out');
      });

      it('should trigger warning haptic for premium upsell', () => {
        const onPremiumUpsell = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='3m'
            isPremium={false}
            onPremiumUpsell={onPremiumUpsell}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });

        expect(Haptics.notificationAsync).toHaveBeenCalledWith('warning');
      });
    });

    describe('Haptic Feedback', () => {
      it('should trigger medium impact haptic on successful zoom', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='month'
            onViewChange={onViewChange}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'increment' },
          });
        });

        expect(Haptics.impactAsync).toHaveBeenCalledWith('medium');
      });

      it('should not trigger haptic when disableHaptics is true', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='month'
            onViewChange={onViewChange}
            disableHaptics={true}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'increment' },
          });
        });

        expect(Haptics.impactAsync).not.toHaveBeenCalled();
        expect(Haptics.notificationAsync).not.toHaveBeenCalled();
      });
    });

    describe('Edge Cases', () => {
      it('should not zoom in when already at week view', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='week'
            onViewChange={onViewChange}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'increment' },
          });
        });

        expect(onViewChange).not.toHaveBeenCalled();
      });

      it('should not zoom out when already at year view', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='year'
            onViewChange={onViewChange}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });

        expect(onViewChange).not.toHaveBeenCalled();
      });

      it('should handle undefined onPremiumUpsell gracefully', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='3m'
            isPremium={false}
            onViewChange={onViewChange}
            // onPremiumUpsell not provided
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });

        // Should not throw
        expect(() => {
          act(() => {
            container.props.onAccessibilityAction({
              nativeEvent: { actionName: 'decrement' },
            });
          });
        }).not.toThrow();

        expect(onViewChange).not.toHaveBeenCalled();
      });
    });

    describe('Props Validation', () => {
      it('should default pinchEnabled to true', () => {
        const { getByA11yHint } = render(
          <PinchToZoomContainer {...defaultProps}>
            <MockChild />
          </PinchToZoomContainer>
        );

        // If pinch is enabled, hint should be present
        expect(getByA11yHint(/Pinch/)).toBeDefined();
      });

      it('should default isPremium to true', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='3m'
            onViewChange={onViewChange}
            // isPremium not provided
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });

        // Should allow year view (default isPremium=true)
        expect(onViewChange).toHaveBeenCalledWith('year', 'out');
      });

      it('should default disableHaptics to false', () => {
        const onViewChange = jest.fn();
        const { UNSAFE_getByProps } = render(
          <PinchToZoomContainer
            {...defaultProps}
            currentView='month'
            onViewChange={onViewChange}
            // disableHaptics not provided
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        const container = UNSAFE_getByProps({
          accessibilityRole: 'adjustable',
        });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'increment' },
          });
        });

        // Haptics should be triggered
        expect(Haptics.impactAsync).toHaveBeenCalled();
      });
    });

    describe('Complete Zoom Sequence', () => {
      it('should allow zooming through all views: week → month → 3m → year', () => {
        const onViewChange = jest.fn();
        let currentView: CalendarViewMode = 'week';

        const { UNSAFE_getByProps, rerender } = render(
          <PinchToZoomContainer
            currentView={currentView}
            onViewChange={(newView, direction) => {
              onViewChange(newView, direction);
              currentView = newView;
            }}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        // Zoom out from week → month
        let container = UNSAFE_getByProps({ accessibilityRole: 'adjustable' });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });
        expect(onViewChange).toHaveBeenLastCalledWith('month', 'out');

        // Rerender with new view
        rerender(
          <PinchToZoomContainer
            currentView='month'
            onViewChange={(newView, direction) => {
              onViewChange(newView, direction);
              currentView = newView;
            }}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        // Zoom out from month → 3m
        container = UNSAFE_getByProps({ accessibilityRole: 'adjustable' });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });
        expect(onViewChange).toHaveBeenLastCalledWith('3m', 'out');

        // Rerender with new view
        rerender(
          <PinchToZoomContainer
            currentView='3m'
            onViewChange={(newView, direction) => {
              onViewChange(newView, direction);
              currentView = newView;
            }}
          >
            <MockChild />
          </PinchToZoomContainer>
        );

        // Zoom out from 3m → year
        container = UNSAFE_getByProps({ accessibilityRole: 'adjustable' });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'decrement' },
          });
        });
        expect(onViewChange).toHaveBeenLastCalledWith('year', 'out');
      });

      it('should allow zooming through all views: year → 3m → month → week', () => {
        const onViewChange = jest.fn();

        const { UNSAFE_getByProps, rerender } = render(
          <PinchToZoomContainer currentView='year' onViewChange={onViewChange}>
            <MockChild />
          </PinchToZoomContainer>
        );

        // Zoom in from year → 3m
        let container = UNSAFE_getByProps({ accessibilityRole: 'adjustable' });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'increment' },
          });
        });
        expect(onViewChange).toHaveBeenLastCalledWith('3m', 'in');

        // Rerender and zoom in from 3m → month
        rerender(
          <PinchToZoomContainer currentView='3m' onViewChange={onViewChange}>
            <MockChild />
          </PinchToZoomContainer>
        );
        container = UNSAFE_getByProps({ accessibilityRole: 'adjustable' });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'increment' },
          });
        });
        expect(onViewChange).toHaveBeenLastCalledWith('month', 'in');

        // Rerender and zoom in from month → week
        rerender(
          <PinchToZoomContainer currentView='month' onViewChange={onViewChange}>
            <MockChild />
          </PinchToZoomContainer>
        );
        container = UNSAFE_getByProps({ accessibilityRole: 'adjustable' });
        act(() => {
          container.props.onAccessibilityAction({
            nativeEvent: { actionName: 'increment' },
          });
        });
        expect(onViewChange).toHaveBeenLastCalledWith('week', 'in');
      });
    });
  });
});
