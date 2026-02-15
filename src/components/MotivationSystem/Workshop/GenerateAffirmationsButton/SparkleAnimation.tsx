/**
 * SparkleAnimation Component
 * Animated sparkle effect during AI generation
 */

import React from 'react';

import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Sparkles } from 'lucide-react-native';

import { SPARKLE_DURATION } from './constants';

interface SparkleAnimationProps {
  reduceMotion?: boolean;
}

export function SparkleAnimation({
  reduceMotion = false,
}: SparkleAnimationProps) {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  React.useEffect(() => {
    if (reduceMotion) {
      rotation.value = 0;
      scale.value = 1;
      return;
    }

    // Continuous rotation
    rotation.value = withRepeat(
      withTiming(360, { duration: SPARKLE_DURATION }),
      -1,
      false
    );

    // Pulsing scale
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: SPARKLE_DURATION / 2 }),
        withTiming(1, { duration: SPARKLE_DURATION / 2 })
      ),
      -1,
      true
    );
  }, [reduceMotion, rotation, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    // Round rotation to avoid "Loss of precision during arithmetic conversion" error
    transform: [
      { rotate: `${Math.round(rotation.value)}deg` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Sparkles className='text-white' size={18} />
    </Animated.View>
  );
}
