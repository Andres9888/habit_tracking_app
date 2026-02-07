/**
 * ChainLinkAnimation Component
 *
 * Animated chain link icon for habit completion feedback.
 * Provides instant visual feedback (<200ms) for both online and offline completions.
 *
 * @see docs/offline-habit-sync.md T014 - Chain animation for offline completions
 * @see FR-002 - Immediate visual feedback under 200ms
 * @see SC-001 - Habit completion feedback in under 200ms
 */

import React from 'react';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  type SharedValue,
} from 'react-native-reanimated';
import { ChainLinkIcon } from '../../ChainLinkIcon/ChainLinkIcon';
import { useAppTheme } from '../../../theme';

interface ChainLinkAnimationProps {
  /** Animated scale value (0-1 controls visibility, can overshoot for bounce) */
  scale: SharedValue<number>;
  /** Animated rotation value in degrees */
  rotate: SharedValue<number>;
  /** Whether there are pending offline operations (shows subtle indicator) */
  hasPendingOfflineOps?: boolean;
  /** Size of the chain link icon */
  size?: number;
}

/**
 * Animated chain link that scales and rotates during completion celebration.
 *
 * Animation sequence on completion:
 * 1. Scale: 0 → 1.2 → 1 (bouncy spring)
 * 2. Rotate: 0 → 360° (smooth rotation)
 *
 * The animation is designed to feel satisfying while staying under 200ms
 * for the initial visibility change, meeting FR-002 requirements.
 */
export function ChainLinkAnimation({
  scale,
  rotate,
  hasPendingOfflineOps = false,
  size = 20,
}: ChainLinkAnimationProps) {
  const theme = useAppTheme();

  const animatedStyle = useAnimatedStyle(() => {
    // Clamp scale to ensure it's never negative
    const clampedScale = interpolate(
      scale.value,
      [0, 1, 1.5],
      [0, 1, 1.2],
      Extrapolation.CLAMP
    );

    return {
      opacity: interpolate(scale.value, [0, 0.3], [0, 1], Extrapolation.CLAMP),
      transform: [{ scale: clampedScale }, { rotate: `${rotate.value}deg` }],
    };
  });

  // Determine icon color - slightly dimmed when pending sync
  const iconColor = hasPendingOfflineOps
    ? theme.custom.colors.gray[100]
    : theme.custom.colors.text.inverse;

  return (
    <Animated.View style={animatedStyle}>
      <ChainLinkIcon color={iconColor} size={size} variant='filled' />
    </Animated.View>
  );
}
