/**
 * SparkleEffect Component
 *
 * Renders a subtle sparkle animation for perfect week celebration.
 */

import React, { useEffect } from 'react';
import { Text } from 'react-native';

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { styles } from './WeeklySummaryStripStyles';

interface SparkleEffectProps {
  isActive: boolean;
  reduceMotion: boolean;
}

/** Animation timing constants */
const SPARKLE_DURATION = 2000;

/**
 * SparkleEffect Component
 * Renders a subtle sparkle animation for perfect week celebration
 */
export const SparkleEffect = React.memo(function SparkleEffect({
  isActive,
  reduceMotion,
}: SparkleEffectProps) {
  const sparkleOpacity = useSharedValue(0);
  const sparkleScale = useSharedValue(1);

  useEffect(() => {
    if (isActive && !reduceMotion) {
      // Continuous subtle sparkle animation
      sparkleOpacity.value = withRepeat(
        withSequence(
          withTiming(0.7, {
            duration: SPARKLE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(0.2, {
            duration: SPARKLE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1, // Infinite repeat
        true // Reverse
      );

      sparkleScale.value = withRepeat(
        withSequence(
          withTiming(1.15, {
            duration: SPARKLE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: SPARKLE_DURATION / 2,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      );
    } else {
      sparkleOpacity.value = 0;
      sparkleScale.value = 1;
    }
  }, [isActive, reduceMotion, sparkleOpacity, sparkleScale]);

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: sparkleOpacity.value,
    transform: [{ scale: sparkleScale.value }],
  }));

  if (!isActive || reduceMotion) return null;

  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility='no-hide-descendants'
      pointerEvents='none'
      style={[styles.sparkleContainer, sparkleAnimatedStyle]}
      testID='perfect-week-sparkle'
    >
      <Text style={styles.sparkleEmoji}>&#10024;</Text>
    </Animated.View>
  );
});
