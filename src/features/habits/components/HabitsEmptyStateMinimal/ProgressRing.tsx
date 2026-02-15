/**
 * ProgressRing - SVG circular progress indicator for success state
 *
 * Features:
 * - Animates stroke-dashoffset from full circumference to 0
 * - Visual feedback for auto-transition timing
 * - Respects reduced motion preference
 * - Uses reanimated for smooth 60fps animation
 */

import { View, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';

import Animated, {
  Easing,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { COLORS } from './constants';
import { PROGRESS_RING } from './animations';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export interface ProgressRingProps {
  /** Duration of the progress animation in ms (default: 1800ms) */
  duration?: number;
  /** Size of the ring in px (default: 120px) */
  size?: number;
  /** Callback when progress animation completes */
  onComplete?: () => void;
}

/**
 * ProgressRing - Shows visual countdown for auto-transition
 *
 * The ring fills clockwise from 12 o'clock position over the specified
 * duration, giving users visual feedback on when the auto-transition will occur.
 */
export function ProgressRing({
  duration = PROGRESS_RING.duration,
  size = PROGRESS_RING.size,
  onComplete,
}: ProgressRingProps) {
  const shouldReduceMotion = useReducedMotion();

  // Use ref for callback to prevent it from triggering useEffect re-runs
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Calculate ring geometry
  const strokeWidth = PROGRESS_RING.strokeWidth;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // Animated progress value (0 to 1)
  const progress = useSharedValue(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      // Complete instantly if reduced motion is preferred
      progress.value = 1;
      onCompleteRef.current?.();
      return;
    }

    // Animate progress from 0 to 1 over the specified duration
    progress.value = withTiming(
      1,
      {
        duration,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished && onCompleteRef.current) {
          // Note: onComplete is called from JS thread, no runOnJS needed
          // since we're using the callback form of withTiming
        }
      }
    );
  }, [duration, progress, shouldReduceMotion]);

  // Animated props for the progress circle
  const animatedProps = useAnimatedProps(() => {
    // strokeDashoffset goes from circumference (empty) to 0 (full)
    // Round to avoid "Loss of precision during arithmetic conversion" error in Reanimated
    const strokeDashoffset = Math.round(circumference * (1 - progress.value));
    return {
      strokeDashoffset,
    };
  });

  return (
    <View style={[styles.container, { height: size, width: size }]}>
      <Svg height={size} width={size}>
        {/* Background circle (gray track) */}
        <Circle
          cx={center}
          cy={center}
          fill="none"
          r={radius}
          stroke={COLORS.stone200}
          strokeWidth={strokeWidth}
        />

        {/* Animated progress circle */}
        <AnimatedCircle
          animatedProps={animatedProps}
          cx={center}
          cy={center}
          fill="none"
          origin={`${center}, ${center}`}
          r={radius}
          stroke={COLORS.emerald500}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          // Rotate to start at 12 o'clock (-90 degrees)
          rotation="-90"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
});
