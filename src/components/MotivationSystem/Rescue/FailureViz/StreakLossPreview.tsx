/**
 * StreakLossPreview Component
 * Shows what user will lose if they skip - leverages loss aversion
 */

import React, { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Flame } from 'lucide-react-native';
import type { StreakLossPreviewProps } from './FailureViz.types';
import { SPRING_BOUNCY } from './FailureViz.constants';

export function StreakLossPreview({
  streakCount,
  reduceMotion,
}: StreakLossPreviewProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (reduceMotion) return;

    // Shake animation to emphasize loss
    scale.value = withDelay(
      600,
      withSequence(
        withSpring(1.05, SPRING_BOUNCY),
        withSpring(1, SPRING_BOUNCY)
      )
    );
  }, [reduceMotion, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      className='mt-3 flex-row items-center gap-2 rounded-xl bg-rose-500/10 p-3'
      style={animatedStyle}
    >
      <Flame className='text-rose-500' size={18} />
      <Text className='flex-1 text-sm font-medium text-rose-700'>
        {streakCount} days gone. Starting over from zero.
      </Text>
    </Animated.View>
  );
}
