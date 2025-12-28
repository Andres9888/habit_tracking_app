/**
 * AnimatedViewTransition
 *
 * A wrapper component that provides smooth animated transitions when switching
 * between different calendar view modes (week, month, 3m, year).
 *
 * Animation types:
 * - 'fade': Simple opacity fade (default, fastest)
 * - 'scale': Scale up/down with fade
 * - 'slide': Slide left/right based on zoom direction
 *
 * Respects reduce motion preferences for accessibility.
 */

import React, { useCallback, useEffect, useRef } from 'react';
import { View, AccessibilityInfo, type ViewStyle, type StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
  runOnJS,
  interpolate,
  type WithTimingConfig,
  type WithSpringConfig,
} from 'react-native-reanimated';
import { useReduceMotion } from '../../hooks/useReduceMotion';
import type { CalendarViewMode, ZoomDirection } from './PinchToZoomTypes';
import { VIEW_MODE_LABELS, VIEW_ZOOM_ORDER } from './PinchToZoomTypes';

/**
 * Animation type for view transitions
 */
export type ViewTransitionType = 'fade' | 'scale' | 'slide';

/**
 * Props for AnimatedViewTransition component
 */
export interface AnimatedViewTransitionProps {
  /** Current view mode */
  currentView: CalendarViewMode;

  /** Animation type (default: 'fade') */
  animationType?: ViewTransitionType;

  /** Duration for timing animations in ms (default: 200) */
  duration?: number;

  /** Callback when transition animation completes */
  onTransitionComplete?: (view: CalendarViewMode) => void;

  /** Whether to announce view changes for accessibility (default: true) */
  announceViewChanges?: boolean;

  /** Custom spring configuration for scale/slide animations */
  springConfig?: WithSpringConfig;

  /** Custom timing configuration for fade animations */
  timingConfig?: WithTimingConfig;

  /** Additional styles for the container */
  style?: StyleProp<ViewStyle>;

  /** Children to render inside the animated container */
  children: React.ReactNode;
}

// Default animation configurations
const DEFAULT_TIMING_CONFIG: WithTimingConfig = {
  duration: 200,
  easing: Easing.out(Easing.ease),
};

const DEFAULT_SPRING_CONFIG: WithSpringConfig = {
  damping: 20,
  stiffness: 200,
};

// Scale animation values
const SCALE_OUT = 0.92;
const SCALE_IN = 1.08;

// Slide animation distance (percentage of width)
const SLIDE_DISTANCE = 30;

/**
 * Get zoom direction between two views
 */
function getZoomDirection(
  fromView: CalendarViewMode,
  toView: CalendarViewMode
): ZoomDirection | null {
  const fromIndex = VIEW_ZOOM_ORDER.indexOf(fromView);
  const toIndex = VIEW_ZOOM_ORDER.indexOf(toView);

  if (fromIndex === toIndex) return null;
  return toIndex > fromIndex ? 'out' : 'in';
}

/**
 * AnimatedViewTransition - Wrapper for smooth view transitions
 *
 * @example
 * ```tsx
 * <AnimatedViewTransition
 *   currentView={viewMode}
 *   animationType="scale"
 *   onTransitionComplete={(view) => console.log(`Transitioned to ${view}`)}
 * >
 *   {viewMode === 'week' && <WeekGrid ... />}
 *   {viewMode === 'month' && <MonthGrid ... />}
 *   {viewMode === '3m' && <CalendarGrid ... />}
 *   {viewMode === 'year' && <YearlyCalendarGrid ... />}
 * </AnimatedViewTransition>
 * ```
 */
export function AnimatedViewTransition({
  currentView,
  animationType = 'fade',
  duration = 200,
  onTransitionComplete,
  announceViewChanges = true,
  springConfig,
  timingConfig,
  style,
  children,
}: AnimatedViewTransitionProps) {
  const reduceMotion = useReduceMotion();
  const previousViewRef = useRef<CalendarViewMode>(currentView);

  // Animation shared values
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const isAnimating = useSharedValue(false);

  // Merged configs
  const mergedTimingConfig: WithTimingConfig = {
    ...DEFAULT_TIMING_CONFIG,
    duration,
    ...timingConfig,
  };

  const mergedSpringConfig: WithSpringConfig = {
    ...DEFAULT_SPRING_CONFIG,
    ...springConfig,
  };

  // Announce view change for accessibility
  const announceChange = useCallback(
    (view: CalendarViewMode, direction: ZoomDirection | null) => {
      if (!announceViewChanges) return;

      const label = VIEW_MODE_LABELS[view];
      let announcement = `Switched to ${label} view`;

      if (direction === 'in') {
        announcement = `Zoomed in to ${label} view`;
      } else if (direction === 'out') {
        announcement = `Zoomed out to ${label} view`;
      }

      AccessibilityInfo.announceForAccessibility(announcement);
    },
    [announceViewChanges]
  );

  // Notify transition complete
  const notifyComplete = useCallback(
    (view: CalendarViewMode) => {
      onTransitionComplete?.(view);
    },
    [onTransitionComplete]
  );

  // Handle view change
  useEffect(() => {
    const previousView = previousViewRef.current;

    if (previousView === currentView) {
      return;
    }

    const direction = getZoomDirection(previousView, currentView);

    // Skip animation if reduce motion is enabled
    if (reduceMotion) {
      previousViewRef.current = currentView;
      announceChange(currentView, direction);
      notifyComplete(currentView);
      return;
    }

    // Start animation
    isAnimating.value = true;

    // Phase 1: Animate out (fade out, scale down, or slide out)
    switch (animationType) {
      case 'scale': {
        const targetScale = direction === 'in' ? SCALE_OUT : SCALE_IN;
        opacity.value = withTiming(0, mergedTimingConfig);
        scale.value = withTiming(targetScale, mergedTimingConfig);
        break;
      }
      case 'slide': {
        const targetX = direction === 'out' ? -SLIDE_DISTANCE : SLIDE_DISTANCE;
        opacity.value = withTiming(0, mergedTimingConfig);
        translateX.value = withTiming(targetX, mergedTimingConfig);
        break;
      }
      case 'fade':
      default:
        opacity.value = withTiming(0, mergedTimingConfig);
        break;
    }

    // Phase 2: Reset and animate in
    const animateIn = () => {
      // Set initial positions for entering animation
      switch (animationType) {
        case 'scale': {
          const startScale = direction === 'in' ? SCALE_IN : SCALE_OUT;
          scale.value = startScale;
          break;
        }
        case 'slide': {
          const startX = direction === 'out' ? SLIDE_DISTANCE : -SLIDE_DISTANCE;
          translateX.value = startX;
          break;
        }
      }

      // Animate to final state
      const onComplete = (finished?: boolean) => {
        'worklet';
        if (finished) {
          isAnimating.value = false;
          runOnJS(notifyComplete)(currentView);
        }
      };

      switch (animationType) {
        case 'scale':
          opacity.value = withTiming(1, mergedTimingConfig);
          scale.value = withSpring(1, mergedSpringConfig, onComplete);
          break;
        case 'slide':
          opacity.value = withTiming(1, mergedTimingConfig);
          translateX.value = withSpring(0, mergedSpringConfig, onComplete);
          break;
        case 'fade':
        default:
          opacity.value = withTiming(1, mergedTimingConfig, onComplete);
          break;
      }

      // Update reference after starting enter animation
      previousViewRef.current = currentView;

      // Announce change
      runOnJS(announceChange)(currentView, direction);
    };

    // Use a timeout to sequence the animations
    const timeout = setTimeout(animateIn, mergedTimingConfig.duration! + 16);

    return () => {
      clearTimeout(timeout);
    };
  }, [
    currentView,
    reduceMotion,
    animationType,
    opacity,
    scale,
    translateX,
    isAnimating,
    mergedTimingConfig,
    mergedSpringConfig,
    announceChange,
    notifyComplete,
  ]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    const transforms: { translateX?: number; scale?: number }[] = [];

    if (animationType === 'slide' || animationType === 'scale') {
      transforms.push({ translateX: translateX.value });
    }

    if (animationType === 'scale') {
      transforms.push({ scale: scale.value });
    }

    return {
      opacity: opacity.value,
      transform: transforms.length > 0 ? transforms : undefined,
    };
  });

  return (
    <Animated.View
      style={[animatedStyle, style]}
      accessibilityLabel={`${VIEW_MODE_LABELS[currentView]} view`}
      accessibilityLiveRegion="polite"
    >
      {children}
    </Animated.View>
  );
}

export default AnimatedViewTransition;
