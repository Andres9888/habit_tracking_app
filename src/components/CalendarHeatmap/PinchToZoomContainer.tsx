/**
 * PinchToZoomContainer
 * Gesture handler wrapper that enables pinch-to-zoom transitions between calendar views
 *
 * Zoom in (pinch in/spread fingers): Shows more detail (year → 3m → month → week)
 * Zoom out (pinch out/squeeze fingers): Shows less detail (week → month → 3m → year)
 */

import React, { useCallback, useMemo } from 'react';
import { View, AccessibilityInfo } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type {
  PinchToZoomContainerProps,
  CalendarViewMode,
  ZoomDirection,
} from './PinchToZoomTypes';
import {
  getZoomInView,
  getZoomOutView,
  canZoomIn,
  canZoomOut,
  VIEW_MODE_LABELS,
} from './PinchToZoomTypes';

// Animation configuration
const SPRING_CONFIG = {
  damping: 20,
  stiffness: 200,
};

// Default thresholds
const DEFAULT_PINCH_IN_THRESHOLD = 1.4; // Scale > 1.4 triggers zoom in
const DEFAULT_PINCH_OUT_THRESHOLD = 0.7; // Scale < 0.7 triggers zoom out

export function PinchToZoomContainer({
  currentView,
  onViewChange,
  pinchEnabled = true,
  pinchInThreshold = DEFAULT_PINCH_IN_THRESHOLD,
  pinchOutThreshold = DEFAULT_PINCH_OUT_THRESHOLD,
  isPremium = true,
  onPremiumUpsell,
  disableHaptics = false,
  children,
}: PinchToZoomContainerProps) {
  const reduceMotion = useReduceMotion();

  // Shared values for animation
  const scale = useSharedValue(1);
  const isTransitioning = useSharedValue(false);

  // Trigger haptic feedback
  const triggerHaptic = useCallback(
    (type: 'success' | 'warning') => {
      if (disableHaptics) return;
      if (type === 'success') {
        void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    },
    [disableHaptics]
  );

  // Announce view change for accessibility
  const announceViewChange = useCallback(
    (newView: CalendarViewMode, direction: ZoomDirection) => {
      const label = VIEW_MODE_LABELS[newView];
      const directionText = direction === 'in' ? 'Zoomed in to' : 'Zoomed out to';
      AccessibilityInfo.announceForAccessibility(`${directionText} ${label} view`);
    },
    []
  );

  // Handle zoom in transition
  const handleZoomIn = useCallback(() => {
    const nextView = getZoomInView(currentView);
    if (!nextView) return;

    triggerHaptic('success');
    announceViewChange(nextView, 'in');
    onViewChange(nextView, 'in');
  }, [currentView, onViewChange, triggerHaptic, announceViewChange]);

  // Handle zoom out transition
  const handleZoomOut = useCallback(() => {
    const nextView = getZoomOutView(currentView);
    if (!nextView) return;

    // Check premium for year view
    if (nextView === 'year' && !isPremium) {
      triggerHaptic('warning');
      onPremiumUpsell?.();
      return;
    }

    triggerHaptic('success');
    announceViewChange(nextView, 'out');
    onViewChange(nextView, 'out');
  }, [
    currentView,
    onViewChange,
    isPremium,
    onPremiumUpsell,
    triggerHaptic,
    announceViewChange,
  ]);

  // Create pinch gesture
  const pinchGesture = useMemo(
    () =>
      Gesture.Pinch()
        .enabled(pinchEnabled)
        .onUpdate((e) => {
          if (isTransitioning.value) return;

          // Apply visual feedback (clamped scale)
          const clampedScale = Math.max(0.5, Math.min(1.5, e.scale));
          scale.value = clampedScale;
        })
        .onEnd((e) => {
          if (isTransitioning.value) {
            // Reset scale without triggering another transition
            scale.value = reduceMotion ? 1 : withSpring(1, SPRING_CONFIG);
            return;
          }

          // Check if threshold was crossed
          if (e.scale >= pinchInThreshold && canZoomIn(currentView)) {
            // Zoom in (spread fingers = more detail)
            isTransitioning.value = true;
            runOnJS(handleZoomIn)();
          } else if (e.scale <= pinchOutThreshold) {
            // Zoom out (pinch fingers = less detail)
            if (canZoomOut(currentView, isPremium)) {
              isTransitioning.value = true;
              runOnJS(handleZoomOut)();
            } else if (!isPremium && getZoomOutView(currentView) === 'year') {
              // Premium upsell
              runOnJS(handleZoomOut)();
            }
          }

          // Reset scale with spring animation
          scale.value = reduceMotion ? 1 : withSpring(1, SPRING_CONFIG);

          // Reset transitioning flag after animation
          if (isTransitioning.value) {
            isTransitioning.value = false;
          }
        }),
    [
      pinchEnabled,
      pinchInThreshold,
      pinchOutThreshold,
      currentView,
      isPremium,
      reduceMotion,
      scale,
      isTransitioning,
      handleZoomIn,
      handleZoomOut,
    ]
  );

  // Animated style for visual feedback
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Generate accessibility hint
  const accessibilityHint = useMemo(() => {
    const hints: string[] = [];

    if (canZoomIn(currentView)) {
      const zoomInView = getZoomInView(currentView);
      if (zoomInView) {
        hints.push(`Pinch outward to zoom in to ${VIEW_MODE_LABELS[zoomInView]} view`);
      }
    }

    if (canZoomOut(currentView, isPremium)) {
      const zoomOutView = getZoomOutView(currentView);
      if (zoomOutView) {
        hints.push(
          `Pinch inward to zoom out to ${VIEW_MODE_LABELS[zoomOutView]} view`
        );
      }
    } else if (!isPremium && getZoomOutView(currentView) === 'year') {
      hints.push('Year view requires premium subscription');
    }

    return hints.length > 0 ? hints.join('. ') : undefined;
  }, [currentView, isPremium]);

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={`Calendar ${VIEW_MODE_LABELS[currentView]} view`}
      accessibilityHint={pinchEnabled ? accessibilityHint : undefined}
      accessibilityActions={[
        { name: 'increment', label: 'Zoom in' },
        { name: 'decrement', label: 'Zoom out' },
      ]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'increment') {
          handleZoomIn();
        } else if (event.nativeEvent.actionName === 'decrement') {
          handleZoomOut();
        }
      }}
    >
      <GestureDetector gesture={pinchGesture}>
        <Animated.View style={animatedStyle} testID="pinch-zoom-container">
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

export default PinchToZoomContainer;
